const User = require("../models/User");

async function listUsers(req, res, next) {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).limit(200);
    res.json(users);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listUsers
};