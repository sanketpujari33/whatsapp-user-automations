const radis = require('./indexRadis');

module.exports = {
  radis,
  redisAdmin: require('./redisAdmin'),
    sessionManager: require('./sessionManager'),
  ...require('./rateLimiter'),
};
