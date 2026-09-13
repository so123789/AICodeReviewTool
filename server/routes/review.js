const router = require("express").Router();
const Anthropic = require("@anthropic-ai/sdk");
const { body, query } = require("express-validator");

const Review = require("../models/Review");
const protect = require("../middleware/protect");
const validate = require("../middleware/validate");
const asyncHandler = require("../middleware/asyncHandler");
const { reviewLimiter } = require("../middleware/rateLimiter");
const { ApiError } = require("../middleware/errorHandler");
const env = require("../config/env");

const client = new Anthropic({ apiKey: env.anthropicApiKey });

const ALLOWED_LANGUAGES = [
  "javascript", "typescript", "python", "java", "cpp", "c", "go", "rust",
  "php", "ruby", "kotlin", "swift", "sql", "html", "css",
];

const reviewRules = [
  body("code")
    .isString().withMessage("Code must be a string")
    .trim().notEmpty().withMessage("Code is required")
    .isLength({ max: env.maxCodeLength })
    .withMessage(`Code must be ${env.maxCodeLength} characters or fewer`),
  body("language")
    .isString()
    .isIn(ALLOWED_LANGUAGES)
    .withMessage(`Language must be one of: ${ALLOWED_LANGUAGES.join(", ")}`),
];

router.post(
  "/",
  protect,
  reviewLimiter,
  reviewRules,
  validate,
  asyncHandler(async (req, res) => {
    const { code, language } = req.body;

    let message;
    try {
      message = await client.messages.create({
        model: env.anthropicModel,
        max_tokens: 2048,
        messages: [
          {
            role: "user",
            content: `You are an expert code reviewer. Analyze the following ${language} code thoroughly.

Structure your response with clear markdown headings for each issue found. For each issue use this format:

## [Severity] Issue Title
**Line:** (line number if identifiable, or "General")
**Problem:** Brief description of what is wrong.
**Why it matters:** Why this is a concern.
**Fix:** How to resolve it.
\`\`\`${language}
// corrected code here
\`\`\`

Severity levels: Critical, High, Medium, Low, Good Practice

After all findings, add a ## Summary section with:
- Overall assessment
- Score: X/10
- Top 3 action items

Code to review:
\`\`\`${language}
${code}
\`\`\``,
          },
        ],
      });
    } catch (err) {
      console.error("Claude API error:", err.message);
      throw new ApiError(502, "AI review failed. The AI provider is unavailable or the API key is invalid.");
    }

    const feedback = message.content[0].text;
    const review = await Review.create({ userId: req.userId, code, language, feedback });
    res.json({ feedback, reviewId: review._id });
  })
);

const historyQueryRules = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 50 }).toInt(),
];

router.get(
  "/history",
  protect,
  historyQueryRules,
  validate,
  asyncHandler(async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({ userId: req.userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments({ userId: req.userId }),
    ]);

    res.json({
      reviews,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

module.exports = router;
