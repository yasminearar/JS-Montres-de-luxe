import "../assets/styles/styles.scss";
import "./checkout.scss";
import { cartService } from "../services/cart.js";
import { updateCartIndicator } from "../assets/javaScript/components/cartIndicator.js";
import { authService } from "../services/auth.js";
import { orderService } from "../services/order.js";

// Vérifier si l'utilisateur est un administrateur
document.addEventListener('DOMContentLoaded', () => {
  const currentUser = authService.getCurrentUser();

  if (currentUser && currentUser.role === 'admin') {
    alert("Les administrateurs ne peuvent pas passer de commande. Vous allez être redirigé vers la page d'administration des commandes.");
    window.location.href = '../admin/admin-orders.html';
    return;
  }
});

// Sélectionner les éléments du DOM
const summaryContent = document.querySelector('.summary-content');
const summaryTotals = document.querySelector('.summary-totals');
const cartCount = document.querySelector('.cart-count');
const shippingForm = document.getElementById('shipping-form');
const standardPriceEl = document.getElementById('standard-price');
const confirmationModal = document.querySelector('.order-confirmation-modal');
const customerEmailEl = document.querySelector('.customer-email');
const orderNumberEl = document.querySelector('.order-number');
const closeModalBtn = document.querySelector('.close-modal');
const guestCheckoutInfo = document.querySelector('.guest-checkout-info');

/**
 * Affiche le résumé des articles du panier
 */
const displayCartSummary = () => {
  const cart = cartService.getCart();
  
  // Mettre à jour le compteur de panier dans le header
  updateCartIndicator();
  
  // Rediriger vers la page du panier si le panier est vide
  if (cart.length === 0) {
    window.location.href = '../cart/cart.html';
    return;
  }
  
  // Afficher les articles du panier en résumé
  let cartItemsHTML = '';
  
  cart.forEach(item => {
    cartItemsHTML += `
      <div class="summary-item">
        <div class="item-info">
          <img src="${item.image}" alt="${item.nom}" class="item-image" />
          <div class="item-details">
            <h3>${item.nom}</h3>
            <p class="item-brand">${item.marque}</p>
            <p class="item-quantity">Quantité: ${item.quantity}</p>
          </div>
        </div>
        <div class="item-price">${(item.prix * item.quantity).toFixed(2)} $</div>
      </div>
    `;
  });
  
  summaryContent.innerHTML = cartItemsHTML;

  updateTotals();
};

/**
 * Met à jour les totaux en fonction du panier et du mode de livraison choisi
 */
const updateTotals = () => {
  const cart = cartService.getCart();
  const subtotal = cartService.getTotal();
  
  // Déterminer les frais de livraison
  let shippingCost = 0;
  
  if (subtotal < 100) {
    shippingCost = 10; // Frais standard
    standardPriceEl.textContent = '10.00 $';
  } else {
    standardPriceEl.textContent = 'Gratuit';
  }
  
  // Ajouter des frais supplémentaires si la livraison express est sélectionnée
  const shippingMethodInputs = document.querySelectorAll('input[name="shippingMethod"]');
  const selectedMethod = Array.from(shippingMethodInputs).find(input => input.checked)?.value;
  
  let expressCharge = 0;
  if (selectedMethod === 'express') {
    expressCharge = 15;
  }
  
  const total = subtotal + shippingCost + expressCharge;
  
  // Afficher les totaux
  summaryTotals.innerHTML = `
    <div class="total-row">
      <span>Sous-total</span>
      <span>${subtotal.toFixed(2)} $</span>
    </div>
    <div class="total-row">
      <span>Frais de livraison</span>
      <span>${shippingCost > 0 ? `${shippingCost.toFixed(2)} $` : 'Gratuit'}</span>
    </div>
    ${expressCharge > 0 ? `
      <div class="total-row">
        <span>Supplément Express</span>
        <span>${expressCharge.toFixed(2)} $</span>
      </div>
    ` : ''}
    <div class="total-row grand-total">
      <span>Total</span>
      <span>${total.toFixed(2)} $</span>
    </div>
  `;
};

/**
 * Traite la soumission du formulaire de commande
 * @param {Event} event - L'événement de soumission
 */
const handleOrderSubmit = async (event) => {
  event.preventDefault();
  
  // Récupérer les données du formulaire
  const formData = new FormData(shippingForm);
  const orderData = {
    customer: {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      city: formData.get('city'),
      postalCode: formData.get('postalCode'),
      country: formData.get('country'),
    },
    shipping: {
      method: formData.get('shippingMethod')
    },
    items: cartService.getCart(),
    totals: {
      subtotal: cartService.getTotal(),
      shipping: formData.get('shippingMethod') === 'express' ? 15 : (cartService.getTotal() >= 100 ? 0 : 10),
      total: calculateTotal()
    },
    orderDate: new Date().toISOString(),
    userStatus: authService.isLoggedIn() ? 'registered' : 'guest',
    userId: authService.isLoggedIn() ? authService.getCurrentUser().id : null
  };
  
  try {
    // Sauvegarder la commande sur le serveur ou localement
    let savedOrder;
    
    if (authService.isLoggedIn()) {
      // Si l'utilisateur est connecté, envoyer la commande au serveur
      savedOrder = await orderService.createOrder(orderData);
    } else {
      // Sinon, sauvegarder localement
      savedOrder = orderService.saveLocalOrder(orderData);
    }
    
    // Afficher la modale de confirmation
    customerEmailEl.textContent = orderData.customer.email;
    orderNumberEl.textContent = savedOrder.orderNumber || generateOrderNumber();
    confirmationModal.classList.add('active');
    
    // Vider le panier
    cartService.clearCart();
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la commande:", error);
    alert("Une erreur s'est produite lors de la finalisation de votre commande. Veuillez réessayer.");
  }
};

/**
 * Calcule le total final de la commande
 * @returns {number} Le montant total
 */
const calculateTotal = () => {
  const subtotal = cartService.getTotal();
  let shipping = subtotal >= 100 ? 0 : 10;
  
  const shippingMethodInputs = document.querySelectorAll('input[name="shippingMethod"]');
  const selectedMethod = Array.from(shippingMethodInputs).find(input => input.checked)?.value;
  
  if (selectedMethod === 'express') {
    shipping += 15;
  }
  
  return subtotal + shipping;
};

/**
 * Génère un numéro de commande aléatoire
 * @returns {string} Le numéro de commande
 */
const generateOrderNumber = () => {
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ML-${timestamp}${random}`;
};

/**
 * Vérifie si l'utilisateur est connecté et pré-remplit le formulaire le cas échéant
 */
const checkUserLoginStatus = () => {
  if (authService.isLoggedIn()) {
    // L'utilisateur est connecté
    const currentUser = authService.getCurrentUser();
    
    // Masquer le message pour les utilisateurs non connectés
    if (guestCheckoutInfo) {
      guestCheckoutInfo.style.display = 'none';
    }
    
    // Pré-remplir les champs du formulaire si des informations sont disponibles
    if (currentUser) {
      const fullNameInput = document.getElementById('fullName');
      const emailInput = document.getElementById('email');
      
      if (fullNameInput) {
        const fullName = [
          currentUser.prenom || currentUser.firstname || '',
          currentUser.nom || currentUser.lastname || ''
        ].filter(Boolean).join(' ');
        
        if (fullName.trim()) {
          fullNameInput.value = fullName;
        }
      }
      
      if (emailInput && currentUser.email) {
        emailInput.value = currentUser.email;
      }
    }
  }
};

// Initialiser l'affichage du résumé du panier
document.addEventListener('DOMContentLoaded', () => {
  displayCartSummary();
  checkUserLoginStatus();
  
  // Ajouter des écouteurs d'événements
  shippingForm.addEventListener('submit', handleOrderSubmit);
  
  // Mettre à jour les totaux lorsque le mode de livraison change
  const shippingMethodInputs = document.querySelectorAll('input[name="shippingMethod"]');
  shippingMethodInputs.forEach(input => {
    input.addEventListener('change', updateTotals);
  });
  
  // Fermer la modale
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      confirmationModal.classList.remove('active');
    });
  }
  
  // Fermer la modale en cliquant en dehors
  window.addEventListener('click', (event) => {
    if (event.target === confirmationModal) {
      confirmationModal.classList.remove('active');
    }
  });
});

// Écouter les mises à jour du panier
window.addEventListener('cart-updated', () => {
  displayCartSummary();
});
