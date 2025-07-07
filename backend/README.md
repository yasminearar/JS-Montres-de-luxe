# Backend API - Montres de Luxe

## Description

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
| -------- | ------------------------- | ----------------------------- | -------- |
| `POST`   | `/products`               | Créer une nouvelle montre     |
| `GET`    | `/products`               | Lister toutes les montres     |
| `GET`    | `/products/available`     | Montres disponibles en stock  |
| `GET`    | `/products/stats`         | Statistiques des montres      |
| `GET`    | `/products/brands`        | Liste des marques             |
| `GET`    | `/products/search/:query` | Rechercher des montres        |
| `GET`    | `/products/brand/:marque` | Montres par marque            |
| `GET`    | `/products/:id`           | Obtenir une montre spécifique |
| `PUT`    | `/products/:id`           | Mettre à jour une montre      | 🔒 Admin |
| `PATCH`  | `/products/:id/stock`     | Gérer le stock                | 🔒 Admin |
| `DELETE` | `/products/:id`           | Supprimer une montre          | 🔒 Admin |

### **Routes Utilisateurs** (`/users`)

| Méthode  | Endpoint             | Description                        | Auth     |
| -------- | -------------------- | ---------------------------------- | -------- |
| `GET`    | `/users`             | Lister tous les utilisateurs       |          |
| `GET`    | `/users/:id`         | Obtenir un utilisateur spécifique  |          |
| `POST`   | `/users`             | Créer un nouvel utilisateur        |          |
| `PUT`    | `/users/:id`         | Mettre à jour un utilisateur       |          |
| `GET`    | `/users/admin/list`  | Lister tous les administrateurs    | 🔒 Admin |
| `DELETE` | `/users/:id`         | Supprimer un utilisateur           | 🔒 Admin |
| `PATCH`  | `/users/:id/promote` | Promouvoir un utilisateur en admin | 🔒 Admin |

### **Authentification**

Pour accéder aux routes protégées (🔒 Admin), ajouter le header :

```
x-user-id: [ID_UTILISATEUR_ADMIN]
```

## Fonctionnalités

- CRUD complet pour les montres
- CRUD complet pour les utilisateurs
- **Système de rôles utilisateur (user/admin)**
- **Protection des routes par authentification admin**
- Gestion des stocks avec validation
- Filtrage par marque et disponibilité
- Validation des emails utilisateurs
- Validation des données
- Gestion d'erreurs structurée
- Base de données JSON persistante
- API responses standardisées

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
