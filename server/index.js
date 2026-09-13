const env = require("./config/env"); // validates env vars first, exits early if misconfigured

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { notFound, errorHandler } = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");

const app = express();

// --- Security & observability middleware --------------------------------
app.use(helmet());
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

// Production-hardened, multi-origin CORS handler.
// Automatically allows localhost, onrender.com subdomains, and any configured CORS_ORIGINS.
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server health checks)
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.replace(/\/$/, "");

      // Check if origin is explicitly allowed or wildcard
      const isAllowed =
        env.corsOrigins.includes("*") ||
        env.corsOrigins.some((o) => o.replace(/\/$/, "") === cleanOrigin) ||
        cleanOrigin.endsWith(".onrender.com") ||
        cleanOrigin.includes("localhost");

      if (isAllowed) {
        return callback(null, true);
      }
      
      console.warn(`[CORS] Blocked request from origin: ${origin}`);
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Cap request body size
app.use(express.json({ limit: "1mb" }));

app.use("/api", apiLimiter);

// --- Routes ---------------------------------------------------------------
app.use("/api/auth", require("./routes/auth"));
app.use("/api/review", require("./routes/review"));

// Health check endpoint
app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  res.status(dbState === 1 ? 200 : 503).json({
    status: dbState === 1 ? "ok" : "degraded",
    db: ["disconnected", "connected", "connecting", "disconnecting"][dbState] || "unknown",
    uptimeSeconds: Math.round(process.uptime()),
    environment: env.nodeEnv,
  });
});

app.get("/", (req, res) => res.json({ status: "Server running", health: "/health" }));

app.use(notFound);
app.use(errorHandler);

let server;

if (env.nodeEnv !== "test") {
  mongoose
    .connect(env.mongoUri)
    .then(() => {
      console.log("✅ MongoDB connected successfully");
      server = app.listen(env.port, "0.0.0.0", () =>
        console.log(`✅ Server running on http://0.0.0.0:${env.port} [${env.nodeEnv}]`)
      );
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err.message);
      process.exit(1);
    });
}

function shutdown(signal) {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  if (server) {
    server.close(() => {
      mongoose.connection.close(false, () => {
        console.log("✅ Closed out remaining connections.");
        process.exit(0);
      });
    });
  } else {
    process.exit(0);
  }
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

module.exports = app;
