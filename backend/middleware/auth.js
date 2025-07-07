import User from "../database/models/User.js";

export const requireAdmin = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentification requise - Header 'x-user-id' manquant"
      });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Utilisateur non trouvé"
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: "Accès refusé - Privilèges administrateur requis"
      });
    }

    req.user = user;
    next();
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la vérification des privilèges"
    });
  }
};

export const getUser = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};
