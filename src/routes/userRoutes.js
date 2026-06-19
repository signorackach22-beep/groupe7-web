const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getProfile,
} = require("../controllers/userController");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// GET /api/users/profile  — utilisateur connecté
router.get("/profile", authMiddleware, getProfile);

// GET /api/users  — admin seulement
router.get("/", authMiddleware, adminMiddleware, getUsers);

// GET /api/users/:id
router.get("/:id", authMiddleware, getUser);

// PUT /api/users/:id
router.put("/:id", authMiddleware, updateUser);

// DELETE /api/users/:id  — admin seulement
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

module.exports = router;
