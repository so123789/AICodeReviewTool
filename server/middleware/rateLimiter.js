const rateLimit = require("express-rate-limit");

// General API limiter — generous, mostly to blunt scripted abuse.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please slow down and try again shortly." },
});

// Tighter limiter for auth endpoints — mitigates credential stuffing /
// brute-force login attempts.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many auth attempts. Please try again in a few minutes." },
});

// Strict limiter for the AI review endpoint — each call costs real money
// against the Anthropic API, so this is the most important one to cap.
const reviewLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many review requests. Please wait a moment before submitting again." },
});

module.exports = { apiLimiter, authLimiter, reviewLimiter };
