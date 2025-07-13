/**
 * Middleware pour gérer les fonctions async dans les contrôleurs
 * Élimine le besoin de try/catch dans chaque fonction de contrôleur
 * @param {Function} fn - Fonction asynchrone à envelopper
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
