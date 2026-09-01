const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AdminUser = require("../models/AdminUser");
const env = require("../config/env");

function isBcryptHash(value) {
  return typeof value === "string" && /^\$2[aby]\$\d{2}\$/.test(value);
}

async function matchesPassword(inputPassword, storedPassword) {
  if (!storedPassword) return false;

  if (isBcryptHash(storedPassword)) {
    return bcrypt.compare(inputPassword, storedPassword);
  }

  // Backward compatibility for legacy plaintext values.
  return inputPassword === storedPassword;
}

async function ensureAdminUser() {
  const email = env.ADMIN_EMAIL.toLowerCase();
  const existing = await AdminUser.findOne({ email });
  if (existing) {
    if (existing.role === "admin") {
      existing.role = "0";
    }

    if (!existing.password) {
      const existingRaw = existing.toObject ? existing.toObject() : existing;
      existing.password = existingRaw.passwordHash || (await bcrypt.hash(env.ADMIN_PASSWORD, 10));
    }

    if (!existing.role) {
      existing.role = "0";
    }

    if (existing.isModified()) {
      await existing.save();
    }

    return existing;
  }

  const password = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
  return AdminUser.create({ email, password, role: "0" });
}

async function login(email, password) {
  const admin = await AdminUser.findOne({ email: String(email || "").toLowerCase() });
  if (!admin) {
    throw new Error("Invalid credentials");
  }

  const adminRaw = admin.toObject ? admin.toObject() : admin;
  const passwordCandidates = [admin.password, admin.masterpassword, adminRaw.passwordHash].filter(Boolean);

  let isMatch = false;
  for (const candidate of passwordCandidates) {
    // eslint-disable-next-line no-await-in-loop
    if (await matchesPassword(password || "", candidate)) {
      isMatch = true;
      break;
    }
  }

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      sub: admin._id.toString(),
      email: admin.email,
      role: admin.role
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  return {
    token,
    admin: {
      id: admin._id,
      email: admin.email,
      role: admin.role
    }
  };
}

module.exports = {
  ensureAdminUser,
  login
};