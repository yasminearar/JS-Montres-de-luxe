// Utilitaire pour générer des tokens JWT
import jwt from 'jsonwebtoken';

/**
 * Génère un token JWT pour un utilisateur
 * @param {Object} user - L'objet utilisateur
 * @returns {String} - Le token JWT généré
 */
const generateToken = (user) => {
  // Payload contenant les informations utilisateur
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    firstname: user.firstname,
    lastname: user.lastname
  };

  // Génère le token avec une durée d'expiration de 30 jours
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'montres_secret_key_dev', // Utiliser une variable d'env en production
    { expiresIn: '30d' }
  );
};

export default generateToken;