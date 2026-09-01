const jwt = require("jsonwebtoken");
const { redisAdmin } = require("../utils/radis");

const JWT_SECRET = () => global.constant?.JWT_SECRET || process.env.JWT_SECRET || process.env.SECRET_TOKEN || 'default-secret';

module.exports = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  const authHeader = req.headers.authorization || "";

  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      // Redis failures should not invalidate otherwise valid tokens.
      let blacklisted = false;
      try {
        blacklisted = await redisAdmin.isTokenBlacklisted(token);
      } catch (_error) {
        blacklisted = false;
      }

      if (blacklisted) {
        return res.status(401).json({ status: false, message: "Token has been invalidated. Please login again." });
      }

      const payload = jwt.verify(token, JWT_SECRET());
      const resolvedId = payload._id || payload.id || payload.adminId || payload.sub;
      req.admin = {
        ...payload,
        _id: resolvedId,
        id: resolvedId,
        adminId: resolvedId,
        sub: payload.sub || resolvedId,
      };

      if (!resolvedId) {
        return res.status(401).json({ status: false, message: "Invalid token payload" });
      }

      return next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ status: false, message: "Token expired. Please login again." });
      }
      return res.status(401).json({ status: false, message: "Invalid token" });
    }
  }

  return res.status(401).json({ status: false, message: "Unauthorized" });
};