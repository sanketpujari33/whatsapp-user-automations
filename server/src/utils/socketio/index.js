const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io = null;

// ── Presence Tracking ───────────────────────────────────────────────
const onlineUsers = new Map(); // userId -> { socketIds: Set, role, lastSeen, metadata }

function init(httpServer, options = {}) {
  if (io) return io;

  io = new Server(httpServer, {
    cors: {
      origin: options.corsOrigin || '*',
      credentials: true,
    },
    pingInterval: 25000,
    pingTimeout: 20000,
    transports: ['websocket', 'polling'],
    maxHttpBufferSize: 1e6, // 1MB
  });

  // ── Authentication Middleware ─────────────────────────────────────
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) return next(new Error('Authentication required'));

      const secret = process.env.JWT_SECRET || global.constant?.JWT_SECRET || global.constant?.SECRET_TOKEN;
      if (!secret) return next(new Error('JWT secret not configured'));

      const decoded = jwt.verify(token, secret);
      socket.userId = decoded._id || decoded.id || decoded.userId;
      socket.role = decoded.role || 'user';
      socket.userData = decoded;
      next();
    } catch (err) {
      return next(new Error('Invalid token'));
    }
  });

  // ── Connection Handler ────────────────────────────────────────────
  io.on('connection', (socket) => {
    const { userId } = socket;
    if (!userId) return socket.disconnect();
  });

  return io;
}

  
function getInstance() {
  return io;
}
  
module.exports = {
  init
};
