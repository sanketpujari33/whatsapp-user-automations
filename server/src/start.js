const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const crypto = require("crypto");
const initializeConstants = require("./config/const_credential.js");
const { connectDB } = require("./db/dbconnection.js");

// Initialize Express
const app = express();

// ── Security Middleware ───────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  }),
);
app.use(mongoSanitize());
app.use(compression({ level: 6, threshold: 1024 }));
app.use(express.json({ limit: process.env.LIMIT || "10mb" }));
app.use(
  express.urlencoded({ extended: true, limit: process.env.LIMIT || "10mb" }),
);

// ── Request ID Middleware ────────────────────────────────────────────
app.use((req, res, next) => {
  req.requestId = req.headers["x-request-id"] || crypto.randomUUID();
  res.setHeader("X-Request-Id", req.requestId);
  next();
});

// ── Health Check (before auth, for external monitoring) ──────────────
app.get("/health", (req, res) => {
  const { healthCheck } = require("./middlewares/health");
  return healthCheck(req, res);
});

// CORS Configuration — no wildcard in production
const ALLOWED_ORIGINS_ENV = process.env.ALLOWED_ORIGINS;
const defaultOrigins = ALLOWED_ORIGINS_ENV
  ? ALLOWED_ORIGINS_ENV.split(",").map((origin) => origin.trim())
  : process.env.NODE_ENV === "production"
    ? []
    : ["*"];

// Payment gateway domains — always allowed (they POST callbacks from their servers/browsers)
// Sources: all *-callback routes in paymentRoute.js
const paymentGatewayOrigins = [
  // PayU
  "https://secure.payu.in",
  "https://test.payu.in",
  "https://payubiz.in",
  "https://www.payubiz.in",
  "https://info.payu.in",
  // Cashfree
  "https://api.cashfree.com",
  "https://sandbox.cashfree.com",
  "https://payments.cashfree.com",
  "https://www.cashfree.com",
  // RazorPay
  "https://api.razorpay.com",
  "https://checkout.razorpay.com",
  "https://www.razorpay.com",
  // Decentro
  "https://in.decentro.tech",
  "https://api.decentro.tech",
  // PhonePe
  "https://api.phonepe.com",
  "https://mercury.phonepe.com",
  // YesBank
  "https://www.yesbank.in",
  "https://api.yesbank.in",
  // WatchPay / SabPaisa / other PGs — allow their domains via env if needed
  "https://www.sabpaisa.in",
  "https://api.sabpaisa.in",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (defaultOrigins.includes("*")) {
      return callback(null, true);
    }
    // Always allow payment gateway origins (PayU, Cashfree, etc.)
    if (paymentGatewayOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    if (defaultOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "platform",
    "X-Requested-With",
    "Accept",
  ],
  exposedHeaders: ["Content-Length", "X-Request-Id"],
  maxAge: 86400,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));
app.use(express.static(path.join(__dirname, "/public")));

// Request logger with cluster worker info
const cluster = require("node:cluster");
const workerId =
  cluster.isWorker && cluster.worker ? cluster.worker.id : "primary";
app.use((req, res, next) => {
  console.log(
    `[cluster worker=${workerId} pid=${process.pid}] ${req.method} ${req.originalUrl}`,
  );
  next();
});

// Default Route
app.get("/", (req, res) => {
  res.send("Astroway API Gateway running ✅");
});

// Start Server
const startServer = async () => {
  try {
    // Step 1: Connect to DB first using env vars (before DB config lookup)
    const envUrl = process.env.DB_URL;
    const mongoUri = process.env.MONGO_URI;
    const defaultUrl = "mongodb://127.0.0.1:27017/whatsapp_wallet"; // Default DB URL if not provided in .env
    const dbUrl = envUrl || mongoUri || defaultUrl;
    if (!dbUrl) {
      throw new Error("DB_URL is not defined");
    }
    if (envUrl) {
      console.log("Using DB_URL from .env");
    } else if (mongoUri) {
      console.log("Using MONGO_URI from .env as DB_URL fallback");
    } else {
      console.log("Using default DB_URL from const_credential.js");
    }
    await connectDB(dbUrl);

    // Step 2: Now fetch config from DB (DB connection is already established)
    global.constant = await initializeConstants();

    // Connect Redis
    const radis = require("./utils/radis/indexRadis.js");
    radis
      .connect()
      .then(() => {
        console.log("✅ Redis connected successfully");
      })
      .catch((err) => {
        console.warn("⚠️ Redis connection failed (non-blocking):", err.message);
      });

    // Register Routes
    require("./routes.js")(app);

    const http = require("http");
    const server = http.createServer(app);

    const port = process.env.API_PORT;
    const listenPort = port || 5002;
    // Enable port reuse to avoid EADDRINUSE on Windows with multiple worker restarts
    server.listen(listenPort, () => {
      console.log(`✅ Server started on port ${listenPort} (Socket.IO ready)`);
    });
  } catch (error) {
    console.error("❌ Failed to start the server:", error);
    process.exit(1);
  }
};

startServer();
