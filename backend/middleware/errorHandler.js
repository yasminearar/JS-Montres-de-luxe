// Middleware de gestion des erreurs
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log pour le développement
  console.error(err);

  // Erreur par défaut
  let statusCode = error.statusCode || 500;
  let message = error.message || "Erreur serveur";

  // Réponse au client
  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

export default errorHandler;
