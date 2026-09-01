const notificationsService = require('../services/notifications.service');

function sendResult(res, result) {
  return res
    .status(result.status ? 200 : 400)
    .json({ success: result.status, message: result.message, data: result.data || null });
}

exports.listNotifications = async (req, res) => {
  try {
    const result = await notificationsService.listNotifications(req);
    return sendResult(res, result);
  } catch (_error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.getNotificationById = async (req, res) => {
  try {
    const result = await notificationsService.getNotificationById(req);
    return sendResult(res, result);
  } catch (_error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const result = await notificationsService.createNotification(req);
    return sendResult(res, result);
  } catch (_error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.updateNotification = async (req, res) => {
  try {
    const result = await notificationsService.updateNotification(req);
    return sendResult(res, result);
  } catch (_error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.updateNotificationStatus = async (req, res) => {
  try {
    const result = await notificationsService.updateNotificationStatus(req);
    return sendResult(res, result);
  } catch (_error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const result = await notificationsService.deleteNotification(req);
    return sendResult(res, result);
  } catch (_error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
