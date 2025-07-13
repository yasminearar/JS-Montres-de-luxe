import User from "../database/models/User.js";
import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse("Authentification requise", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'montres_secret_key_dev');
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorResponse("Utilisateur non trouvé", 401));
    }

    next();
  } catch (err) {
    return next(new ErrorResponse("Token invalide ou expiré", 401));
  }
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(`Rôle ${req.user.role} non autorisé`, 403));
    }
    next();
  };
};

export const requireAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ErrorResponse("Accès refusé - Privilèges administrateur requis", 403));
  }
  next();
});

export const getUser = asyncHandler(async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'montres_secret_key_dev');
        const user = await User.findById(decoded.id);
        if (user) {
          req.user = user;
        }
      } catch (error) {
        // Ignorer les erreurs de token
      }
    }
  }
  
  next();
});
