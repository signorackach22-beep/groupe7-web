const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Récupération header Authorization
  const authHeader = req.headers.authorization;

  // Vérification existence token
  if (!authHeader) {
    return res.status(401).json({ message: "Token manquant" });
  }

  // Format : Bearer TOKEN
  const token = authHeader.split(" ")[1];

  try {
    // Vérification et décodage token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ajouter user décodé dans la requête
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};
