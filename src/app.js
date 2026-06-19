const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const routes = require("./routes");
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({ message: "PharmaCare API — ENASTIC L2-S4-DAWM 2025-2026" });
});

app.use((req, res) => res.status(404).json({ message: "Route introuvable" }));
app.use(errorMiddleware);

module.exports = app;
