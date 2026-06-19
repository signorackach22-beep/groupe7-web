# TP2 Backend — API REST + JWT + Prisma + Sécurité

Cours : L2-S4-DAWM — Outils de développement web  
Enseignant : Dr Abakar Issakha Souleymane  
École : ENASTIC — Année académique 2025-2026

## Installation

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

## Routes API

| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| POST | /api/auth/register | Public | Inscription |
| POST | /api/auth/login | Public | Connexion |
| POST | /api/auth/refresh | Public | Renouveler token |
| GET | /api/auth/me | Connecté | Mon profil |
| GET | /api/users/profile | Connecté | Mon profil |
| GET | /api/users | Admin | Tous les utilisateurs |
| GET | /api/users/:id | Connecté | Un utilisateur |
| PUT | /api/users/:id | Connecté | Modifier |
| DELETE | /api/users/:id | Admin | Supprimer |

## Tests Postman

### Inscription
POST http://localhost:5000/api/auth/register
```json
{
  "name": "Ali",
  "email": "ali@mail.com",
  "password": "123456"
}
```

### Connexion
POST http://localhost:5000/api/auth/login
```json
{
  "email": "ali@mail.com",
  "password": "123456"
}
```

### Route protégée
GET http://localhost:5000/api/users/profile  
Header: `Authorization: Bearer <accessToken>`

## Structure

```
tp2-backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── rateLimiter.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── jwt.js
│   │   └── prisma.js
│   ├── validators/
│   │   └── authValidator.js
│   ├── app.js
│   └── server.js
├── .env
├── .gitignore
└── package.json
```
