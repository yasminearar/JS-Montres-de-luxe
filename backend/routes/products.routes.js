import express from "express";
const router = express.Router();

import {
  creerMontre,
  listerToutesLesMontres,
  montresDisponibles,
  obtenirUneMontre,
  mettreAJourUneMontre,
  mettreAJourLeStock,
  supprimerUneMontre,
  rechercherMontres,
  obtenirMarques,
  montresParMarque,
  statistiquesMontres
} from "../controllers/watch.controllers.js";

import { protect, restrictTo, requireAdmin, getUser } from "../middleware/auth.js";

// POST /products - Créer une montre (ADMIN REQUIS)
router.post("/", protect, restrictTo('admin'), creerMontre);

// GET /products - Lister toutes les montres
router.get("/", listerToutesLesMontres);

// GET /products/available - Montres disponibles
router.get("/available", montresDisponibles);

// GET /products/stats - Statistiques des montres
router.get("/stats", statistiquesMontres);

// GET /products/brands - Obtenir toutes les marques
router.get("/brands", obtenirMarques);

// GET /products/search/:query - Rechercher des montres
router.get("/search/:query", rechercherMontres);

// GET /products/brand/:marque - Montres par marque
router.get("/brand/:marque", montresParMarque);

// PUT /products/:id - Mettre à jour une montre (ADMIN REQUIS)
router.put("/:id", protect, restrictTo('admin'), mettreAJourUneMontre);

// PATCH /products/:id/stock - Mettre à jour le stock (ADMIN REQUIS)
router.patch("/:id/stock", protect, restrictTo('admin'), mettreAJourLeStock);

// DELETE /products/:id - Supprimer une montre (ADMIN REQUIS)
router.delete("/:id", protect, restrictTo('admin'), supprimerUneMontre);

// GET /products/:id - Obtenir une montre (APRÈS toutes les routes statiques)
router.get("/:id", obtenirUneMontre);

export default router;
