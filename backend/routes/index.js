// routes/index.js
import express from "express";
import productsRoutes from "./products.routes.js";
import usersRoutes from "./users.routes.js";
import authRoutes from "./auth.routes.js";
import ordersRoutes from "./orders.routes.js";

const router = express.Router();

// Importer les différent router des routes

// Middleware de validation
const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

router.get("/", (req, res) => {
  res.end("Coucou !");
});

// Routes des produits (montres)
router.use("/products", productsRoutes);

// Routes des utilisateurs
router.use("/users", usersRoutes);

// Routes d'authentification
router.use("/auth", authRoutes);

// Routes des commandes
router.use("/orders", ordersRoutes);

// Middleware pour les routes non trouvées
router.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Route non trouvée",
    path: req.originalUrl,
    method: req.method
  });
});

export default router;
