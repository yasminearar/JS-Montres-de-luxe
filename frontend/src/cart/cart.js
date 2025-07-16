import "../assets/styles/styles.scss";
import "./cart.scss";
import { cartService } from "../services/cart.js";
import { apiService } from "../services/api.js";

// Sélectionner les éléments du DOM
const cartContainer = document.getElementById('cart-container');
const cartSummary = document.querySelector('.cart-summary');
const cartCount = document.querySelector('.cart-count');

// Importer la fonction de mise à jour de l'indicateur du panier
import { updateCartIndicator } from "../assets/javaScript/components/cartIndicator.js";

/**
 * Affiche le contenu du panier
 */
const displayCart = () => {
  const cart = cartService.getCart();
  
  // Mettre à jour le compteur de panier dans le header
  updateCartIndicator();
  
  // Afficher un message si le panier est vide
  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart cart-icon"></i>
        <h2>Votre panier est vide</h2>
        <p>Découvrez notre sélection de montres de luxe et ajoutez vos favoris à votre panier.</p>
        <a href="../index.html" class="btn-shop-now">
          <i class="fas fa-store"></i> Découvrir nos produits
        </a>
      </div>
    `;
    
    cartSummary.innerHTML = '';
    return;
  }
  
  // Afficher les articles du panier
  let cartItems = `
    <div class="cart-headers">
      <span>Produit</span>
      <span>Prix unitaire</span>
      <span>Quantité</span>
      <span>Total</span>
      <span>Actions</span>
    </div>
  `;
  
  cart.forEach(item => {
    cartItems += `
      <div class="cart-item" data-id="${item.id}">
        <div class="item-info">
          <img src="${item.image}" alt="${item.nom}" class="item-image" />
          <div class="item-details">
            <h3>${item.nom}</h3>
            <p class="item-brand">${item.marque}</p>
          </div>
        </div>
        <div class="item-price">${item.prix} $</div>
        <div class="item-quantity">
          <button class="quantity-btn minus-btn" data-id="${item.id}">-</button>
          <input type="number" value="${item.quantity}" min="1" max="10" data-id="${item.id}" class="quantity-input" />
          <button class="quantity-btn plus-btn" data-id="${item.id}">+</button>
        </div>
        <div class="item-total">${(item.prix * item.quantity).toFixed(2)} $</div>
        <div class="item-actions">
          <button class="remove-item" data-id="${item.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  });
  
  cartContainer.innerHTML = cartItems;
  
  // Afficher le résumé du panier
  const total = cartService.getTotal();
  const shipping = total >= 100 ? 0 : 10; // Frais de livraison gratuits à partir de 100$
  const grandTotal = total + shipping;
  
  cartSummary.innerHTML = `
    <h2>Résumé de la commande</h2>
    <div class="summary-item">
      <span>Sous-total</span>
      <span>${total.toFixed(2)} $</span>
    </div>
    <div class="summary-item">
      <span>Frais de livraison</span>
      <span>${shipping > 0 ? `${shipping.toFixed(2)} $` : 'Gratuit'}</span>
    </div>
    <div class="summary-item total">
      <span>Total</span>
      <span>${grandTotal.toFixed(2)} $</span>
    </div>
    <div class="shipping-info">
      ${shipping > 0 ? `<p>Livraison gratuite à partir de 100 $</p>` : '<p>Vous bénéficiez de la livraison gratuite</p>'}
    </div>
    <a href="../checkout/checkout.html" class="btn-checkout">
      <i class="fas fa-credit-card"></i> Procéder au paiement
    </a>
    <button class="btn-clear-cart">
      <i class="fas fa-trash"></i> Vider le panier
    </button>
  `;
  
  // Ajouter les écouteurs d'événements
  setupEventListeners();
};

/**
 * Configure les écouteurs d'événements pour les interactions avec le panier
 */
const setupEventListeners = () => {
  // Gestion des boutons "moins"
  const minusBtns = document.querySelectorAll('.minus-btn');
  minusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const input = document.querySelector(`.quantity-input[data-id="${id}"]`);
      const currentVal = parseInt(input.value);
      
      if (currentVal > 1) {
        input.value = currentVal - 1;
        cartService.updateQuantity(id, currentVal - 1);
        displayCart();
      }
    });
  });
  
  // Gestion des boutons "plus"
  const plusBtns = document.querySelectorAll('.plus-btn');
  plusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const input = document.querySelector(`.quantity-input[data-id="${id}"]`);
      const currentVal = parseInt(input.value);
      
      if (currentVal < 10) {
        input.value = currentVal + 1;
        cartService.updateQuantity(id, currentVal + 1);
        displayCart();
      }
    });
  });
  
  // Gestion des changements de quantité via l'input
  const quantityInputs = document.querySelectorAll('.quantity-input');
  quantityInputs.forEach(input => {
    input.addEventListener('change', () => {
      const id = input.getAttribute('data-id');
      const newValue = parseInt(input.value);
      
      if (newValue >= 1 && newValue <= 10) {
        cartService.updateQuantity(id, newValue);
        displayCart();
      } else if (newValue < 1) {
        input.value = 1;
        cartService.updateQuantity(id, 1);
        displayCart();
      } else {
        input.value = 10;
        cartService.updateQuantity(id, 10);
        displayCart();
      }
    });
  });
  
  // Gestion des boutons de suppression d'articles
  const removeButtons = document.querySelectorAll('.remove-item');
  removeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      cartService.removeFromCart(id);
      displayCart();
    });
  });
  
  // Gestion du bouton "Vider le panier"
  const clearCartBtn = document.querySelector('.btn-clear-cart');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
        cartService.clearCart();
        displayCart();
      }
    });
  }
};

// Initialiser l'affichage du panier au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  displayCart();
  
  // Mettre à jour l'affichage du menu selon le rôle de l'utilisateur
  if (window.updateMenuDisplay) {
    window.updateMenuDisplay();
  }
});

// Écouter les mises à jour du panier (si modifié depuis une autre page)
window.addEventListener('cart-updated', () => {
  displayCart();
});
