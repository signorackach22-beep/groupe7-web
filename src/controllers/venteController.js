const prisma = require("../utils/prisma");

exports.getAll = async (req, res) => {
  try {
    const ventes = await prisma.vente.findMany({
      include: { client: true, user: { select: { nom: true } }, items: { include: { medicament: true } } },
      orderBy: { dateVente: "desc" },
    });
    res.json({ ventes, total: ventes.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const vente = await prisma.vente.findUnique({
      where: { id: Number(req.params.id) },
      include: { client: true, user: { select: { nom: true } }, items: { include: { medicament: true } } },
    });
    if (!vente) return res.status(404).json({ message: "Vente introuvable" });
    res.json({ vente });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    const { clientId, items } = req.body;
    let montant = 0;
    for (const item of items) {
      const med = await prisma.medicament.findUnique({ where: { id: item.medicamentId } });
      if (!med) return res.status(404).json({ message: `Médicament ${item.medicamentId} introuvable` });
      if (med.quantite < item.quantite) return res.status(400).json({ message: `Stock insuffisant pour ${med.nom}` });
      montant += med.prixVente * item.quantite;
    }

    const vente = await prisma.vente.create({
      data: {
        montant,
        userId: req.user.id,
        clientId: clientId ? Number(clientId) : null,
        items: {
          create: await Promise.all(items.map(async (item) => {
            const med = await prisma.medicament.findUnique({ where: { id: item.medicamentId } });
            await prisma.medicament.update({
              where: { id: item.medicamentId },
              data: { quantite: { decrement: item.quantite } }
            });
            return { medicamentId: item.medicamentId, quantite: item.quantite, prixUnitaire: med.prixVente };
          }))
        }
      },
      include: { items: { include: { medicament: true } }, client: true }
    });
    res.status(201).json({ message: "Vente enregistrée", vente });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.dashboard = async (req, res) => {
  try {
    const totalMedicaments = await prisma.medicament.count();
    const totalVentes = await prisma.vente.count();
    const totalClients = await prisma.client.count();
    const chiffreAffaires = await prisma.vente.aggregate({ _sum: { montant: true } });
    const stockFaible = await prisma.medicament.count({ where: { quantite: { lte: 10 } } });
    res.json({
      totalMedicaments, totalVentes, totalClients,
      chiffreAffaires: chiffreAffaires._sum.montant || 0,
      stockFaible,
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
