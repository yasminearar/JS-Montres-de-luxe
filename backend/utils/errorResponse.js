// Classe pour la gestion standardisée des erreurs
class ErrorResponse extends Error {
  /**
   * Crée une instance d'ErrorResponse
   * @param {string} message - Message d'erreur
   * @param {number} statusCode - Code HTTP de l'erreur
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorResponse;
