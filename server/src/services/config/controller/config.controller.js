const configService = require('../services/config.service');

function sendResult(res, result) {
  return res
    .status(result.status ? 200 : 400)
    .json({ success: result.status, message: result.message, data: result.data || null });
}

exports.getActiveConfig = async (req, res) => {
  try {
    const result = await configService.getActiveConfig(req);
    return sendResult(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.listConfigs = async (req, res) => {
  try {
    const result = await configService.listConfigs(req);
    return sendResult(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.getConfigById = async (req, res) => {
  try {
    const result = await configService.getConfigById(req);
    return sendResult(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.createConfig = async (req, res) => {
  try {
    const result = await configService.createConfig(req);
    return sendResult(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.upsertActiveConfig = async (req, res) => {
  try {
    const result = await configService.upsertActiveConfig(req);
    return sendResult(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.updateConfig = async (req, res) => {
  try {
    const result = await configService.updateConfig(req);
    return sendResult(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.replaceConfig = async (req, res) => {
  try {
    const result = await configService.replaceConfig(req);
    return sendResult(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.deleteConfig = async (req, res) => {
  try {
    const result = await configService.deleteConfig(req);
    return sendResult(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.getEffectiveConstants = async (req, res) => {
  try {
    const result = await configService.getEffectiveConstants(req);
    return sendResult(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.reloadRuntimeConstants = async (req, res) => {
  try {
    const result = await configService.reloadRuntimeConstants();
    return sendResult(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
