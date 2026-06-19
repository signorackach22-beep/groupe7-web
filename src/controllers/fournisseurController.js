const prisma = require("../utils/prisma");

exports.getAll = async (req, res) => {
  try {
    const fournisseurs = await prisma.fournisseur.findMany({ orderBy: { nom: "asc" } });
    res.json({ fournisseurs, total: fournisseurs.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const f = await prisma.fournisseur.findUnique({ where: { id: Number(req.params.id) } });
    if (!f) return res.status(404).json({ message: "Fournisseur introuvable" });
    res.json({ fournisseur: f });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    const f = await prisma.fournisseur.create({ data: req.body });
    res.status(201).json({ message: "Fournisseur créé", fournisseur: f });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.update = async (req, res) => {
  try {
    const f = await prisma.fournisseur.update({
      where: { id: Number(req.params.id) }, data: req.body
    });
    res.json({ message: "Fournisseur modifié", fournisseur: f });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.remove = async (req, res) => {
  try {
    await prisma.fournisseur.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Fournisseur supprimé" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
