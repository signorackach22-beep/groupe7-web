const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");
const rateLimiter = require("./middlewares/rateLimiter");

const app = express();

// =============================
// MIDDLEWARES GLOBAUX
// =============================
app.use(express.json());          // Lire JSON du body
app.use(cors());                  // Autoriser frontend externe
app.use(helmet());                // Sécurité HTTP
app.use(morgan("dev"));           // Logger requêtes
app.use(rateLimiter);             // Limiter les requêtes

// =============================
// ROUTES
// =============================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Route test
app.get("/", (req, res) => {
  res.json({
    message: "API Backend TP2 — ENASTIC L2-S4-DAWM",
    version: "1.0.0",
    routes: {
      auth: "/api/auth",
      users: "/api/users",
    },
  });
});

// Route 404
app.use((req, res) => {
  res.status(404).json({ message: "Route introuvable" });
});

// =============================
// MIDDLEWARE ERREURS (en dernier)
// =============================
app.use(errorMiddleware);

module.exports = app;
