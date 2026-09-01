const IORedis = require("ioredis");
const env = require("./env");

const redis = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null
});

redis.on("error", (err) => {
  console.error("Redis error:", err.message);
});

module.exports = {
  redis
};