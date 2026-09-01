const express = require('express');

const teamController = require('../controller/team.controller');
const auth = require('../../../middlewares/auth');
const checkPermission = require('../../../middlewares/checkPermission');
const { rateLimiter } = require('../../../utils/radis');

const teamLimiter = rateLimiter({
  windowMs: 60 * 1000,
  max: 120,
  keyGenerator: (req) => `team:${req.ip}`,
});

const teamRoleLimiter = rateLimiter({
  windowMs: 60 * 1000,
  max: 120,
  keyGenerator: (req) => `team-roles:${req.ip}`,
});

const teamTypesLimiter = rateLimiter({
  windowMs: 60 * 1000,
  max: 60,
  keyGenerator: (req) => `team-types:${req.ip}`,
});

const teamRouter = express.Router();
teamRouter.get('/', auth, checkPermission('Team', 'view'), teamLimiter, teamController.listTeams);
teamRouter.get('/:id', auth, checkPermission('Team', 'view'), teamLimiter, teamController.getTeamById);
teamRouter.post('/', auth, checkPermission('Team', 'create'), teamLimiter, teamController.createTeam);
teamRouter.put('/:id', auth, checkPermission('Team', 'edit'), teamLimiter, teamController.updateTeam);
teamRouter.patch('/:id', auth, checkPermission('Team', 'edit'), teamLimiter, teamController.updateTeam);
teamRouter.patch(
  '/:id/toggle-status',
  auth,
  checkPermission('Team', 'edit'),
  teamLimiter,
  teamController.toggleTeamStatus,
);
teamRouter.delete('/:id', auth, checkPermission('Team', 'delete'), teamLimiter, teamController.deleteTeam);

const teamRolesRouter = express.Router();
teamRolesRouter.get('/', auth, checkPermission('Team', 'view'), teamRoleLimiter, teamController.listTeamRoles);
teamRolesRouter.post('/', auth, checkPermission('Team', 'create'), teamRoleLimiter, teamController.createTeamRole);
teamRolesRouter.put('/:id', auth, checkPermission('Team', 'edit'), teamRoleLimiter, teamController.updateTeamRole);
teamRolesRouter.patch('/:id', auth, checkPermission('Team', 'edit'), teamRoleLimiter, teamController.updateTeamRole);
teamRolesRouter.delete(
  '/:id',
  auth,
  checkPermission('Team', 'delete'),
  teamRoleLimiter,
  teamController.deleteTeamRole,
);

const teamTypesRouter = express.Router();
teamTypesRouter.get(
  '/status',
  auth,
  checkPermission('Team', 'view'),
  teamTypesLimiter,
  teamController.getTeamTypesStatus,
);

module.exports = {
  teamRouter,
  teamRolesRouter,
  teamTypesRouter,
};
