const mongoose = require('mongoose');

const ConfigModel = require('../../../models/configmodel');
const initializeConstants = require('../../../config/const_credential');

const SECRET_FIELDS = new Set([
  'JWT_SECRET',
  'ADMIN_PASSWORD',
  'OPENWA_API_KEY',
  'RECHARGE_API_TOKEN',
  'REDIS_PASSWORD',
]);

function toPositiveInt(value, fallback, max = 100) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}

function isTruthy(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lowered = value.trim().toLowerCase();
    return lowered === '1' || lowered === 'true' || lowered === 'yes';
  }
  return false;
}

function maskSecret(value) {
  if (value === undefined || value === null || value === '') return value;
  return '********';
}

function sanitizeConfig(doc, includeSecrets = false) {
  if (!doc) return null;

  const plain = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  const sanitized = { ...plain, id: String(plain._id) };

  if (!includeSecrets) {
    for (const field of SECRET_FIELDS) {
      if (field in sanitized) {
        sanitized[field] = maskSecret(sanitized[field]);
      }
    }
  }

  return sanitized;
}

function normalizePayload(payload = {}) {
  const data = { ...payload };

  delete data._id;
  delete data.id;
  delete data.createdAt;
  delete data.updatedAt;
  delete data.__v;

  return data;
}

async function refreshRuntimeConstants() {
  if (typeof initializeConstants.clearCache === 'function') {
    initializeConstants.clearCache();
  }

  const constants = await initializeConstants();
  global.constant = constants;

  return constants;
}

function ensureObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false;
  }

  return true;
}

exports.getActiveConfig = async (req) => {
  const includeSecrets = isTruthy(req.query?.includeSecrets);
  const config = await ConfigModel.findOne({}).sort({ createdAt: -1 }).lean();

  if (!config) {
    return {
      status: true,
      message: 'No config found.',
      data: null,
    };
  }

  return {
    status: true,
    message: 'Active config fetched.',
    data: sanitizeConfig(config, includeSecrets),
  };
};

exports.listConfigs = async (req) => {
  const includeSecrets = isTruthy(req.query?.includeSecrets);
  const page = toPositiveInt(req.query?.page, 1, 100000);
  const limit = toPositiveInt(req.query?.limit, 20, 200);
  const skip = (page - 1) * limit;

  const [total, rows] = await Promise.all([
    ConfigModel.countDocuments({}),
    ConfigModel.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  return {
    status: true,
    message: 'Config list fetched.',
    data: {
      items: rows.map((row) => sanitizeConfig(row, includeSecrets)),
      total,
      page,
      limit,
    },
  };
};

exports.getConfigById = async (req) => {
  const { id } = req.params;
  const includeSecrets = isTruthy(req.query?.includeSecrets);

  if (!ensureObjectId(id)) {
    return {
      status: false,
      message: 'Invalid config id.',
      data: null,
    };
  }

  const config = await ConfigModel.findById(id).lean();
  if (!config) {
    return {
      status: false,
      message: 'Config not found.',
      data: null,
    };
  }

  return {
    status: true,
    message: 'Config fetched.',
    data: sanitizeConfig(config, includeSecrets),
  };
};

exports.createConfig = async (req) => {
  const payload = normalizePayload(req.body || {});
  const created = await ConfigModel.create(payload);
  const constants = await refreshRuntimeConstants();

  return {
    status: true,
    message: 'Config created.',
    data: {
      config: sanitizeConfig(created, false),
      runtimeUpdated: true,
      runtimeKeys: Object.keys(constants || {}),
    },
  };
};

exports.upsertActiveConfig = async (req) => {
  const payload = normalizePayload(req.body || {});

  let existing = await ConfigModel.findOne({}).sort({ createdAt: -1 });
  if (!existing) {
    existing = await ConfigModel.create(payload);
  } else {
    Object.assign(existing, payload);
    await existing.save();
  }

  const constants = await refreshRuntimeConstants();

  return {
    status: true,
    message: 'Active config upserted.',
    data: {
      config: sanitizeConfig(existing, false),
      runtimeUpdated: true,
      runtimeKeys: Object.keys(constants || {}),
    },
  };
};

exports.updateConfig = async (req) => {
  const { id } = req.params;
  const payload = normalizePayload(req.body || {});

  if (!ensureObjectId(id)) {
    return {
      status: false,
      message: 'Invalid config id.',
      data: null,
    };
  }

  const updated = await ConfigModel.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true },
  ).lean();

  if (!updated) {
    return {
      status: false,
      message: 'Config not found.',
      data: null,
    };
  }

  const constants = await refreshRuntimeConstants();

  return {
    status: true,
    message: 'Config updated.',
    data: {
      config: sanitizeConfig(updated, false),
      runtimeUpdated: true,
      runtimeKeys: Object.keys(constants || {}),
    },
  };
};

exports.replaceConfig = async (req) => {
  const { id } = req.params;
  const payload = normalizePayload(req.body || {});

  if (!ensureObjectId(id)) {
    return {
      status: false,
      message: 'Invalid config id.',
      data: null,
    };
  }

  const existing = await ConfigModel.findById(id);
  if (!existing) {
    return {
      status: false,
      message: 'Config not found.',
      data: null,
    };
  }

  existing.set(payload);
  await existing.save();

  const constants = await refreshRuntimeConstants();

  return {
    status: true,
    message: 'Config replaced.',
    data: {
      config: sanitizeConfig(existing, false),
      runtimeUpdated: true,
      runtimeKeys: Object.keys(constants || {}),
    },
  };
};

exports.deleteConfig = async (req) => {
  const { id } = req.params;

  if (!ensureObjectId(id)) {
    return {
      status: false,
      message: 'Invalid config id.',
      data: null,
    };
  }

  const deleted = await ConfigModel.findByIdAndDelete(id).lean();
  if (!deleted) {
    return {
      status: false,
      message: 'Config not found.',
      data: null,
    };
  }

  const constants = await refreshRuntimeConstants();

  return {
    status: true,
    message: 'Config deleted.',
    data: {
      deletedId: id,
      runtimeUpdated: true,
      runtimeKeys: Object.keys(constants || {}),
    },
  };
};

exports.getEffectiveConstants = async (req) => {
  const includeSecrets = isTruthy(req.query?.includeSecrets);
  const constants = await initializeConstants();

  const data = { ...constants };
  if (!includeSecrets) {
    for (const field of SECRET_FIELDS) {
      if (field in data) {
        data[field] = maskSecret(data[field]);
      }
    }
  }

  return {
    status: true,
    message: 'Effective constants fetched.',
    data,
  };
};

exports.reloadRuntimeConstants = async () => {
  const constants = await refreshRuntimeConstants();

  return {
    status: true,
    message: 'Runtime constants reloaded.',
    data: {
      runtimeUpdated: true,
      keys: Object.keys(constants || {}),
    },
  };
};
