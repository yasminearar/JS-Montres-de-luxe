import User from "../database/models/User.js";

const verifyPassword = (inputPassword, userPassword) => {
  return inputPassword === userPassword;
};

export const afficherTousLesutilisateurs = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const creeUnNouvelUtilisateur = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      data: newUser
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const supprimerUnUtilisateur = async (req, res) => {
  try {
    const deleted = await User.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ 
        success: false,
        error: "Utilisateur non trouvé" 
      });
    }
    res.status(204).json({
      success: true,
      message: "Suppression réussie !",
      data: deleted
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const obtenirUnUtilisateur = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: "Utilisateur non trouvé !" 
      });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const mettreAJourUnUtilisateur = async (req, res) => {
  try {
    const user = await User.update(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: "Utilisateur non trouvé !" 
      });
    }
    res.json({
      success: true,
      message: "Utilisateur mis à jour avec succès",
      data: user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const obtenirAdmins = async (req, res) => {
  try {
    const admins = await User.findAdmins();
    res.json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const promouvoirAdmin = async (req, res) => {
  try {
    const user = await User.update(req.params.id, { role: 'admin' });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: "Utilisateur non trouvé !" 
      });
    }
    res.json({
      success: true,
      message: "Utilisateur promu administrateur avec succès",
      data: user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const connecterUtilisateur = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email et mot de passe requis"
      });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Email ou mot de passe incorrect"
      });
    }

    if (!verifyPassword(password, user.password)) {
      return res.status(401).json({
        success: false,
        error: "Email ou mot de passe incorrect"
      });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      message: "Connexion réussie",
      data: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
