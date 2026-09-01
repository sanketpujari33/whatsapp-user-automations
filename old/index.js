const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const env = require("./config/env");
const { connectDatabase } = require("./config/database");
const authService = require("./services/auth.service");
const eventBus = require("./utils/eventBus");

// Workers are imported once to activate queue processors.
require("./workers/message.worker");
require("./workers/recharge.worker");

async function bootstrap() {
  await connectDatabase();
  await authService.ensureAdminUser();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", (socket) => {
    socket.emit("system", { message: "Connected to wallet server" });
  });

  eventBus.on("wallet:transfer", (payload) => {
    io.emit("wallet:transfer", payload);
  });

  eventBus.on("recharge:updated", (payload) => {
    io.emit("recharge:updated", payload);
  });

  server.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Server bootstrap failed:", error);
  process.exit(1);
});