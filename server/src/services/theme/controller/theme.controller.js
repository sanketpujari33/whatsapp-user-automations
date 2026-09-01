const themeService = require('../services/theme.service');

function sendResult(res, result) {
  return res
    .status(result.status ? 200 : 400)
    .json({ success: result.status, message: result.message, data: result.data || null });
}

exports.getMyTheme = async (req, res) => {
  try {
    const result = await themeService.getMyTheme(req);
    return sendResult(res, result);
  } catch (_error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.upsertMyTheme = async (req, res) => {
  try {
    const result = await themeService.upsertMyTheme(req);
    return sendResult(res, result);
  } catch (_error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.resetMyTheme = async (req, res) => {
  try {
    const result = await themeService.resetMyTheme(req);
    return sendResult(res, result);
  } catch (_error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
