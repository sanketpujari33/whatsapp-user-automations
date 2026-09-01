const authService = require("../services/auth.service");

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    error.status = 401;
    next(error);
  }
}

module.exports = {
  login
};