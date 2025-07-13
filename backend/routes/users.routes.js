import express from "express";
import {
  afficherTousLesutilisateurs,
  creeUnNouvelUtilisateur,
  supprimerUnUtilisateur,
  obtenirUnUtilisateur,
  mettreAJourUnUtilisateur,
  obtenirAdmins,
  promouvoirAdmin,
  connecterUtilisateur,
} from "../controllers/user.controller.js";

import { protect, restrictTo, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Routes publiques/utilisateur
router.get("/", afficherTousLesutilisateurs);
router.get("/:id", obtenirUnUtilisateur);
router.post("/", creeUnNouvelUtilisateur);
router.post("/login", connecterUtilisateur);
router.put("/:id", protect, mettreAJourUnUtilisateur);

// Routes admin uniquement
router.get("/admin/list", protect, restrictTo('admin'), obtenirAdmins);
router.delete("/:id", protect, restrictTo('admin'), supprimerUnUtilisateur);
router.patch("/:id/promote", protect, restrictTo('admin'), promouvoirAdmin);

export default router;
