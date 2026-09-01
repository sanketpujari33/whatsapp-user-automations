const teamService = require('../services/team.service');

function sendResult(res, result) {
  return res
    .status(result.status ? 200 : 400)
    .json({ success: result.status, message: result.message, data: result.data || null });
}

function handleError(res, error) {
  console.error('[team.controller] Error:', error?.message || error);
  return res.status(500).json({ success: false, message: 'Internal Server Error' });
}

exports.listTeams = async (req, res) => {
  try {
    return sendResult(res, await teamService.listTeams(req));
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getTeamById = async (req, res) => {
  try {
    return sendResult(res, await teamService.getTeamById(req));
  } catch (error) {
    return handleError(res, error);
  }
};

exports.createTeam = async (req, res) => {
  try {
    return sendResult(res, await teamService.createTeam(req));
  } catch (error) {
    return handleError(res, error);
  }
};

exports.updateTeam = async (req, res) => {
  try {
    return sendResult(res, await teamService.updateTeam(req));
  } catch (error) {
    return handleError(res, error);
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    return sendResult(res, await teamService.deleteTeam(req));
  } catch (error) {
    return handleError(res, error);
  }
};

exports.toggleTeamStatus = async (req, res) => {
  try {
    return sendResult(res, await teamService.toggleTeamStatus(req));
  } catch (error) {
    return handleError(res, error);
  }
};

exports.listTeamRoles = async (req, res) => {
  try {
    return sendResult(res, await teamService.listTeamRoles(req));
  } catch (error) {
    return handleError(res, error);
  }
};

exports.createTeamRole = async (req, res) => {
  try {
    return sendResult(res, await teamService.createTeamRole(req));
  } catch (error) {
    return handleError(res, error);
  }
};

exports.updateTeamRole = async (req, res) => {
  try {
    return sendResult(res, await teamService.updateTeamRole(req));
  } catch (error) {
    return handleError(res, error);
  }
};

exports.deleteTeamRole = async (req, res) => {
  try {
    return sendResult(res, await teamService.deleteTeamRole(req));
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getTeamTypesStatus = async (req, res) => {
  try {
    return sendResult(res, await teamService.getTeamTypesStatus(req));
  } catch (error) {
    return handleError(res, error);
  }
};
