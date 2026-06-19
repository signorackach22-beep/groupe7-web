const prisma = require("../utils/prisma");
const bcrypt = require("bcryptjs");

// =====================================
// GET ALL — Récupérer tous les utilisateurs
// =====================================
exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ users, total: users.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =====================================
// GET ONE — Récupérer utilisateur par ID
// =====================================
exports.getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =====================================
// UPDATE — Modifier utilisateur
// =====================================
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const data = {};
    if (name) data.name = name;
    if (email) data.email = email;
    if (password) data.password = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.json({ message: "Utilisateur modifié", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =====================================
// DELETE — Supprimer utilisateur
// =====================================
exports.deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: Number(req.params.id) },
    });
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =====================================
// PROFILE — Profil de l'utilisateur connecté
// =====================================
exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    res.json({ message: "Profil utilisateur", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
