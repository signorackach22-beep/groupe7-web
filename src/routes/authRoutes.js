const express = require("express");
const router = express.Router();

const { register, login, refreshToken, me } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const { registerValidation, loginValidation, validate } = require("../validators/authValidator");

// POST /api/auth/register
router.post("/register", registerValidation, validate, register);

// POST /api/auth/login
router.post("/login", loginValidation, validate, login);

// POST /api/auth/refresh
router.post("/refresh", refreshToken);

// GET /api/auth/me  (route protégée)
router.get("/me", authMiddleware, me);

module.exports = router;
