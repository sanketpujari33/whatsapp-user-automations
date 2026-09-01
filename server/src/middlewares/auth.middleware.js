const jwt = require("jsonwebtoken");
const env = require("../config/env");
const redisAdmin = require("../utils/radis/redisAdmin");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return (async () => {
    try {
      // Redis should not block auth when unavailable; ignore cache read failures.
      let blacklisted = false;
      try {
        blacklisted = await redisAdmin.isTokenBlacklisted(token);
      } catch (_error) {
        blacklisted = false;
      }

      if (blacklisted) {
        return res.status(401).json({ message: "Token has been invalidated. Please login again." });
      }

      const payload = jwt.verify(token, env.JWT_SECRET);
      const resolvedId = payload._id || payload.id || payload.adminId || payload.sub;

      req.admin = {
        ...payload,
        _id: resolvedId,
        id: resolvedId,
        adminId: resolvedId,
        sub: payload.sub || resolvedId,
      };

      return next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired. Please login again." });
      }
      return res.status(401).json({ message: "Invalid token" });
    }
  })();
}

module.exports = authMiddleware;