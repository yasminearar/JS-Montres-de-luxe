/**
 * Service pour gérer le panier d'achats
 */
import { apiService } from './api.js';

class CartService {
  constructor() {
    this.cartKeyBase = 'luxe_watches_cart';
    this.cart = this.getCart();
  }

  /**
   * Obtient la clé de stockage pour le panier en fonction de l'utilisateur connecté
   * @returns {String} La clé de stockage
   */
  getCartKey() {
    // Si l'utilisateur est connecté, utiliser son ID pour isoler son panier
    const currentUser = apiService.getCurrentUser();
    if (currentUser && currentUser.id) {
      return `${this.cartKeyBase}_${currentUser.id}`;
    }
    // Sinon utiliser la clé par défaut (utilisateur non connecté)
    return this.cartKeyBase;
  }

  /**
   * Récupère le panier depuis le localStorage
   * @returns {Array} Le panier d'achats
   */
  getCart() {
    const cartData = localStorage.getItem(this.getCartKey());
    return cartData ? JSON.parse(cartData) : [];
  }

  /**
   * Sauvegarde le panier dans le localStorage
   */
  saveCart() {
    localStorage.setItem(this.getCartKey(), JSON.stringify(this.cart));
    // Déclencher un événement pour indiquer que le panier a été mis à jour
    window.dispatchEvent(new CustomEvent('cart-updated'));
  }

  /**
   * Ajoute un produit au panier
   * @param {Object} product - Le produit à ajouter
   * @param {Number} quantity - La quantité à ajouter (défaut: 1)
   */
  addToCart(product, quantity = 1) {
    const existingItem = this.cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({
        id: product.id,
        nom: product.nom,
        marque: product.marque,
        prix: product.prix,
        image: product.image,
        quantity: quantity
      });
    }
    
    this.saveCart();
    return this.cart;
  }

  /**
   * Retire un produit du panier
   * @param {String} productId - L'ID du produit à retirer
   */
  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
    return this.cart;
  }

  /**
   * Met à jour la quantité d'un produit dans le panier
   * @param {String} productId - L'ID du produit à mettre à jour
   * @param {Number} quantity - La nouvelle quantité
   */
  updateQuantity(productId, quantity) {
    const item = this.cart.find(item => item.id === productId);
    
    if (item) {
      if (quantity <= 0) {
        return this.removeFromCart(productId);
      }
      
      item.quantity = quantity;
      this.saveCart();
    }
    
    return this.cart;
  }

  /**
   * Vide complètement le panier
   */
  clearCart() {
    this.cart = [];
    this.saveCart();
    return this.cart;
  }

  /**
   * Calcule le total du panier
   * @returns {Number} Le montant total
   */
  getTotal() {
    return this.cart.reduce((total, item) => {
      return total + (item.prix * item.quantity);
    }, 0);
  }

  /**
   * Récupère le nombre total d'articles dans le panier
   * @returns {Number} Le nombre d'articles
   */
  getTotalItems() {
    return this.cart.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  }
  
  /**
   * Gère la synchronisation du panier lors de la connexion d'un utilisateur
   * Fusionne le panier anonyme avec le panier de l'utilisateur connecté si nécessaire
   * @param {String} userId - L'identifiant de l'utilisateur qui vient de se connecter
   */
  handleUserLogin(userId) {
    if (!userId) return;
    
    // Récupérer le panier anonyme actuel
    const anonymousCartKey = this.cartKeyBase;
    const anonymousCart = JSON.parse(localStorage.getItem(anonymousCartKey) || '[]');
    
    // Si le panier anonyme n'est pas vide
    if (anonymousCart.length > 0) {
      // Récupérer le panier utilisateur existant (s'il existe)
      const userCartKey = `${this.cartKeyBase}_${userId}`;
      const userCart = JSON.parse(localStorage.getItem(userCartKey) || '[]');
      
      // Fusionner les paniers (ajouter les éléments du panier anonyme)
      anonymousCart.forEach(anonymousItem => {
        const existingItem = userCart.find(item => item.id === anonymousItem.id);
        
        if (existingItem) {
          // L'article existe déjà, incrémenter la quantité
          existingItem.quantity += anonymousItem.quantity;
        } else {
          // Nouvel article, l'ajouter au panier
          userCart.push(anonymousItem);
        }
      });
      
      // Enregistrer le panier fusionné
      localStorage.setItem(userCartKey, JSON.stringify(userCart));
      
      // Vider le panier anonyme
      localStorage.removeItem(anonymousCartKey);
      
      // Mettre à jour le panier en mémoire
      this.cart = userCart;
      
      // Déclencher l'événement de mise à jour du panier
      window.dispatchEvent(new CustomEvent('cart-updated'));
    }
  }
}

export const cartService = new CartService();

// Exporter la classe pour pouvoir l'étendre
export { CartService };
