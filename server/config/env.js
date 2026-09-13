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

  const mongoUri = process.env.MONGO_URI;
  const nodeEnv = process.env.NODE_ENV || "development";

  if (nodeEnv === "production" && (mongoUri.includes("127.0.0.1") || mongoUri.includes("localhost"))) {
    console.warn(
      `\n⚠️  WARNING: MONGO_URI is set to local host (${mongoUri}) in production mode.\n` +
      `   On Cloud platforms like Render, set MONGO_URI in Render Environment Variables to your MongoDB Atlas connection string:\n` +
      `   mongodb+srv://<user>:<password>@cluster.mongodb.net/ai-code-review\n`
    );
  }

  return {
    port: parseInt(process.env.PORT, 10) || 5000,
    nodeEnv,
    mongoUri,
    jwtSecret: process.env.JWT_SECRET,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    anthropicModel: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
    // Comma-separated list of allowed origins for CORS.
    corsOrigins: (process.env.CORS_ORIGINS || "http://localhost:5173,https://aicodereviewtool-1.onrender.com")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean),
    maxCodeLength: parseInt(process.env.MAX_CODE_LENGTH, 10) || 20000,
  };
}

module.exports = loadEnv();
