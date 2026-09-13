const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");

const User = require("../models/User");
const env = require("../config/env");
const validate = require("../middleware/validate");
const asyncHandler = require("../middleware/asyncHandler");
const { authLimiter } = require("../middleware/rateLimiter");

const registerRules = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }),
  body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const loginRules = [
  body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

// REGISTER
router.post(
  "/register",
  authLimiter,
  registerRules,
  validate,
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed });

    res.status(201).json({ message: "User registered successfully" });
  })
);

// LOGIN
router.post(
  "/login",
  authLimiter,
  loginRules,
  validate,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Use generic error message to prevent account enumeration
    const genericError = { error: "Invalid email or password" };

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json(genericError);

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json(genericError);

    const token = jwt.sign({ id: user._id }, env.jwtSecret, { expiresIn: "7d" });

    res.json({ token, name: user.name });
  })
);

module.exports = router;
