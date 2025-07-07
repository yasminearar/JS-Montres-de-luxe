import JSONArrayDatabase from "../JSONArrayDatabase.js";
const watchesDB = new JSONArrayDatabase("watches.json");

export default class Watch {
  /**
   * Crée une nouvelle montre avec validation
   */
  static async create(watchData) {
    // Validation des champs obligatoires
    const requiredFields = ['nom', 'marque', 'prix'];
    for (const field of requiredFields) {
      if (!watchData[field]) {
        throw new Error(`Le champ '${field}' est obligatoire`);
      }
    }

    // Validation du prix
    const prix = parseFloat(watchData.prix);
    if (isNaN(prix) || prix <= 0) {
      throw new Error("Le prix doit être un nombre positif");
    }

    // Préparation des données avec valeurs par défaut
    const watchToCreate = {
      nom: watchData.nom.trim(),
      marque: watchData.marque.trim().toUpperCase(),
      prix: prix,
      image: watchData.image || "/assets/images/default-watch.png",
      description: watchData.description || "",
      stock: parseInt(watchData.stock) || 0,
      estDisponible: (parseInt(watchData.stock) || 0) > 0,
      _type: "Watch"
    };

    return watchesDB.insert(watchToCreate);
  }

  /**
   * Trouve une montre par son ID
   */
  static async findById(id) {
    return watchesDB.findById(id);
  }

  /**
   * Trouve toutes les montres
   */
  static async findAll() {
    return watchesDB.findAll();
  }

  /**
   * Trouve les montres disponibles (en stock)
   */
  static async findAvailable() {
    const watches = await watchesDB.findAll();
    return watches.filter((w) => w.estDisponible && w.stock > 0);
  }

  /**
   * Met à jour une montre
   */
  static async update(id, updates) {
    const existing = await watchesDB.findById(id);
    if (!existing) {
      throw new Error("Montre non trouvée");
    }

    // Validation des updates si le prix est modifié
    if (updates.prix !== undefined) {
      const prix = parseFloat(updates.prix);
      if (isNaN(prix) || prix <= 0) {
        throw new Error("Le prix doit être un nombre positif");
      }
      updates.prix = prix;
    }

    // Mise à jour de la disponibilité si le stock change
    if (updates.stock !== undefined) {
      updates.stock = parseInt(updates.stock) || 0;
      updates.estDisponible = updates.stock > 0;
    }

    // Normalisation de la marque si modifiée
    if (updates.marque) {
      updates.marque = updates.marque.trim().toUpperCase();
    }

    const result = await watchesDB.update(id, updates);
    
    return result;
  }

  /**
   * Supprime une montre
   */
  static async delete(id) {
    const existing = await watchesDB.findById(id);
    if (!existing) {
      throw new Error("Montre non trouvée");
    }
    return watchesDB.delete(id);
  }

  /**
   * Met à jour le stock d'une montre
   */
  static async updateStock(id, quantityChange) {
    const watch = await watchesDB.findById(id);
    if (!watch) {
      throw new Error("Montre non trouvée");
    }

    const newStock = watch.stock + quantityChange;
    if (newStock < 0) {
      throw new Error("Stock ne peut pas être négatif");
    }

    return watchesDB.update(id, {
      stock: newStock,
      estDisponible: newStock > 0
    });
  }

  /**
   * Recherche des montres par nom ou marque
   */
  static async search(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
      return [];
    }
    
    return watchesDB.search(['nom', 'marque', 'description'], searchTerm);
  }

  /**
   * Trouve les montres par marque
   */
  static async findByBrand(marque) {
    const watches = await watchesDB.findAll();
    const brandUpper = marque.toUpperCase();
    return watches.filter(w => w.marque === brandUpper);
  }

  /**
   * Obtient toutes les marques disponibles
   */
  static async getAllBrands() {
    const watches = await watchesDB.findAll();
    const brands = [...new Set(watches.map(w => w.marque))];
    return brands.sort();
  }

  /**
   * Statistiques des montres
   */
  static async getStats() {
    const watches = await watchesDB.findAll();
    const available = watches.filter(w => w.estDisponible);
    
    return {
      total: watches.length,
      available: available.length,
      outOfStock: watches.length - available.length,
      totalStock: watches.reduce((sum, w) => sum + w.stock, 0),
      averagePrice: watches.reduce((sum, w) => sum + w.prix, 0) / watches.length,
      brands: await this.getAllBrands()
    };
  }
}
