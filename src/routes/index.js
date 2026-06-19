const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");

const authCtrl = require("../controllers/authController");
const medCtrl = require("../controllers/medicamentController");
const stockCtrl = require("../controllers/stockController");
const clientCtrl = require("../controllers/clientController");
const fournCtrl = require("../controllers/fournisseurController");
const venteCtrl = require("../controllers/venteController");

// AUTH
router.post("/auth/register", authCtrl.register);
router.post("/auth/login", authCtrl.login);
router.get("/auth/me", auth, authCtrl.me);

// DASHBOARD
router.get("/dashboard", auth, venteCtrl.dashboard);

// MEDICAMENTS
router.get("/medicaments/alertes", auth, medCtrl.getAlertes);
router.get("/medicaments", auth, medCtrl.getAll);
router.get("/medicaments/:id", auth, medCtrl.getOne);
router.post("/medicaments", auth, medCtrl.create);
router.put("/medicaments/:id", auth, medCtrl.update);
router.delete("/medicaments/:id", auth, medCtrl.remove);

// STOCKS
router.get("/stocks", auth, stockCtrl.getAll);
router.post("/stocks/mouvement", auth, stockCtrl.mouvement);

// CLIENTS
router.get("/clients", auth, clientCtrl.getAll);
router.get("/clients/:id", auth, clientCtrl.getOne);
router.post("/clients", auth, clientCtrl.create);
router.put("/clients/:id", auth, clientCtrl.update);
router.delete("/clients/:id", auth, clientCtrl.remove);

// FOURNISSEURS
router.get("/fournisseurs", auth, fournCtrl.getAll);
router.get("/fournisseurs/:id", auth, fournCtrl.getOne);
router.post("/fournisseurs", auth, fournCtrl.create);
router.put("/fournisseurs/:id", auth, fournCtrl.update);
router.delete("/fournisseurs/:id", auth, fournCtrl.remove);

// VENTES
router.get("/ventes", auth, venteCtrl.getAll);
router.get("/ventes/:id", auth, venteCtrl.getOne);
router.post("/ventes", auth, venteCtrl.create);

module.exports = router;
