const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requêtes max par IP
  message: {
    message: "Trop de requêtes depuis cette IP, réessayez dans 15 minutes.",
  },
});

module.exports = limiter;
