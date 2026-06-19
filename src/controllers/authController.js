const bcrypt = require("bcryptjs");
const prisma = require("../utils/prisma");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");

exports.register = async (req, res) => {
  try {
    const { nom, email, password, role } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email déjà utilisé" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { nom, email, password: hashed, role: role || "pharmacien" },
    });
    const { password: _, ...safe } = user;
    res.status(201).json({ message: "Utilisateur créé", user: safe });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Utilisateur introuvable" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Mot de passe incorrect" });
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.json({ message: "Connexion réussie", accessToken, refreshToken,
      user: { id: user.id, nom: user.nom, email: user.email, role: user.role }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, nom: true, email: true, role: true, createdAt: true },
    });
    res.json({ user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
