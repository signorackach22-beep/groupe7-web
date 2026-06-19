const bcrypt = require("bcryptjs");
const prisma = require("../utils/prisma");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const jwt = require("jsonwebtoken");

// =====================================
// REGISTER — Inscription
// =====================================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Vérifier si email déjà utilisé
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    // Hash du mot de passe (10 rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création utilisateur en base
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Réponse sans le mot de passe
    const { password: _, ...userSafe } = user;

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: userSafe,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =====================================
// LOGIN — Connexion
// =====================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Rechercher utilisateur par email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable" });
    }

    // Vérifier mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // Générer tokens JWT
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
      message: "Connexion réussie",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =====================================
// REFRESH TOKEN — Renouveler token
// =====================================
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token manquant" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable" });
    }

    const newAccessToken = generateAccessToken(user);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ message: "Refresh token invalide ou expiré" });
  }
};

// =====================================
// ME — Profil utilisateur connecté
// =====================================
exports.me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
