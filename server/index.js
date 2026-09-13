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

// Flexible, production-hardened CORS middleware.
// Allows local dev (localhost) and deployed frontend origins (Render, Vercel, Netlify).
// Cleans trailing slashes from incoming origin headers for robust matching.
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow non-browser calls (mobile, curl, health checks)
      const cleanOrigin = origin.replace(/\/$/, "");
      const isAllowed =
        env.corsOrigins.includes("*") ||
        env.corsOrigins.some((o) => o.replace(/\/$/, "") === cleanOrigin);

      if (isAllowed) return callback(null, true);
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

// Cap request body size — the review endpoint also enforces MAX_CODE_LENGTH.
app.use(express.json({ limit: "1mb" }));

app.use("/api", apiLimiter);

// --- Routes ---------------------------------------------------------------
app.use("/api/auth", require("./routes/auth"));
app.use("/api/review", require("./routes/review"));

// Liveness/readiness check that also reports DB connectivity
app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState; // 1 = connected
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

// In the test environment, the test suite owns the Mongo connection
if (env.nodeEnv !== "test") {
  mongoose
    .connect(env.mongoUri)
    .then(() => {
      console.log("✅ MongoDB connected successfully");
      // Explicitly listen on '0.0.0.0' for Cloud hosting platforms (Render, Railway, Docker)
      server = app.listen(env.port, "0.0.0.0", () =>
        console.log(`✅ Server running on http://0.0.0.0:${env.port} [${env.nodeEnv}]`)
      );
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err.message);
      process.exit(1);
    });
}

// Graceful shutdown — let in-flight requests finish cleanly
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
