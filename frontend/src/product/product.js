import "../assets/styles/styles.scss";
import "./product.scss";
import { apiService } from "../services/api.js";
import { cartService } from "../services/cart.js";

const container = document.querySelector('.product-detail');

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

const showLoading = () => {
  container.innerHTML = `<div class="loading-container"><p>Chargement du produit...</p></div>`;
};

// Afficher un message d'erreur
const showError = (message) => {
  container.innerHTML = `
    <div class="error-container">
      <p>Erreur : ${message}</p>
      <a href="../index.html">← Retour aux produits</a>
    </div>
  `;
};

// Charger et afficher le produit
const loadProduct = async () => {
  if (!id) {
    container.innerHTML = `
      <div class="error-container">
        <p>ID du produit manquant dans l'URL.</p>
        <a href="../index.html">← Retour aux produits</a>
      </div>
    `;
    return;
  }

  try {
    showLoading();

    // Récupérer le produit depuis l'API
    const produit = await apiService.getProductById(id);
    
    if (!produit) {
      container.innerHTML = `
        <div class="error-container">
          <p>Produit introuvable.</p>
          <a href="../index.html">← Retour aux produits</a>
        </div>
      `;
      return;
    }
    
    // Afficher le produit
    container.innerHTML = `
      <div class="product-card-detail">
        <img src="${produit.image}" alt="${produit.nom}" class="product-image" />
        <div class="product-info">
          <h1>${produit.nom}</h1>
          <p><strong>Marque :</strong> ${produit.marque}</p>
          <p><strong>Prix :</strong> ${produit.prix} $</p>
          <p><strong>Description :</strong> ${produit.description || "Aucune description."}</p>
          <div class="product-actions">
            <div class="quantity-selector">
              <button class="quantity-btn minus-btn">-</button>
              <input type="number" id="quantity" value="1" min="1" max="10">
              <button class="quantity-btn plus-btn">+</button>
            </div>
            <button class="add-to-cart-btn">
              <i class="fas fa-shopping-cart"></i> Ajouter au panier
            </button>
          </div>
          <div class="cart-message"></div>
          <a href="../index.html" class="back-link">← Retour aux produits</a>
        </div>
      </div>
    `;
    
  } catch (error) {
    console.error('Erreur lors du chargement du produit:', error);
    showError('Impossible de charger le produit. Vérifiez que le serveur backend est démarré.');
  }
};

// Initialiser le chargement du produit
loadProduct();

// Ajouter des gestionnaires d'événements après le chargement du produit
const setupEventListeners = () => {
  // Sélectionner les éléments pertinents
  const quantityInput = document.getElementById('quantity');
  const minusBtn = document.querySelector('.minus-btn');
  const plusBtn = document.querySelector('.plus-btn');
  const addToCartBtn = document.querySelector('.add-to-cart-btn');
  const cartMessage = document.querySelector('.cart-message');
  
  // Gérer le bouton moins
  if (minusBtn) {
    minusBtn.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });
  }
  
  // Gérer le bouton plus
  if (plusBtn) {
    plusBtn.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value);
      if (currentValue < 10) {
        quantityInput.value = currentValue + 1;
      }
    });
  }
  
  // Gérer l'ajout au panier
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', async () => {
      try {
        const quantity = parseInt(quantityInput.value);
        
        // Récupérer à nouveau le produit pour s'assurer d'avoir les données les plus récentes
        const produit = await apiService.getProductById(id);
        
        // Ajouter au panier
        cartService.addToCart(produit, quantity);
        
        // Afficher un message de confirmation
        cartMessage.innerHTML = `
          <div class="success-message">
            <i class="fas fa-check-circle"></i>
            ${quantity} ${produit.nom} ajouté${quantity > 1 ? 's' : ''} au panier
            <a href="../cart/cart.html">Voir le panier</a>
          </div>
        `;
        
        // Mettre à jour l'indicateur du panier dans le header
        updateCartIndicator();
        
        // Effacer le message après quelques secondes
        setTimeout(() => {
          cartMessage.innerHTML = '';
        }, 5000);
      } catch (error) {
        console.error("Erreur lors de l'ajout au panier:", error);
        cartMessage.innerHTML = `
          <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            Erreur lors de l'ajout au panier
          </div>
        `;
      }
    });
  }
};

// Importer la fonction de mise à jour de l'indicateur du panier
import { updateCartIndicator } from "../assets/javaScript/components/cartIndicator.js";

// Observer les changements dans le contenu pour configurer les écouteurs d'événements
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      setupEventListeners();
    }
  });
});

observer.observe(container, { childList: true });



