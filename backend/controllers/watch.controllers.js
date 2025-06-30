import Watch from "../database/models/Watch.js";

export const creerMontre = async (req, res) => {
  try {
    const watch = await Watch.create(req.body);
    res.status(201).json({
      success: true,
      message: "Montre créée avec succès",
      data: watch
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const listerToutesLesMontres = async (req, res) => {
  try {
    const watches = await Watch.findAll();
    res.json({
      success: true,
      count: watches.length,
      data: watches
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const montresDisponibles = async (req, res) => {
  try {
    const watches = await Watch.findAvailable();
    res.json({
      success: true,
      count: watches.length,
      data: watches
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const obtenirUneMontre = async (req, res) => {
  try {
    const watch = await Watch.findById(req.params.id);
    if (!watch) {
      return res.status(404).json({ 
        success: false,
        error: "Montre non trouvée" 
      });
    }
    res.json({
      success: true,
      data: watch
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const mettreAJourUneMontre = async (req, res) => {
  try {
    const watch = await Watch.update(req.params.id, req.body);
    if (!watch) {
      return res.status(404).json({ 
        success: false,
        error: "Montre non trouvée" 
      });
    }
    res.json({
      success: true,
      message: "Montre mise à jour avec succès",
      data: watch
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const mettreAJourLeStock = async (req, res) => {
  try {
    const { action, quantity } = req.body;
    
    // Validation des paramètres
    if (!action || !['increment', 'decrement'].includes(action)) {
      return res.status(400).json({ 
        success: false,
        error: "Action doit être 'increment' ou 'decrement'" 
      });
    }

    let qty = parseInt(quantity) || 0;
    if (qty <= 0) {
      return res.status(400).json({ 
        success: false,
        error: "La quantité doit être un nombre positif" 
      });
    }

    if (action === "decrement") qty = -qty;

    const watch = await Watch.updateStock(req.params.id, qty);
    res.json({
      success: true,
      message: `Stock ${action === 'increment' ? 'augmenté' : 'diminué'} avec succès`,
      data: watch
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const supprimerUneMontre = async (req, res) => {
  try {
    const deleted = await Watch.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ 
        success: false,
        error: "Montre non trouvée" 
      });
    }
    res.json({ 
      success: true,
      message: "Montre supprimée avec succès",
      data: deleted
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const rechercherMontres = async (req, res) => {
  try {
    const { query } = req.params;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ 
        success: false,
        error: "Terme de recherche requis" 
      });
    }

    const watches = await Watch.search(query);
    res.json({
      success: true,
      query: query,
      count: watches.length,
      data: watches
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const obtenirMarques = async (req, res) => {
  try {
    const brands = await Watch.getAllBrands();
    res.json({
      success: true,
      count: brands.length,
      data: brands
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const montresParMarque = async (req, res) => {
  try {
    const { marque } = req.params;
    const watches = await Watch.findByBrand(marque);
    res.json({
      success: true,
      marque: marque.toUpperCase(),
      count: watches.length,
      data: watches
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const statistiquesMontres = async (req, res) => {
  try {
    const stats = await Watch.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};
