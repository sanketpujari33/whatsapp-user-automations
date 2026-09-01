const { Worker } = require("bullmq");
const { redis } = require("../config/redis");
const { sendTextMessage } = require("../services/openwa.service");
const ConversationLog = require("../models/ConversationLog");
const User = require("../models/User");
const { normalizePhone } = require("../utils/phone");

const messageWorker = new Worker(
  "message-queue",
  async (job) => {
    const { sessionId, to, text } = job.data;
    const result = await sendTextMessage({ sessionId, to, text });

    const phone = normalizePhone(to);
    if (phone) {
      const user = await User.findOne({ phone });
      await ConversationLog.create({
        user: user ? user._id : undefined,
        phone,
        sessionId,
        direction: "outgoing",
        message: text
      });
    }

    return result;
  },
  {
    connection: redis
  }
);

messageWorker.on("failed", (job, error) => {
  console.error("Message job failed", job?.id, error.message);
});

module.exports = messageWorker;