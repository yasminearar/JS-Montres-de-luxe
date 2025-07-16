// cartIndicator.js
import { cartService } from "../../../services/cart.js";

/**
 * Met à jour l'indicateur du nombre d'articles dans le panier
 */
export function updateCartIndicator() {
  const cartCountElements = document.querySelectorAll('.cart-count');
  const cartCountDropdown = document.querySelector('.cart-count-dropdown');
  const totalItems = cartService.getTotalItems();
  
  // Mettre à jour tous les compteurs du panier dans la nav principale
  cartCountElements.forEach(cartCount => {
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
  });
  
  // Mettre à jour le compteur dans le dropdown utilisateur
  if (cartCountDropdown) {
    cartCountDropdown.textContent = totalItems;
    cartCountDropdown.style.display = totalItems > 0 ? 'inline-flex' : 'none';
  }
}

// Initialiser l'indicateur du panier au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  updateCartIndicator();
});

// Mettre à jour l'indicateur lorsque le panier est modifié
window.addEventListener('cart-updated', () => {
  updateCartIndicator();
});
