import User from "../database/models/User.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "../middleware/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";

// @desc    Authentification d'un utilisateur & obtention du token
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Vérifier si email et password sont fournis
  if (!email || !password) {
    return next(new ErrorResponse("Veuillez fournir un email et un mot de passe", 400));
  }

  // Vérifier si l'utilisateur existe
  const user = await User.findByEmail(email);
  if (!user) {
    return next(new ErrorResponse("Identifiants invalides", 401));
  }

  // Vérifier si le mot de passe correspond
  const isMatch = await User.comparePassword(password, user.password);
  if (!isMatch) {
    return next(new ErrorResponse("Identifiants invalides", 401));
  }

  // Générer le token JWT
  const token = generateToken(user);

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role
    }
  });
});

// @desc    Inscription d'un nouvel utilisateur
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  // Vérifier que tous les champs requis sont présents
  if (!firstname || !lastname || !email || !password) {
    return next(new ErrorResponse("Tous les champs sont obligatoires", 400));
  }

  try {
    // Créer l'utilisateur
    const user = await User.create({
      firstname,
      lastname,
      email,
      password,
      role: 'user'
    });

    // Générer le token JWT
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(new ErrorResponse(error.message, 400));
  }
});

// @desc    Obtenir le profil de l'utilisateur actuel
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    user: {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role
    }
  });
});
