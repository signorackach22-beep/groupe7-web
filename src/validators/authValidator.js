const { body, validationResult } = require("express-validator");

// Règles de validation inscription
exports.registerValidation = [
  body("name")
    .notEmpty()
    .withMessage("Le nom est obligatoire"),

  body("email")
    .isEmail()
    .withMessage("Email invalide"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères"),
];

// Règles de validation connexion
exports.loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Email invalide"),

  body("password")
    .notEmpty()
    .withMessage("Mot de passe obligatoire"),
];

// Middleware vérification erreurs
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
