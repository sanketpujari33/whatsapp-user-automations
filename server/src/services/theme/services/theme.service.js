const mongoose = require('mongoose');

const Theme = require('../../../models/Theme');

const ALLOWED_THEME_KEYS = [
  'themeMode',
  'themeLayout',
  'cardSkin',
  'isMonochrome',
  'darkColorScheme',
  'lightColorScheme',
  'primaryColorScheme',
  'notification',
  'headingFont',
  'bodyFont',
  'monoFont',
  'baseFontSize',
  'headingWeight',
  'letterSpacing',
  'lineHeightMode',
  'adaptiveScaling',
  'subpixelSmoothing',
  'defaultLang',
  'fallbackLang',
  'sidebarWidth',
  'headerHeight',
  'borderRadius',
  'animations',
];

function resolveAdminId(req) {
  const adminId = req.admin?._id || req.admin?.id || req.admin?.adminId || req.admin?.sub;
  if (!adminId || !mongoose.Types.ObjectId.isValid(adminId)) return null;
  return String(adminId);
}

function sanitizeObject(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return { ...value };
}

function toBoolean(value, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
    if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  }
  return fallback;
}

function toFiniteNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeColorScheme(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const out = { ...value };
  if (typeof out.name !== 'string') return undefined;
  return out;
}

function normalizeNotification(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const out = {};

  if (typeof value.position === 'string' && value.position.trim()) {
    out.position = value.position.trim();
  }

  if (value.isExpanded !== undefined) {
    out.isExpanded = toBoolean(value.isExpanded, false);
  }

  if (value.visibleToasts !== undefined) {
    out.visibleToasts = Math.max(1, Math.min(10, Math.round(toFiniteNumber(value.visibleToasts, 4))));
  }

  return Object.keys(out).length > 0 ? out : undefined;
}

function normalizeAnimations(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const out = {};

  if (value.enabled !== undefined) {
    out.enabled = toBoolean(value.enabled, true);
  }

  if (typeof value.speed === 'string' && value.speed.trim()) {
    out.speed = value.speed.trim();
  }

  return Object.keys(out).length > 0 ? out : undefined;
}

function normalizeThemeSettings(input = {}) {
  const source = sanitizeObject(input);
  const normalized = {};

  for (const key of ALLOWED_THEME_KEYS) {
    if (source[key] === undefined) continue;
    normalized[key] = source[key];
  }

  if (normalized.baseFontSize !== undefined) {
    normalized.baseFontSize = Math.max(12, Math.min(24, Math.round(toFiniteNumber(normalized.baseFontSize, 16))));
  }

  if (normalized.headingWeight !== undefined) {
    normalized.headingWeight = String(normalized.headingWeight);
  }

  if (normalized.letterSpacing !== undefined) {
    normalized.letterSpacing = toFiniteNumber(normalized.letterSpacing, 0);
  }

  if (normalized.adaptiveScaling !== undefined) {
    normalized.adaptiveScaling = toBoolean(normalized.adaptiveScaling, false);
  }

  if (normalized.subpixelSmoothing !== undefined) {
    normalized.subpixelSmoothing = toBoolean(normalized.subpixelSmoothing, true);
  }

  if (normalized.isMonochrome !== undefined) {
    normalized.isMonochrome = toBoolean(normalized.isMonochrome, false);
  }

  if (normalized.darkColorScheme !== undefined) {
    const parsed = normalizeColorScheme(normalized.darkColorScheme);
    if (parsed) normalized.darkColorScheme = parsed;
    else delete normalized.darkColorScheme;
  }

  if (normalized.lightColorScheme !== undefined) {
    const parsed = normalizeColorScheme(normalized.lightColorScheme);
    if (parsed) normalized.lightColorScheme = parsed;
    else delete normalized.lightColorScheme;
  }

  if (normalized.primaryColorScheme !== undefined) {
    const parsed = normalizeColorScheme(normalized.primaryColorScheme);
    if (parsed) normalized.primaryColorScheme = parsed;
    else delete normalized.primaryColorScheme;
  }

  if (normalized.notification !== undefined) {
    const parsed = normalizeNotification(normalized.notification);
    if (parsed) normalized.notification = parsed;
    else delete normalized.notification;
  }

  if (normalized.animations !== undefined) {
    const parsed = normalizeAnimations(normalized.animations);
    if (parsed) normalized.animations = parsed;
    else delete normalized.animations;
  }

  return normalized;
}

function mergeThemeSettings(existing = {}, incoming = {}) {
  const base = sanitizeObject(existing);
  const patch = sanitizeObject(incoming);

  return {
    ...base,
    ...patch,
    notification: {
      ...(base.notification || {}),
      ...(patch.notification || {}),
    },
    darkColorScheme: {
      ...(base.darkColorScheme || {}),
      ...(patch.darkColorScheme || {}),
    },
    lightColorScheme: {
      ...(base.lightColorScheme || {}),
      ...(patch.lightColorScheme || {}),
    },
    primaryColorScheme: {
      ...(base.primaryColorScheme || {}),
      ...(patch.primaryColorScheme || {}),
    },
    animations: {
      ...(base.animations || {}),
      ...(patch.animations || {}),
    },
  };
}

function serializeTheme(doc) {
  if (!doc) return null;
  const plain = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  return {
    id: String(plain._id),
    adminId: String(plain.adminId),
    settings: sanitizeObject(plain.settings),
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
}

exports.getMyTheme = async (req) => {
  const adminId = resolveAdminId(req);
  if (!adminId) {
    return {
      status: false,
      message: 'Unauthorized. Invalid admin id.',
      data: null,
    };
  }

  const theme = await Theme.findOne({ adminId }).lean();

  return {
    status: true,
    message: theme ? 'Theme settings fetched.' : 'Theme settings not found.',
    data: {
      theme: serializeTheme(theme),
      settings: sanitizeObject(theme?.settings),
    },
  };
};

exports.upsertMyTheme = async (req) => {
  const adminId = resolveAdminId(req);
  if (!adminId) {
    return {
      status: false,
      message: 'Unauthorized. Invalid admin id.',
      data: null,
    };
  }

  const body = sanitizeObject(req.body);
  const rawSettings = body.settings && typeof body.settings === 'object' ? body.settings : body;
  const incomingSettings = normalizeThemeSettings(rawSettings);

  if (Object.keys(incomingSettings).length === 0) {
    return {
      status: false,
      message: 'No valid theme settings were provided.',
      data: null,
    };
  }

  const existing = await Theme.findOne({ adminId }).lean();
  const mergedSettings = mergeThemeSettings(existing?.settings || {}, incomingSettings);

  const theme = await Theme.findOneAndUpdate(
    { adminId },
    { $set: { settings: mergedSettings } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  return {
    status: true,
    message: 'Theme settings saved.',
    data: {
      theme: serializeTheme(theme),
      settings: sanitizeObject(theme.settings),
    },
  };
};

exports.resetMyTheme = async (req) => {
  const adminId = resolveAdminId(req);
  if (!adminId) {
    return {
      status: false,
      message: 'Unauthorized. Invalid admin id.',
      data: null,
    };
  }

  await Theme.deleteOne({ adminId });

  return {
    status: true,
    message: 'Theme settings reset successfully.',
    data: {
      adminId,
    },
  };
};
