# Frontend - Montres de Luxe

## Description

Frontend web pour l'application Montres de Luxe, réalisé avec Vite et connecté à une API REST.

## Technologies utilisées

- **Vite** : Build tool et serveur de développement
- **JavaScript ES6+** : Langage principal
- **SCSS** : Préprocesseur CSS
- **Fetch API** : Communication avec le backend

## Configuration de l'API

Le frontend communique avec un backend REST API. Les URLs d'API sont configurées dans `config/env.js` :

```javascript
export const env = {
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5253",
  BACKEND_PRODUCTS_URL:
    import.meta.env.VITE_BACKEND_PRODUCTS_URL ||
    "http://localhost:5253/products",
  BACKEND_USERS_URL:
    import.meta.env.VITE_BACKEND_USERS_URL || "http://localhost:5253/users",
};
```

### Variables d'environnement

Créez un fichier `.env` à la racine du projet frontend pour personnaliser les URLs :

```
VITE_BACKEND_URL=http://localhost:5253
VITE_BACKEND_PRODUCTS_URL=http://localhost:5253/products
VITE_BACKEND_USERS_URL=http://localhost:5253/users
```

## Installation et démarrage

1. **Installer les dépendances** :

   ```bash
   npm install
   ```

2. **Démarrer le serveur backend** (dans le dossier backend) :

   ```bash
   npm start
   ```

3. **Démarrer le serveur de développement frontend** :

   ```bash
   npm run dev
   ```

4. **Accéder à l'application** :
   - Frontend : http://localhost:5173
   - Backend API : http://localhost:5253

## Fonctionnalités

### Pages disponibles

- **Accueil** (`/`) : Liste des produits avec filtrage par marque
- **Formulaire** (`/form/form.html`) : Formulaire de contact
- **Connexion** (`/login/login.html`) : Page de connexion
- **Inscription** (`/register/register.html`) : Page d'inscription

### Service API

Le service API (`src/services/api.js`) fournit :

#### Produits

- `getAllProducts()` : Récupérer tous les produits
- `getProductById(id)` : Récupérer un produit par ID
- `createProduct(product)` : Créer un nouveau produit (admin)
- `updateProduct(id, product)` : Mettre à jour un produit (admin)
- `deleteProduct(id)` : Supprimer un produit (admin)

#### Utilisateurs

- `getAllUsers()` : Récupérer tous les utilisateurs (admin)
- `getUserById(id)` : Récupérer un utilisateur par ID
- `createUser(user)` : Créer un nouvel utilisateur
- `updateUser(id, user)` : Mettre à jour un utilisateur
- `deleteUser(id)` : Supprimer un utilisateur
- `promoteToAdmin(id)` : Promouvoir un utilisateur en admin (admin)
- `demoteFromAdmin(id)` : Rétrograder un admin en utilisateur (admin)

## Gestion des erreurs

- Messages de chargement pendant les requêtes API
- Messages d'erreur en cas d'échec des requêtes
- Gestion des cas où le backend n'est pas disponible
- Fallback vers une page d'erreur avec bouton de rechargement

## Développement

### Commands utiles

```bash
# Démarrer en mode développement
npm run dev

# Construire pour la production
npm run build

# Prévisualiser la build de production
npm run preview
```

### API Backend requis

Le frontend nécessite que le backend soit démarré pour fonctionner. Les endpoints suivants sont utilisés :

- `GET /products` : Liste des produits
- `GET /products/:id` : Détail d'un produit
- `GET /users` : Liste des utilisateurs (admin)
- `POST /users` : Créer un utilisateur
- `PUT /users/:id` : Mettre à jour un utilisateur
- `DELETE /users/:id` : Supprimer un utilisateur

## Migration depuis la version statique

Cette version a été migrée d'une version statique utilisant des données en dur. Les principales modifications :

1. **Remplacement des imports statiques** par des appels API
2. **Ajout de gestion asynchrone** avec async/await
3. **Ajout de gestion d'erreurs** et de messages de chargement
4. **Service API centralisé** pour tous les appels
5. **Configuration d'environnement** pour les URLs d'API

Le fichier `data/products.js` est maintenant obsolète et peut être supprimé.
