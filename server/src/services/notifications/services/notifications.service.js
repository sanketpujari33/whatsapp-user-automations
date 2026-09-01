const mongoose = require('mongoose');

const Notification = require('../../../models/Notification');

const VALID_TYPES = new Set(['message', 'task', 'log', 'security']);

function parseBoolean(value) {
  if (typeof value === 'boolean') return value;

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes'].includes(normalized)) return true;
    if (['false', '0', 'no'].includes(normalized)) return false;
  }

  return undefined;
}

function toPositiveInt(value, fallback, max = 200) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}

function ensureObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function normalizeText(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function displayTime(notification) {
  if (notification?.time) return notification.time;
  const createdAt = notification?.createdAt ? new Date(notification.createdAt) : null;
  if (!createdAt || Number.isNaN(createdAt.getTime())) return '';
  return createdAt.toLocaleString();
}

function sanitizeNotification(doc) {
  if (!doc) return null;

  const plain = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  return {
    ...plain,
    id: String(plain._id),
    time: displayTime(plain),
  };
}

function buildFilter(query = {}) {
  const filter = { is_deleted: false };

  const includeInactive = parseBoolean(query.includeInactive);
  if (includeInactive !== true) {
    filter.isActive = true;
  }

  const type = normalizeText(query.type).toLowerCase();
  if (type && VALID_TYPES.has(type)) {
    filter.type = type;
  }

  const isRead = parseBoolean(query.isRead);
  if (typeof isRead === 'boolean') {
    filter.isRead = isRead;
  }

  const search = normalizeText(query.search);
  if (search) {
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ title: regex }, { description: regex }];
  }

  return filter;
}

function buildPayload(body = {}, { partial = false } = {}) {
  const payload = {};

  if (!partial || Object.prototype.hasOwnProperty.call(body, 'title')) {
    const title = normalizeText(body.title);
    if (!title) {
      return { error: 'Title is required.' };
    }
    payload.title = title;
  }

  if (!partial || Object.prototype.hasOwnProperty.call(body, 'description')) {
    payload.description = normalizeText(body.description);
  }

  if (!partial || Object.prototype.hasOwnProperty.call(body, 'type')) {
    const type = normalizeText(body.type).toLowerCase() || 'message';
    if (!VALID_TYPES.has(type)) {
      return { error: 'Invalid notification type.' };
    }
    payload.type = type;
  }

  if (Object.prototype.hasOwnProperty.call(body, 'time')) {
    payload.time = normalizeText(body.time);
  }

  if (Object.prototype.hasOwnProperty.call(body, 'isRead')) {
    const isRead = parseBoolean(body.isRead);
    if (typeof isRead !== 'boolean') {
      return { error: 'Invalid isRead value.' };
    }
    payload.isRead = isRead;
  }

  if (Object.prototype.hasOwnProperty.call(body, 'isActive')) {
    const isActive = parseBoolean(body.isActive);
    if (typeof isActive !== 'boolean') {
      return { error: 'Invalid isActive value.' };
    }
    payload.isActive = isActive;
  }

  return { payload };
}

exports.listNotifications = async (req) => {
  const page = toPositiveInt(req.query?.page, 1, 100000);
  const limit = toPositiveInt(req.query?.limit, 25, 200);
  const skip = (page - 1) * limit;

  const filter = buildFilter(req.query || {});

  const [total, rows] = await Promise.all([
    Notification.countDocuments(filter),
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  return {
    status: true,
    message: 'Notifications fetched.',
    data: {
      items: rows.map((row) => sanitizeNotification(row)),
      total,
      page,
      limit,
    },
  };
};

exports.getNotificationById = async (req) => {
  const { id } = req.params;
  if (!ensureObjectId(id)) {
    return {
      status: false,
      message: 'Invalid notification id.',
      data: null,
    };
  }

  const notification = await Notification.findOne({ _id: id, is_deleted: false }).lean();
  if (!notification) {
    return {
      status: false,
      message: 'Notification not found.',
      data: null,
    };
  }

  return {
    status: true,
    message: 'Notification fetched.',
    data: sanitizeNotification(notification),
  };
};

exports.createNotification = async (req) => {
  const { payload, error } = buildPayload(req.body || {}, { partial: false });
  if (error) {
    return {
      status: false,
      message: error,
      data: null,
    };
  }

  const adminId = req.admin?._id || null;
  payload.createdBy = adminId;
  payload.updatedBy = adminId;

  const created = await Notification.create(payload);

  return {
    status: true,
    message: 'Notification created.',
    data: sanitizeNotification(created),
  };
};

exports.updateNotification = async (req) => {
  const { id } = req.params;
  if (!ensureObjectId(id)) {
    return {
      status: false,
      message: 'Invalid notification id.',
      data: null,
    };
  }

  const { payload, error } = buildPayload(req.body || {}, { partial: true });
  if (error) {
    return {
      status: false,
      message: error,
      data: null,
    };
  }

  if (!payload || Object.keys(payload).length === 0) {
    return {
      status: false,
      message: 'No fields provided for update.',
      data: null,
    };
  }

  payload.updatedBy = req.admin?._id || null;

  const updated = await Notification.findOneAndUpdate(
    { _id: id, is_deleted: false },
    { $set: payload },
    { new: true, runValidators: true },
  ).lean();

  if (!updated) {
    return {
      status: false,
      message: 'Notification not found.',
      data: null,
    };
  }

  return {
    status: true,
    message: 'Notification updated.',
    data: sanitizeNotification(updated),
  };
};

exports.updateNotificationStatus = async (req) => {
  const { id } = req.params;
  if (!ensureObjectId(id)) {
    return {
      status: false,
      message: 'Invalid notification id.',
      data: null,
    };
  }

  const patch = {};

  if (Object.prototype.hasOwnProperty.call(req.body || {}, 'isActive')) {
    const isActive = parseBoolean(req.body.isActive);
    if (typeof isActive !== 'boolean') {
      return {
        status: false,
        message: 'Invalid isActive value.',
        data: null,
      };
    }
    patch.isActive = isActive;
  }

  if (Object.prototype.hasOwnProperty.call(req.body || {}, 'isRead')) {
    const isRead = parseBoolean(req.body.isRead);
    if (typeof isRead !== 'boolean') {
      return {
        status: false,
        message: 'Invalid isRead value.',
        data: null,
      };
    }
    patch.isRead = isRead;
  }

  if (Object.keys(patch).length === 0) {
    return {
      status: false,
      message: 'No status fields provided.',
      data: null,
    };
  }

  patch.updatedBy = req.admin?._id || null;

  const updated = await Notification.findOneAndUpdate(
    { _id: id, is_deleted: false },
    { $set: patch },
    { new: true, runValidators: true },
  ).lean();

  if (!updated) {
    return {
      status: false,
      message: 'Notification not found.',
      data: null,
    };
  }

  return {
    status: true,
    message: 'Notification status updated.',
    data: sanitizeNotification(updated),
  };
};

exports.deleteNotification = async (req) => {
  const { id } = req.params;
  if (!ensureObjectId(id)) {
    return {
      status: false,
      message: 'Invalid notification id.',
      data: null,
    };
  }

  const updated = await Notification.findOneAndUpdate(
    { _id: id, is_deleted: false },
    {
      $set: {
        is_deleted: true,
        isActive: false,
        updatedBy: req.admin?._id || null,
      },
    },
    { new: true },
  ).lean();

  if (!updated) {
    return {
      status: false,
      message: 'Notification not found.',
      data: null,
    };
  }

  return {
    status: true,
    message: 'Notification deleted.',
    data: { deletedId: String(updated._id) },
  };
};
