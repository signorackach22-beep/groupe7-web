require("dotenv").config(); // Charger variables .env

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("==========================================");
  console.log(`  Serveur lancé sur http://localhost:${PORT}`);
  console.log("  TP2 Backend — ENASTIC L2-S4-DAWM");
  console.log("==========================================");
  console.log("  Routes disponibles :");
  console.log(`  POST   http://localhost:${PORT}/api/auth/register`);
  console.log(`  POST   http://localhost:${PORT}/api/auth/login`);
  console.log(`  POST   http://localhost:${PORT}/api/auth/refresh`);
  console.log(`  GET    http://localhost:${PORT}/api/auth/me`);
  console.log(`  GET    http://localhost:${PORT}/api/users/profile`);
  console.log(`  GET    http://localhost:${PORT}/api/users`);
  console.log(`  GET    http://localhost:${PORT}/api/users/:id`);
  console.log(`  PUT    http://localhost:${PORT}/api/users/:id`);
  console.log(`  DELETE http://localhost:${PORT}/api/users/:id`);
  console.log("==========================================");
});
