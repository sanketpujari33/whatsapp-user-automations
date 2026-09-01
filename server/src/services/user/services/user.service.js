const mongoose = require('mongoose');
const User = require('../../../models/User');
const Wallet = require('../../../models/Wallet');
const Transaction = require('../../../models/Transaction');
const ConversationLog = require('../../../models/ConversationLog');
const { normalizePhone } = require('../../../utils/phone');

function toPositiveInt(value, fallback, max = 100) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}

function toPageInt(value, fallback = 1, max = 100000) {
  return toPositiveInt(value, fallback, max);
}

function parseBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  if (['true', '1', 'yes', 'active'].includes(normalized)) return true;
  if (['false', '0', 'no', 'inactive', 'blocked'].includes(normalized)) return false;
  return null;
}

function toIdString(value) {
  if (!value) return null;
  return String(value);
}

function getWelcomeBonusAmount() {
  const raw =
    global.constant?.WELCOME_BONUS ||
    process.env.WELCOME_BONUS ||
    process.env.DEFAULT_WELCOME_BONUS ||
    0;
  const bonus = Number(raw);
  if (!Number.isFinite(bonus) || bonus < 0) return 0;
  return Number(bonus.toFixed(2));
}

function buildRegex(text) {
  return new RegExp(String(text || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
}

function getCustomerFilters(query = {}) {
  const filters = {};
  const search = `${query.search || query.q || ''}`.trim();
  if (search) {
    const regex = buildRegex(search);
    filters.$or = [{ name: regex }, { phone: regex }];
  }

  if (query.phone) {
    const normalizedPhone = normalizePhone(query.phone);
    if (normalizedPhone) {
      filters.phone = normalizedPhone;
    }
  }

  const isActive = parseBoolean(query.isActive);
  if (isActive !== null) {
    filters.isActive = isActive;
  }

  return filters;
}

function getSortQuery(query = {}) {
  const allowed = new Set(['createdAt', 'updatedAt', 'name', 'phone']);
  const sortBy = allowed.has(query.sortBy) ? query.sortBy : 'createdAt';
  const order = `${query.order || ''}`.toLowerCase() === 'asc' ? 1 : -1;
  return { [sortBy]: order };
}

async function getCustomersPage(query = {}) {
  const page = toPageInt(query.page, 1);
  const limit = toPositiveInt(query.limit, 20, 200);
  const skip = (page - 1) * limit;
  const filters = getCustomerFilters(query);
  const sort = getSortQuery(query);

  const [total, users] = await Promise.all([
    User.countDocuments(filters),
    User.find(filters).sort(sort).skip(skip).limit(limit).lean(),
  ]);

  const userIds = users.map((user) => user._id);
  const wallets = userIds.length
    ? await Wallet.find({ user: { $in: userIds } }).select('user balance updatedAt').lean()
    : [];

  const walletByUser = new Map(wallets.map((wallet) => [toIdString(wallet.user), wallet]));

  const items = users.map((user) => {
    const wallet = walletByUser.get(toIdString(user._id));
    return {
      _id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      balance: Number(wallet?.balance || 0),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  });

  return {
    items,
    total,
    page,
    limit,
  };
}

function ensureObjectId(id) {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  return new mongoose.Types.ObjectId(id);
}

async function findUserOrNullById(id) {
  const objectId = ensureObjectId(id);
  if (!objectId) return null;
  return User.findById(objectId).lean();
}

async function findWalletByUser(userId) {
  return Wallet.findOne({ user: userId }).lean();
}

async function findOrCreateUserByPhone(phone) {
  const normalized = normalizePhone(phone);
  if (!normalized) {
    throw new Error('Invalid phone number');
  }

  let user = await User.findOne({ phone: normalized });
  if (user) {
    return { user, isNew: false };
  }

  const guestSuffix = normalized.includes('@')
    ? normalized.split('@')[0].slice(-4)
    : normalized.slice(-4);

  user = await User.create({
    phone: normalized,
    name: `Guest-${guestSuffix}`,
    role: 'user',
    isActive: true,
  });

  const welcomeBonus = getWelcomeBonusAmount();

  await Wallet.create({
    user: user._id,
    balance: welcomeBonus,
  });

  if (welcomeBonus > 0) {
    await Transaction.create({
      type: 'credit',
      status: 'success',
      amount: welcomeBonus,
      user: user._id,
      meta: {
        reason: 'welcome_bonus',
      },
    });
  }

  return { user, isNew: true };
}

async function listCustomers(req) {
  if (req.query?.userId) {
    req.params = req.params || {};
    req.params.id = req.query.userId;
    return getCustomerById(req);
  }

  const data = await getCustomersPage(req.query || {});

  return {
    status: true,
    message: 'Customers fetched.',
    data,
  };
}

async function searchCustomers(req) {
  const query = {
    ...(req.query || {}),
    search: req.query?.search || req.query?.q || req.query?.keyword || '',
  };
  const data = await getCustomersPage(query);
  return {
    status: true,
    message: 'Customer search results fetched.',
    data,
  };
}

async function lookupCustomer(req) {
  const normalizedPhone = normalizePhone(req.query?.phone || req.query?.mobile || req.query?.q || '');
  if (!normalizedPhone) {
    return { status: false, message: 'Valid phone is required for lookup.' };
  }

  const user = await User.findOne({ phone: normalizedPhone }).lean();
  if (!user) {
    return { status: false, message: 'Customer not found.' };
  }

  const wallet = await findWalletByUser(user._id);

  return {
    status: true,
    message: 'Customer fetched.',
    data: {
      _id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      wallet: {
        balance: Number(wallet?.balance || 0),
        updatedAt: wallet?.updatedAt || null,
      },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  };
}

async function getCustomerById(req) {
  const customerId = req.params?.id || req.query?.userId;
  const user = await findUserOrNullById(customerId);

  if (!user) {
    return { status: false, message: 'Customer not found.' };
  }

  const [wallet, txStats, conversationCount, recentTransactions] = await Promise.all([
    findWalletByUser(user._id),
    Transaction.aggregate([
      {
        $match: {
          $or: [{ user: user._id }, { fromUser: user._id }, { toUser: user._id }],
        },
      },
      {
        $group: {
          _id: null,
          totalTransactions: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          successfulTransactions: {
            $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] },
          },
          pendingTransactions: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
          },
          failedTransactions: {
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] },
          },
        },
      },
    ]),
    ConversationLog.countDocuments({ user: user._id }),
    Transaction.find({
      $or: [{ user: user._id }, { fromUser: user._id }, { toUser: user._id }],
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'phone name')
      .populate('fromUser', 'phone name')
      .populate('toUser', 'phone name')
      .lean(),
  ]);

  const summary = txStats?.[0] || {};

  return {
    status: true,
    message: 'Customer fetched.',
    data: {
      user,
      userDetails: user,
      bankDetails: null,
      wallet: {
        balance: Number(wallet?.balance || 0),
        updatedAt: wallet?.updatedAt || null,
      },
      stats: {
        totalTransactions: Number(summary.totalTransactions || 0),
        totalAmount: Number(summary.totalAmount || 0),
        successfulTransactions: Number(summary.successfulTransactions || 0),
        pendingTransactions: Number(summary.pendingTransactions || 0),
        failedTransactions: Number(summary.failedTransactions || 0),
        conversationsCount: Number(conversationCount || 0),
      },
      recentTransactions,
    },
  };
}

async function createCustomer(req) {
  const normalizedPhone = normalizePhone(req.body?.phone || req.body?.mobile || '');
  if (!normalizedPhone) {
    return { status: false, message: 'Valid phone is required.' };
  }

  const existing = await User.findOne({ phone: normalizedPhone }).lean();
  if (existing) {
    return { status: false, message: 'Customer already exists with this phone.' };
  }

  const initialBalanceRaw = Number(req.body?.initialBalance || 0);
  const initialBalance = Number.isFinite(initialBalanceRaw) && initialBalanceRaw >= 0
    ? Number(initialBalanceRaw.toFixed(2))
    : null;

  if (initialBalance === null) {
    return { status: false, message: 'initialBalance must be a non-negative number.' };
  }

  const name = `${req.body?.name || ''}`.trim() || `Guest-${normalizedPhone.slice(-4)}`;
  const role = req.body?.role === 'admin' ? 'admin' : 'user';

  const isActiveParsed = parseBoolean(req.body?.isActive);
  const isActive = isActiveParsed === null ? true : isActiveParsed;

  const user = await User.create({
    phone: normalizedPhone,
    name,
    role,
    isActive,
  });

  const wallet = await Wallet.create({ user: user._id, balance: initialBalance });

  if (initialBalance > 0) {
    await Transaction.create({
      type: 'credit',
      status: 'success',
      amount: initialBalance,
      user: user._id,
      meta: {
        reason: 'admin_initial_balance',
      },
    });
  }

  return {
    status: true,
    message: 'Customer created successfully.',
    data: {
      user,
      wallet,
    },
  };
}

async function updateCustomer(req) {
  const customerId = req.params?.id;
  const user = await findUserOrNullById(customerId);
  if (!user) {
    return { status: false, message: 'Customer not found.' };
  }

  const updates = {};

  if (typeof req.body?.name === 'string') {
    const name = req.body.name.trim();
    if (name) updates.name = name;
  }

  if (req.body?.phone || req.body?.mobile) {
    const normalizedPhone = normalizePhone(req.body?.phone || req.body?.mobile || '');
    if (!normalizedPhone) {
      return { status: false, message: 'Valid phone is required.' };
    }

    const existing = await User.findOne({ phone: normalizedPhone, _id: { $ne: user._id } }).lean();
    if (existing) {
      return { status: false, message: 'Phone is already used by another customer.' };
    }
    updates.phone = normalizedPhone;
  }

  if (req.body?.role && ['user', 'admin'].includes(req.body.role)) {
    updates.role = req.body.role;
  }

  const isActive = parseBoolean(req.body?.isActive);
  if (isActive !== null) {
    updates.isActive = isActive;
  }

  if (Object.keys(updates).length === 0) {
    return { status: false, message: 'No valid fields provided for update.' };
  }

  const updated = await User.findByIdAndUpdate(user._id, { $set: updates }, { new: true }).lean();
  const wallet = await findWalletByUser(user._id);

  return {
    status: true,
    message: 'Customer updated successfully.',
    data: {
      user: updated,
      wallet: {
        balance: Number(wallet?.balance || 0),
        updatedAt: wallet?.updatedAt || null,
      },
    },
  };
}

async function deleteCustomer(req) {
  const customerId = req.params?.id;
  const user = await findUserOrNullById(customerId);
  if (!user) {
    return { status: false, message: 'Customer not found.' };
  }

  if (!user.isActive) {
    return {
      status: true,
      message: 'Customer is already inactive.',
      data: { userId: user._id, isActive: false },
    };
  }

  await User.findByIdAndUpdate(user._id, { $set: { isActive: false } });

  return {
    status: true,
    message: 'Customer deactivated successfully.',
    data: { userId: user._id, isActive: false },
  };
}

async function toggleCustomerBlock(req) {
  const customerId = req.params?.id;
  const user = await findUserOrNullById(customerId);
  if (!user) {
    return { status: false, message: 'Customer not found.' };
  }

  const nextStatus = !user.isActive;
  await User.findByIdAndUpdate(user._id, { $set: { isActive: nextStatus } });

  return {
    status: true,
    message: nextStatus ? 'Customer unblocked successfully.' : 'Customer blocked successfully.',
    data: {
      userId: user._id,
      isActive: nextStatus,
    },
  };
}

async function getCustomerWallet(req) {
  const customerId = req.params?.id;
  const user = await findUserOrNullById(customerId);
  if (!user) {
    return { status: false, message: 'Customer not found.' };
  }

  const [wallet, recentTransactions] = await Promise.all([
    findWalletByUser(user._id),
    Transaction.find({
      $or: [{ user: user._id }, { fromUser: user._id }, { toUser: user._id }],
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(),
  ]);

  return {
    status: true,
    message: 'Customer wallet fetched.',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        isActive: user.isActive,
      },
      wallet: {
        balance: Number(wallet?.balance || 0),
        updatedAt: wallet?.updatedAt || null,
      },
      recentTransactions,
    },
  };
}

async function getCustomerTransactions(req) {
  const customerId = req.params?.id;
  const user = await findUserOrNullById(customerId);
  if (!user) {
    return { status: false, message: 'Customer not found.' };
  }

  const page = toPageInt(req.query?.page, 1);
  const limit = toPositiveInt(req.query?.limit, 20, 200);
  const skip = (page - 1) * limit;

  const match = {
    $or: [{ user: user._id }, { fromUser: user._id }, { toUser: user._id }],
  };

  if (req.query?.type) {
    match.type = req.query.type;
  }
  if (req.query?.status) {
    match.status = req.query.status;
  }

  const [total, items] = await Promise.all([
    Transaction.countDocuments(match),
    Transaction.find(match)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'phone name')
      .populate('fromUser', 'phone name')
      .populate('toUser', 'phone name')
      .lean(),
  ]);

  return {
    status: true,
    message: 'Customer transactions fetched.',
    data: {
      items,
      total,
      page,
      limit,
    },
  };
}

async function getCustomerChatHistory(req) {
  const customerId = req.params?.id;
  const user = await findUserOrNullById(customerId);
  if (!user) {
    return { status: false, message: 'Customer not found.' };
  }

  const page = toPageInt(req.query?.page, 1);
  const limit = toPositiveInt(req.query?.limit, 50, 500);
  const skip = (page - 1) * limit;

  const match = { user: user._id };
  if (req.query?.direction && ['incoming', 'outgoing'].includes(req.query.direction)) {
    match.direction = req.query.direction;
  }

  const [total, items] = await Promise.all([
    ConversationLog.countDocuments(match),
    ConversationLog.find(match).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
  ]);

  return {
    status: true,
    message: 'Customer chat history fetched.',
    data: {
      items,
      total,
      page,
      limit,
    },
  };
}

async function getCustomerCallHistory(req) {
  const customerId = req.params?.id;
  const user = await findUserOrNullById(customerId);
  if (!user) {
    return { status: false, message: 'Customer not found.' };
  }

  return {
    status: true,
    message: 'Call history fetched.',
    data: {
      items: [],
      total: 0,
      page: 1,
      limit: 0,
      note: 'Call history is not tracked in current database models.',
    },
  };
}

function emptyCollectionResponse(label) {
  return {
    status: true,
    message: `${label} fetched.`,
    data: {
      items: [],
      total: 0,
      page: 1,
      limit: 0,
    },
  };
}

async function getCustomerPujaOrders() {
  return emptyCollectionResponse('Puja orders');
}

async function getCustomerShopOrders() {
  return emptyCollectionResponse('Shop orders');
}

async function getCustomerReports() {
  return emptyCollectionResponse('Reports');
}

async function getCustomerFollowingList() {
  return emptyCollectionResponse('Following list');
}

async function getCustomerNotifications() {
  return emptyCollectionResponse('Notifications');
}

async function getCustomerGiftList() {
  return emptyCollectionResponse('Gift list');
}

async function getCustomerSupportTickets() {
  return emptyCollectionResponse('Support tickets');
}

module.exports = {
  findOrCreateUserByPhone,
  listCustomers,
  searchCustomers,
  lookupCustomer,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  toggleCustomerBlock,
  getCustomerWallet,
  getCustomerTransactions,
  getCustomerChatHistory,
  getCustomerCallHistory,
  getCustomerPujaOrders,
  getCustomerShopOrders,
  getCustomerReports,
  getCustomerFollowingList,
  getCustomerNotifications,
  getCustomerGiftList,
  getCustomerSupportTickets,
};