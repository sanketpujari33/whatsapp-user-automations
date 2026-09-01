const User = require('../../../models/User');
const Wallet = require('../../../models/Wallet');
const Transaction = require('../../../models/Transaction');
const ConversationLog = require('../../../models/ConversationLog');

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function toPositiveInt(value, fallback, max = 100) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}

function toPageInt(value, fallback = 1, max = 100000) {
  return toPositiveInt(value, fallback, max);
}

function rowsToCountMap(rows) {
  const map = {};
  for (const row of rows || []) {
    const key = row?._id || 'unknown';
    map[key] = row?.count || 0;
  }
  return map;
}

function getMonthWindowStart(months) {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (months - 1), 1, 0, 0, 0, 0));
}

function getMonthBuckets(months) {
  const now = new Date();
  const buckets = [];

  for (let offset = months - 1; offset >= 0; offset -= 1) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1, 0, 0, 0, 0));
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const key = `${year}-${String(month).padStart(2, '0')}`;
    buckets.push({
      key,
      year,
      month,
      label: `${MONTH_NAMES[month - 1]} ${year}`,
    });
  }

  return buckets;
}

async function buildDashboardSummary() {
  const [
    usersCount,
    activeUsersCount,
    walletsCount,
    transactionsCount,
    conversationsCount,
    totalBalanceRows,
    statusRows,
    typeRows,
  ] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ isActive: true }),
    Wallet.countDocuments({}),
    Transaction.countDocuments({}),
    ConversationLog.countDocuments({}),
    Wallet.aggregate([{ $group: { _id: null, totalBalance: { $sum: '$balance' } } }]),
    Transaction.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Transaction.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]),
  ]);

  const totalWalletBalance = Number(totalBalanceRows?.[0]?.totalBalance || 0);
  const byStatus = rowsToCountMap(statusRows);
  const byType = rowsToCountMap(typeRows);

  return {
    summary: {
      usersCount,
      activeUsersCount,
      walletsCount,
      transactionsCount,
      conversationsCount,
      totalWalletBalance,
      pendingTransactions: byStatus.pending || 0,
      successfulTransactions: byStatus.success || 0,
      failedTransactions: byStatus.failed || 0,
    },
    transactionBreakdown: {
      byStatus,
      byType,
    },
  };
}

exports.getStats = async () => {
  const { summary, transactionBreakdown } = await buildDashboardSummary();

  return {
    status: true,
    message: 'Dashboard stats fetched.',
    data: {
      ...summary,
      transactionBreakdown,
    },
  };
};

exports.getOverview = async (req) => {
  const limit = toPositiveInt(req.query?.limit, 10, 50);

  const [{ summary, transactionBreakdown }, latestTransactions] = await Promise.all([
    buildDashboardSummary(),
    Transaction.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('user', 'phone name')
      .populate('fromUser', 'phone name')
      .populate('toUser', 'phone name')
      .lean(),
  ]);

  return {
    status: true,
    message: 'Dashboard overview fetched.',
    data: {
      summary,
      transactionBreakdown,
      latestTransactions,
    },
  };
};

exports.getMonthlyEarning = async (req) => {
  const months = toPositiveInt(req.query?.months, 12, 24);
  const startDate = getMonthWindowStart(months);

  const rows = await Transaction.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: 'success',
        type: { $in: ['credit', 'recharge'] },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        totalAmount: { $sum: '$amount' },
        transactions: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const grouped = {};
  for (const row of rows) {
    const year = row?._id?.year;
    const month = row?._id?.month;
    if (!year || !month) continue;
    const key = `${year}-${String(month).padStart(2, '0')}`;
    grouped[key] = {
      totalAmount: Number(row?.totalAmount || 0),
      transactions: Number(row?.transactions || 0),
    };
  }

  const data = getMonthBuckets(months).map((bucket) => ({
    ...bucket,
    totalAmount: grouped[bucket.key]?.totalAmount || 0,
    transactions: grouped[bucket.key]?.transactions || 0,
  }));

  return {
    status: true,
    message: 'Monthly earning fetched.',
    data,
  };
};

exports.getMonthlyRequests = async (req) => {
  const months = toPositiveInt(req.query?.months, 12, 24);
  const startDate = getMonthWindowStart(months);

  const rows = await ConversationLog.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        requests: { $sum: 1 },
        incoming: {
          $sum: {
            $cond: [{ $eq: ['$direction', 'incoming'] }, 1, 0],
          },
        },
        outgoing: {
          $sum: {
            $cond: [{ $eq: ['$direction', 'outgoing'] }, 1, 0],
          },
        },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const grouped = {};
  for (const row of rows) {
    const year = row?._id?.year;
    const month = row?._id?.month;
    if (!year || !month) continue;
    const key = `${year}-${String(month).padStart(2, '0')}`;
    grouped[key] = {
      requests: Number(row?.requests || 0),
      incoming: Number(row?.incoming || 0),
      outgoing: Number(row?.outgoing || 0),
    };
  }

  const data = getMonthBuckets(months).map((bucket) => ({
    ...bucket,
    requests: grouped[bucket.key]?.requests || 0,
    incoming: grouped[bucket.key]?.incoming || 0,
    outgoing: grouped[bucket.key]?.outgoing || 0,
  }));

  return {
    status: true,
    message: 'Monthly requests fetched.',
    data,
  };
};

exports.getTopUsers = async (req) => {
  const limit = toPositiveInt(req.query?.limit, 10, 100);
  const page = toPageInt(req.query?.page, 1, 100000);
  const skip = (page - 1) * limit;

  const match = {
    status: 'success',
    user: { $ne: null },
  };

  const [countRows, rows] = await Promise.all([
    Transaction.aggregate([
      { $match: match },
      { $group: { _id: '$user' } },
      { $count: 'total' },
    ]),
    Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$user',
          totalAmount: { $sum: '$amount' },
          transactions: { $sum: 1 },
          successfulTransactions: {
            $sum: {
              $cond: [{ $eq: ['$status', 'success'] }, 1, 0],
            },
          },
          lastTransactionAt: { $max: '$createdAt' },
        },
      },
      { $sort: { totalAmount: -1, transactions: -1, lastTransactionAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          name: '$user.name',
          phone: '$user.phone',
          isActive: '$user.isActive',
          totalAmount: 1,
          transactions: 1,
          successfulTransactions: 1,
          lastTransactionAt: 1,
        },
      },
    ]),
  ]);

  const items = rows.map((row) => ({
    userId: row?.userId ? String(row.userId) : null,
    name: row?.name || 'Unknown',
    phone: row?.phone || null,
    isActive: typeof row?.isActive === 'boolean' ? row.isActive : null,
    totalAmount: Number(row?.totalAmount || 0),
    transactions: Number(row?.transactions || 0),
    successfulTransactions: Number(row?.successfulTransactions || 0),
    lastTransactionAt: row?.lastTransactionAt || null,
  }));

  const total = Number(countRows?.[0]?.total || 0);

  return {
    status: true,
    message: 'Top users fetched.',
    data: {
      items,
      total,
      page,
      limit,
      source: 'transactions.user',
    },
  };
};

exports.getInactiveUsers = async (req) => {
  const limit = toPositiveInt(req.query?.limit, 10, 100);
  const page = toPageInt(req.query?.page, 1, 100000);
  const skip = (page - 1) * limit;

  const query = { isActive: false };

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  const items = users.map((user) => ({
    userId: String(user._id),
    name: user.name || 'Unknown',
    phone: user.phone || null,
    isActive: user.isActive,
    createdAt: user.createdAt || null,
  }));

  return {
    status: true,
    message: 'Inactive users fetched.',
    data: {
      items,
      total,
      page,
      limit,
      source: 'users.isActive=false',
    },
  };
};

exports.getRecentTransactions = async (req) => {
  const limit = toPositiveInt(req.query?.limit, 10, 100);

  const items = await Transaction.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'phone name')
    .populate('fromUser', 'phone name')
    .populate('toUser', 'phone name')
    .lean();

  return {
    status: true,
    message: 'Recent transactions fetched.',
    data: {
      items,
      limit,
    },
  };
};
