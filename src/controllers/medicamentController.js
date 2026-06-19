const prisma = require("../utils/prisma");

exports.getAll = async (req, res) => {
  try {
    const medicaments = await prisma.medicament.findMany({ orderBy: { nom: "asc" } });
    res.json({ medicaments, total: medicaments.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const med = await prisma.medicament.findUnique({ where: { id: Number(req.params.id) } });
    if (!med) return res.status(404).json({ message: "Médicament introuvable" });
    res.json({ medicament: med });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    const med = await prisma.medicament.create({ data: {
      nom: req.body.nom,
      categorie: req.body.categorie,
      description: req.body.description,
      prixAchat: parseFloat(req.body.prixAchat),
      prixVente: parseFloat(req.body.prixVente),
      quantite: parseInt(req.body.quantite) || 0,
      dateExpiration: new Date(req.body.dateExpiration),
      codeBarres: req.body.codeBarres,
      fabricant: req.body.fabricant,
    }});
    res.status(201).json({ message: "Médicament créé", medicament: med });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.update = async (req, res) => {
  try {
    const data = {};
    if (req.body.nom) data.nom = req.body.nom;
    if (req.body.categorie) data.categorie = req.body.categorie;
    if (req.body.description) data.description = req.body.description;
    if (req.body.prixAchat) data.prixAchat = parseFloat(req.body.prixAchat);
    if (req.body.prixVente) data.prixVente = parseFloat(req.body.prixVente);
    if (req.body.quantite !== undefined) data.quantite = parseInt(req.body.quantite);
    if (req.body.dateExpiration) data.dateExpiration = new Date(req.body.dateExpiration);
    if (req.body.fabricant) data.fabricant = req.body.fabricant;
    const med = await prisma.medicament.update({ where: { id: Number(req.params.id) }, data });
    res.json({ message: "Médicament modifié", medicament: med });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.remove = async (req, res) => {
  try {
    await prisma.medicament.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Médicament supprimé" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getAlertes = async (req, res) => {
  try {
    const now = new Date();
    const in30days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const stockFaible = await prisma.medicament.findMany({ where: { quantite: { lte: 10, gt: 0 } } });
    const rupture = await prisma.medicament.findMany({ where: { quantite: 0 } });
    const expires = await prisma.medicament.findMany({ where: { dateExpiration: { lt: now } } });
    const bientotExpires = await prisma.medicament.findMany({
      where: { dateExpiration: { gte: now, lte: in30days } }
    });
    res.json({ stockFaible, rupture, expires, bientotExpires });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
