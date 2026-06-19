require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("=====================================================");
  console.log(`  PharmaCare API — http://localhost:${PORT}`);
  console.log("  Projet Intégratif Full-Stack — ENASTIC L2-S4-DAWM");
  console.log("=====================================================");
  console.log("  POST   /api/auth/register");
  console.log("  POST   /api/auth/login");
  console.log("  GET    /api/dashboard");
  console.log("  GET    /api/medicaments");
  console.log("  GET    /api/medicaments/alertes");
  console.log("  GET    /api/stocks");
  console.log("  POST   /api/stocks/mouvement");
  console.log("  GET    /api/clients");
  console.log("  GET    /api/fournisseurs");
  console.log("  GET    /api/ventes");
  console.log("  POST   /api/ventes");
  console.log("=====================================================");
});
