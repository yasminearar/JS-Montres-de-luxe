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

import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Routes publiques/utilisateur
router.get("/", afficherTousLesutilisateurs);
router.get("/:id", obtenirUnUtilisateur);
router.post("/", creeUnNouvelUtilisateur);
router.post("/login", connecterUtilisateur);
router.put("/:id", mettreAJourUnUtilisateur);

// Routes admin uniquement
router.get("/admin/list", requireAdmin, obtenirAdmins);
router.delete("/:id", requireAdmin, supprimerUnUtilisateur);
router.patch("/:id/promote", requireAdmin, promouvoirAdmin);

export default router;
