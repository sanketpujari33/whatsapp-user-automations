const openwaService = require("../services/openwa.service");

async function listSessions(req, res, next) {
  try {
    const sessions = await openwaService.listSessions();
    res.json(sessions);
  } catch (error) {
    next(error);
  }
}

async function getSessionQr(req, res, next) {
  try {
    const data = await openwaService.getQr(req.params.sessionId);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listSessions,
  getSessionQr
};