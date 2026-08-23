const router = require("express").Router();
const Anthropic = require("@anthropic-ai/sdk");
const Review = require("../models/Review");
const protect = require("../middleware/protect");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post("/", protect, async (req, res) => {
  const { code, language } = req.body;
  if (!code || !language) {
    return res.status(400).json({ error: "Code and language are required" });
  }

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [{
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
      }],
    });

    const feedback = message.content[0].text;
    const review = await Review.create({ userId: req.userId, code, language, feedback });
    res.json({ feedback, reviewId: review._id });
  } catch (err) {
    console.error("Claude API error:", err);
    res.status(500).json({ error: "AI review failed. Check your API key." });
  }
});

router.get("/history", protect, async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;
