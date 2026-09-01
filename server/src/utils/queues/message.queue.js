const { Queue } = require("bullmq");
const { redis } = require("../config/redis");

const messageQueue = new Queue("message-queue", {
  connection: redis
});

async function enqueueTextMessage(payload) {
  return messageQueue.add("send-text", payload, {
    attempts: 3,
    removeOnComplete: 200,
    removeOnFail: 500,
    backoff: {
      type: "exponential",
      delay: 1000
    }
  });
}

module.exports = {
  messageQueue,
  enqueueTextMessage
};