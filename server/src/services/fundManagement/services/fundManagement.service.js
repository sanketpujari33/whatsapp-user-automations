const mongoose = require('mongoose');

const User = require('../../../models/User');
const Wallet = require('../../../models/Wallet');
const Transaction = require('../../../models/Transaction');
const { normalizePhone } = require('../../../utils/phone');

const ALLOWED_TX_TYPES = new Set(['credit', 'debit', 'transfer', 'recharge']);
const ALLOWED_TX_STATUS = new Set(['pending', 'success', 'failed']);

function toPositiveInt(value, fallback, max = 200) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}

function parseAmount(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }
  return Number(amount.toFixed(2));
}

function toObjectId(value) {
  if (!value || !mongoose.Types.ObjectId.isValid(value)) {
    return null;
  }
  return new mongoose.Types.ObjectId(value);
}

function escapeRegex(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseBoolean(value, fallback = null) {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string' && typeof value !== 'number') return fallback;
  const normalized = String(value).trim().toLowerCase();
  if (['true', '1', 'yes', 'active', 'enabled', 'on'].includes(normalized)) return true;
  if (['false', '0', 'no', 'inactive', 'disabled', 'off'].includes(normalized)) return false;
  return fallback;
}

async function resolveUserReference({ userId, phone }) {
  const objectId = toObjectId(userId);
  if (objectId) {
    return User.findById(objectId).lean();
  }

  const normalizedPhone = normalizePhone(phone);
  if (normalizedPhone) {
    return User.findOne({ phone: normalizedPhone }).lean();
  }

  return null;
}

async function getOrCreateWallet(userId, session = null) {
  let query = Wallet.findOne({ user: userId });
  if (session) query = query.session(session);

  let wallet = await query;
  if (wallet) return wallet;

  if (session) {
    const created = await Wallet.create(
      [
        {
          user: userId,
          balance: 0,
        },
      ],
      { session },
    );
    return created[0];
  }

  return Wallet.create({ user: userId, balance: 0 });
}

function mapWalletRow(walletDoc) {
  const user = walletDoc?.user && typeof walletDoc.user === 'object' ? walletDoc.user : null;

  return {
    _id: walletDoc?._id,
    user: user
      ? {
          _id: user._id,
          name: user.name || 'Guest',
          phone: user.phone || '',
          role: user.role || 'user',
          isActive: Boolean(user.isActive),
        }
      : null,
    balance: Number(walletDoc?.balance || 0),
    createdAt: walletDoc?.createdAt,
    updatedAt: walletDoc?.updatedAt,
  };
}

function mapTransactionRow(txn) {
  return {
    _id: txn?._id,
    txnId: txn?.txnId,
    type: txn?.type,
    status: txn?.status,
    amount: Number(txn?.amount || 0),
    user: txn?.user && typeof txn.user === 'object'
      ? {
          _id: txn.user._id,
          name: txn.user.name || 'Guest',
          phone: txn.user.phone || '',
        }
      : txn?.user || null,
    fromUser: txn?.fromUser && typeof txn.fromUser === 'object'
      ? {
          _id: txn.fromUser._id,
          name: txn.fromUser.name || 'Guest',
          phone: txn.fromUser.phone || '',
        }
      : txn?.fromUser || null,
    toUser: txn?.toUser && typeof txn.toUser === 'object'
      ? {
          _id: txn.toUser._id,
          name: txn.toUser.name || 'Guest',
          phone: txn.toUser.phone || '',
        }
      : txn?.toUser || null,
    meta: txn?.meta || {},
    createdAt: txn?.createdAt,
    updatedAt: txn?.updatedAt,
  };
}

async function getFundSummary() {
  const [walletStats, txStats, latestTransaction] = await Promise.all([
    Wallet.aggregate([
      {
        $group: {
          _id: null,
          totalWallets: { $sum: 1 },
          totalWalletBalance: { $sum: '$balance' },
          averageWalletBalance: { $avg: '$balance' },
        },
      },
    ]),
    Transaction.aggregate([
      {
        $group: {
          _id: null,
          totalTransactions: { $sum: 1 },
          successfulTransactions: {
            $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] },
          },
          pendingTransactions: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
          },
          failedTransactions: {
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] },
          },
          totalTransactionVolume: { $sum: '$amount' },
          creditVolume: {
            $sum: { $cond: [{ $eq: ['$type', 'credit'] }, '$amount', 0] },
          },
          debitVolume: {
            $sum: { $cond: [{ $eq: ['$type', 'debit'] }, '$amount', 0] },
          },
          transferVolume: {
            $sum: { $cond: [{ $eq: ['$type', 'transfer'] }, '$amount', 0] },
          },
          rechargeVolume: {
            $sum: { $cond: [{ $eq: ['$type', 'recharge'] }, '$amount', 0] },
          },
        },
      },
    ]),
    Transaction.findOne({}).sort({ createdAt: -1 }).select('createdAt txnId').lean(),
  ]);

  const wallet = walletStats?.[0] || {};
  const tx = txStats?.[0] || {};

  return {
    status: true,
    message: 'Fund summary fetched.',
    data: {
      totalWallets: Number(wallet.totalWallets || 0),
      totalWalletBalance: Number(Number(wallet.totalWalletBalance || 0).toFixed(2)),
      averageWalletBalance: Number(Number(wallet.averageWalletBalance || 0).toFixed(2)),
      totalTransactions: Number(tx.totalTransactions || 0),
      successfulTransactions: Number(tx.successfulTransactions || 0),
      pendingTransactions: Number(tx.pendingTransactions || 0),
      failedTransactions: Number(tx.failedTransactions || 0),
      totalTransactionVolume: Number(Number(tx.totalTransactionVolume || 0).toFixed(2)),
      creditVolume: Number(Number(tx.creditVolume || 0).toFixed(2)),
      debitVolume: Number(Number(tx.debitVolume || 0).toFixed(2)),
      transferVolume: Number(Number(tx.transferVolume || 0).toFixed(2)),
      rechargeVolume: Number(Number(tx.rechargeVolume || 0).toFixed(2)),
      latestTransactionAt: latestTransaction?.createdAt || null,
      latestTransactionId: latestTransaction?.txnId || null,
    },
  };
}

async function listWallets(req) {
  const page = toPositiveInt(req.query?.page, 1, 100000);
  const limit = toPositiveInt(req.query?.limit, 20, 200);
  const skip = (page - 1) * limit;

  const search = String(req.query?.search || '').trim();
  const isActive = parseBoolean(req.query?.isActive, null);

  const userFilters = {};
  if (search) {
    const regex = new RegExp(escapeRegex(search), 'i');
    userFilters.$or = [{ name: regex }, { phone: regex }];
  }
  if (isActive !== null) {
    userFilters.isActive = isActive;
  }

  const walletFilters = {};
  if (Object.keys(userFilters).length > 0) {
    const matchedUsers = await User.find(userFilters).select('_id').lean();
    const userIds = matchedUsers.map((item) => item._id);

    if (userIds.length === 0) {
      return {
        status: true,
        message: 'Wallets fetched.',
        data: {
          items: [],
          total: 0,
          page,
          limit,
        },
      };
    }

    walletFilters.user = { $in: userIds };
  }

  const [total, wallets] = await Promise.all([
    Wallet.countDocuments(walletFilters),
    Wallet.find(walletFilters)
      .populate('user', 'name phone role isActive')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  return {
    status: true,
    message: 'Wallets fetched.',
    data: {
      items: wallets.map(mapWalletRow),
      total,
      page,
      limit,
    },
  };
}

async function getWalletDetails(req) {
  const key = String(req.params?.userId || '').trim();
  if (!key) {
    return { status: false, message: 'User id is required.' };
  }

  const user = await resolveUserReference({ userId: key, phone: key });
  if (!user) {
    return { status: false, message: 'User not found.' };
  }

  const recentLimit = toPositiveInt(req.query?.limit, 20, 100);
  const [wallet, recentTransactions] = await Promise.all([
    getOrCreateWallet(user._id),
    Transaction.find({
      $or: [{ user: user._id }, { fromUser: user._id }, { toUser: user._id }],
    })
      .sort({ createdAt: -1 })
      .limit(recentLimit)
      .populate('user', 'name phone')
      .populate('fromUser', 'name phone')
      .populate('toUser', 'name phone')
      .lean(),
  ]);

  return {
    status: true,
    message: 'Wallet details fetched.',
    data: {
      user: {
        _id: user._id,
        name: user.name || 'Guest',
        phone: user.phone || '',
        role: user.role || 'user',
        isActive: Boolean(user.isActive),
      },
      wallet: {
        _id: wallet._id,
        user: wallet.user,
        balance: Number(wallet.balance || 0),
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt,
      },
      recentTransactions: recentTransactions.map(mapTransactionRow),
    },
  };
}

async function creditWallet(req) {
  const amount = parseAmount(req.body?.amount);
  if (!amount) {
    return { status: false, message: 'Valid amount is required.' };
  }

  const user = await resolveUserReference({ userId: req.body?.userId, phone: req.body?.phone });
  if (!user) {
    return { status: false, message: 'User not found for credit.' };
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const wallet = await getOrCreateWallet(user._id, session);
    wallet.balance = Number((Number(wallet.balance || 0) + amount).toFixed(2));
    await wallet.save({ session });

    const created = await Transaction.create(
      [
        {
          type: 'credit',
          status: 'success',
          amount,
          user: user._id,
          meta: {
            source: 'fund_management_credit',
            note: String(req.body?.note || '').trim(),
            adminId: req.admin?._id || null,
          },
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return {
      status: true,
      message: 'Wallet credited successfully.',
      data: {
        user: {
          _id: user._id,
          name: user.name || 'Guest',
          phone: user.phone || '',
        },
        wallet: {
          balance: Number(wallet.balance || 0),
          updatedAt: wallet.updatedAt,
        },
        transaction: mapTransactionRow(created[0].toObject()),
      },
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

async function debitWallet(req) {
  const amount = parseAmount(req.body?.amount);
  if (!amount) {
    return { status: false, message: 'Valid amount is required.' };
  }

  const user = await resolveUserReference({ userId: req.body?.userId, phone: req.body?.phone });
  if (!user) {
    return { status: false, message: 'User not found for debit.' };
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const wallet = await getOrCreateWallet(user._id, session);
    if (Number(wallet.balance || 0) < amount) {
      await session.abortTransaction();
      session.endSession();
      return { status: false, message: 'Insufficient wallet balance.' };
    }

    wallet.balance = Number((Number(wallet.balance || 0) - amount).toFixed(2));
    await wallet.save({ session });

    const created = await Transaction.create(
      [
        {
          type: 'debit',
          status: 'success',
          amount,
          user: user._id,
          meta: {
            source: 'fund_management_debit',
            note: String(req.body?.note || '').trim(),
            adminId: req.admin?._id || null,
          },
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return {
      status: true,
      message: 'Wallet debited successfully.',
      data: {
        user: {
          _id: user._id,
          name: user.name || 'Guest',
          phone: user.phone || '',
        },
        wallet: {
          balance: Number(wallet.balance || 0),
          updatedAt: wallet.updatedAt,
        },
        transaction: mapTransactionRow(created[0].toObject()),
      },
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

async function transferWallet(req) {
  const amount = parseAmount(req.body?.amount);
  if (!amount) {
    return { status: false, message: 'Valid amount is required.' };
  }

  const sender = await resolveUserReference({
    userId: req.body?.fromUserId,
    phone: req.body?.fromPhone,
  });
  if (!sender) {
    return { status: false, message: 'Sender user not found.' };
  }

  const recipient = await resolveUserReference({
    userId: req.body?.toUserId,
    phone: req.body?.toPhone,
  });
  if (!recipient) {
    return { status: false, message: 'Recipient user not found.' };
  }

  if (String(sender._id) === String(recipient._id)) {
    return { status: false, message: 'Sender and recipient cannot be same user.' };
  }

  const note = String(req.body?.note || '').trim();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [fromWallet, toWallet] = await Promise.all([
      getOrCreateWallet(sender._id, session),
      getOrCreateWallet(recipient._id, session),
    ]);

    if (Number(fromWallet.balance || 0) < amount) {
      await session.abortTransaction();
      session.endSession();
      return { status: false, message: 'Insufficient sender balance.' };
    }

    fromWallet.balance = Number((Number(fromWallet.balance || 0) - amount).toFixed(2));
    toWallet.balance = Number((Number(toWallet.balance || 0) + amount).toFixed(2));

    await fromWallet.save({ session });
    await toWallet.save({ session });

    const created = await Transaction.create(
      [
        {
          type: 'transfer',
          status: 'success',
          amount,
          user: sender._id,
          fromUser: sender._id,
          toUser: recipient._id,
          meta: {
            direction: 'out',
            source: 'fund_management_transfer',
            note,
            adminId: req.admin?._id || null,
          },
        },
        {
          type: 'transfer',
          status: 'success',
          amount,
          user: recipient._id,
          fromUser: sender._id,
          toUser: recipient._id,
          meta: {
            direction: 'in',
            source: 'fund_management_transfer',
            note,
            adminId: req.admin?._id || null,
          },
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return {
      status: true,
      message: 'Wallet transfer completed successfully.',
      data: {
        fromUser: {
          _id: sender._id,
          name: sender.name || 'Guest',
          phone: sender.phone || '',
          balance: Number(fromWallet.balance || 0),
        },
        toUser: {
          _id: recipient._id,
          name: recipient.name || 'Guest',
          phone: recipient.phone || '',
          balance: Number(toWallet.balance || 0),
        },
        transactions: created.map((item) => mapTransactionRow(item.toObject())),
      },
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

async function listTransactions(req) {
  const page = toPositiveInt(req.query?.page, 1, 100000);
  const limit = toPositiveInt(req.query?.limit, 20, 200);
  const skip = (page - 1) * limit;

  const baseMatch = {};

  const type = String(req.query?.type || '').trim().toLowerCase();
  if (type && ALLOWED_TX_TYPES.has(type)) {
    baseMatch.type = type;
  }

  const status = String(req.query?.status || '').trim().toLowerCase();
  if (status && ALLOWED_TX_STATUS.has(status)) {
    baseMatch.status = status;
  }

  const userRelationFilters = [];
  const userId = toObjectId(req.query?.userId);
  if (userId) {
    userRelationFilters.push({ user: userId }, { fromUser: userId }, { toUser: userId });
  }

  const fromUserId = toObjectId(req.query?.fromUserId);
  if (fromUserId) {
    baseMatch.fromUser = fromUserId;
  }

  const toUserId = toObjectId(req.query?.toUserId);
  if (toUserId) {
    baseMatch.toUser = toUserId;
  }

  if (userRelationFilters.length > 0) {
    baseMatch.$or = userRelationFilters;
  }

  const search = String(req.query?.search || '').trim();
  const conditions = [];

  if (Object.keys(baseMatch).length > 0) {
    conditions.push(baseMatch);
  }

  if (search) {
    const regex = new RegExp(escapeRegex(search), 'i');
    const matchedUsers = await User.find({ $or: [{ name: regex }, { phone: regex }] }).select('_id').lean();
    const ids = matchedUsers.map((item) => item._id);

    if (ids.length === 0) {
      return {
        status: true,
        message: 'Transactions fetched.',
        data: {
          items: [],
          total: 0,
          page,
          limit,
        },
      };
    }

    conditions.push({
      $or: [
        { user: { $in: ids } },
        { fromUser: { $in: ids } },
        { toUser: { $in: ids } },
      ],
    });
  }

  const finalMatch =
    conditions.length === 0
      ? {}
      : conditions.length === 1
        ? conditions[0]
        : { $and: conditions };

  const [total, items] = await Promise.all([
    Transaction.countDocuments(finalMatch),
    Transaction.find(finalMatch)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name phone')
      .populate('fromUser', 'name phone')
      .populate('toUser', 'name phone')
      .lean(),
  ]);

  return {
    status: true,
    message: 'Transactions fetched.',
    data: {
      items: items.map(mapTransactionRow),
      total,
      page,
      limit,
    },
  };
}

async function getTransactionById(req) {
  const transactionId = toObjectId(req.params?.id);
  if (!transactionId) {
    return { status: false, message: 'Invalid transaction id.' };
  }

  const txn = await Transaction.findById(transactionId)
    .populate('user', 'name phone')
    .populate('fromUser', 'name phone')
    .populate('toUser', 'name phone')
    .lean();

  if (!txn) {
    return { status: false, message: 'Transaction not found.' };
  }

  return {
    status: true,
    message: 'Transaction fetched.',
    data: mapTransactionRow(txn),
  };
}

module.exports = {
  getFundSummary,
  listWallets,
  getWalletDetails,
  creditWallet,
  debitWallet,
  transferWallet,
  listTransactions,
  getTransactionById,
};
