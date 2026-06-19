const prisma = require("../utils/prisma");

exports.getAll = async (req, res) => {
  try {
    const stocks = await prisma.stock.findMany({
      include: { medicament: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ stocks });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.mouvement = async (req, res) => {
  try {
    const { medicamentId, type, quantite, motif } = req.body;
    const med = await prisma.medicament.findUnique({ where: { id: Number(medicamentId) } });
    if (!med) return res.status(404).json({ message: "Médicament introuvable" });

    let newQuantite = med.quantite;
    if (type === "ENTREE") newQuantite += parseInt(quantite);
    else if (type === "SORTIE") {
      if (med.quantite < quantite) return res.status(400).json({ message: "Stock insuffisant" });
      newQuantite -= parseInt(quantite);
    } else if (type === "AJUSTEMENT") {
      newQuantite = parseInt(quantite);
    }

    await prisma.medicament.update({ where: { id: Number(medicamentId) }, data: { quantite: newQuantite } });
    const stock = await prisma.stock.create({
      data: { medicamentId: Number(medicamentId), type, quantite: parseInt(quantite), motif }
    });
    res.status(201).json({ message: "Mouvement enregistré", stock, nouvelleQuantite: newQuantite });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
