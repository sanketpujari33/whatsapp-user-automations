const { Queue } = require("bullmq");
const { redis } = require("../config/redis");

const rechargeQueue = new Queue("recharge-queue", {
  connection: redis
});

async function enqueueRecharge(payload) {
  return rechargeQueue.add("recharge-request", payload, {
    attempts: 3,
    removeOnComplete: 200,
    removeOnFail: 500,
    backoff: {
      type: "fixed",
      delay: 1500
    }
  });
}

module.exports = {
  rechargeQueue,
  enqueueRecharge
};