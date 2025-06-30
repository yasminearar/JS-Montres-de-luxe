# Backend API - Montres de Luxe

##  Description

API REST pour la gestion d'une boutique de montres de luxe. Backend développé avec Express.js et base de données JSON.

## Installation

```bash
cd backend
npm install
npm start
```

Le serveur démarre sur `http://localhost:5253`

## Endpoints API

### **Base URL**: `http://localhost:5253`

### **Routes générales**

- `GET /` - Page d'accueil de l'API
F
### **Routes Produits** (`/products`)

| Méthode  | Endpoint                  | Description                   |
| -------- | ------------------------- | ----------------------------- |
| `POST`   | `/products`               | Créer une nouvelle montre     |
| `GET`    | `/products`               | Lister toutes les montres     |
| `GET`    | `/products/available`     | Montres disponibles en stock  |
| `GET`    | `/products/stats`         | Statistiques des montres      |
| `GET`    | `/products/brands`        | Liste des marques             |
| `GET`    | `/products/search/:query` | Rechercher des montres        |
| `GET`    | `/products/brand/:marque` | Montres par marque            |
| `GET`    | `/products/:id`           | Obtenir une montre spécifique |
| `PUT`    | `/products/:id`           | Mettre à jour une montre      |
| `PATCH`  | `/products/:id/stock`     | Gérer le stock                |
| `DELETE` | `/products/:id`           | Supprimer une montre          |


## Structure du projet

```
backend/
├── controllers/
│   └── watch.controllers.js
├── database/
│   ├── models/
│   │   └── Watch.js
│   └── JSONArrayDatabase.js
├── data/
│   └── watches.json
├── routes/
│   ├── index.js
│   └── products.routes.js
├── public/
│   └── assets/
├── package.json
└── server.js
```

## Fonctionnalités

-  CRUD complet pour les montres
-  Gestion des stocks avec validation
-  Recherche textuelle multi-champs
-  Filtrage par marque et disponibilité
-  Statistiques et analytics
-  Validation des données
-  Gestion d'erreurs structurée
-  Base de données JSON persistante
-  API responses standardisées

## Format des réponses

Toutes les réponses suivent le format:

```json
{
  "success": true|false,
  "message": "Description optionnelle",
  "data": {},
  "count": 0,
  "error": "Message d'erreur si applicable"
}
```
