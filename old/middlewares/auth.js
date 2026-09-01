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
      const blacklisted = await redisAdmin.isTokenBlacklisted(token);
      if (blacklisted) {
        return res.status(401).json({ status: false, message: "Token has been invalidated. Please login again." });
      }

      const payload = jwt.verify(token, JWT_SECRET());
      req.admin = { ...payload, _id: payload.id, adminId: payload.id };
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