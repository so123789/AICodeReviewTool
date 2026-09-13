// Centralized environment validation.
// Fails fast on boot with a clear message instead of crashing later on a
// missing secret (e.g. jwt.sign throwing deep inside a request handler).

require("dotenv").config(); // load .env into process.env before validation

const REQUIRED = ["MONGO_URI", "JWT_SECRET", "ANTHROPIC_API_KEY"];

function loadEnv() {
  const missing = REQUIRED.filter((key) => !process.env[key] || process.env[key].trim() === "");

  if (missing.length > 0) {
    // eslint-disable-next-line no-console
    console.error(
      `\n❌ Missing required environment variable(s): ${missing.join(", ")}\n` +
      `   Copy server/.env.example to server/.env and fill in real values.\n`
    );
    process.exit(1);
  }

  if (process.env.JWT_SECRET.length < 16) {
    console.warn(
      "⚠️  JWT_SECRET is short. Use a long, random string (32+ chars) in production."
    );
  }

  return {
    port: parseInt(process.env.PORT, 10) || 5000,
    nodeEnv: process.env.NODE_ENV || "development",
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    anthropicModel: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
    // Comma-separated list of allowed origins for CORS.
    corsOrigins: (process.env.CORS_ORIGINS || "http://localhost:5173")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean),
    maxCodeLength: parseInt(process.env.MAX_CODE_LENGTH, 10) || 20000,
  };
}

module.exports = loadEnv();
