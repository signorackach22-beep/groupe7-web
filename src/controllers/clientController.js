const prisma = require("../utils/prisma");

exports.getAll = async (req, res) => {
  try {
    const clients = await prisma.client.findMany({ orderBy: { nom: "asc" } });
    res.json({ clients, total: clients.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id: Number(req.params.id) },
      include: { ventes: true },
    });
    if (!client) return res.status(404).json({ message: "Client introuvable" });
    res.json({ client });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    const client = await prisma.client.create({ data: req.body });
    res.status(201).json({ message: "Client créé", client });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.update = async (req, res) => {
  try {
    const client = await prisma.client.update({
      where: { id: Number(req.params.id) }, data: req.body
    });
    res.json({ message: "Client modifié", client });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.remove = async (req, res) => {
  try {
    await prisma.client.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Client supprimé" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
