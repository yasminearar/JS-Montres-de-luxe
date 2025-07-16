import "./assets/styles/styles.scss";
import "./main.scss";
import { apiService } from "./services/api.js";
import { authService } from "./services/auth.js";
import { cartService } from "./services/cart.js";
import { updateCartIndicator } from "./assets/javaScript/components/cartIndicator.js";

window.toggleUserMenu = function() {
  const dropdown = document.getElementById('user-dropdown');
  dropdown.classList.toggle('active');
};

function updateUserMenu() {
  const userMenu = document.getElementById('user-menu');
  const navUser = document.querySelector('.nav-user');
  
  if (authService.isLoggedIn()) {
    const currentUser = authService.getCurrentUser();

    if (userMenu) {
      userMenu.style.display = 'block';
    }
    if (navUser) {
      navUser.style.display = 'none';
    }

    const userNameElement = document.getElementById('user-name');
    const userAvatarElement = document.getElementById('user-avatar');
    
    if (userNameElement && currentUser) {
      userNameElement.textContent = currentUser.prenom || currentUser.nom || currentUser.firstname || currentUser.lastname || 'Utilisateur';
    }
    if (userAvatarElement && currentUser) {
      const name = currentUser.prenom || currentUser.nom || currentUser.firstname || currentUser.lastname || 'U';
      userAvatarElement.textContent = name.charAt(0).toUpperCase();
    }

    if (authService.isAdmin()) {
      document.body.classList.add('admin-user');
    } else {
      document.body.classList.remove('admin-user');
    }
  } else {
    if (userMenu) {
      userMenu.style.display = 'none';
    }
    if (navUser) {
      navUser.style.display = 'flex';
    }

    document.body.classList.remove('admin-user');
  }
}

// Fonction de déconnexion
window.logout = function() {
  authService.logout();
  updateUserMenu();
  window.location.href = '/';
};

document.addEventListener('click', function(event) {
  const userMenu = document.getElementById('user-menu');
  const dropdown = document.getElementById('user-dropdown');
  
  if (userMenu && !userMenu.contains(event.target)) {
    dropdown.classList.remove('active');
  }
});

const content = document.querySelector(".content");
let allProductCards = [];
let allProducts = [];

const showLoading = () => {
  content.innerHTML = `
    <div class="loading-container">
      <p>Chargement des produits...</p>
    </div>
  `;
};

const showError = (message) => {
  content.innerHTML = `
    <div class="error-container">
      <p>Erreur : ${message}</p>
      <button onclick="window.location.reload()">Réessayer</button>
    </div>
  `;
};

// Fonction utilitaire pour échapper les caractères HTML
const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text ? text.replace(/[&<>"']/g, (m) => map[m]) : '';
};

const initialDisplay = async () => {
  try {
    showLoading();

    allProducts = await apiService.getAllProducts();
    
    if (!allProducts || allProducts.length === 0) {
      content.innerHTML = `
        <div class="no-products-container">
          <p>Aucun produit disponible pour le moment.</p>
        </div>
      `;
      return;
    }

    content.innerHTML = '';
    
    const productsContainer = document.createElement("div");
    productsContainer.className = "products-container";

    // Déterminer le nombre de colonnes optimal pour la grille
    const containerWidth = content.offsetWidth;
    const cardWidth = 300;
    const gap = 40;
    const columnsCount = Math.floor(containerWidth / (cardWidth + gap));

    if (columnsCount > 1) {
      productsContainer.style.gridTemplateColumns = `repeat(${columnsCount}, minmax(260px, 1fr))`;
    }

    allProductCards = [];
    allProducts.forEach((produit, index) => {
      const card = createProductElement(produit, index);
      allProductCards.push({element: card, product: produit});
      productsContainer.appendChild(card);
    });

    content.appendChild(productsContainer);

    const noProducts = document.createElement("p");
    noProducts.className = "no-products product-hidden";
    noProducts.textContent = "Aucun produit ne correspond à votre recherche.";
    content.appendChild(noProducts);
    
  } catch (error) {
    console.error('Erreur lors du chargement des produits:', error);
    showError('Impossible de charger les produits. Vérifiez que le serveur backend est démarré.');
  }
};

// Filtrer les produits sans recréer les éléments
const displayProduits = (brand = 'all') => {
  const productsContainer = document.querySelector(".products-container");
  const noProductsMessage = document.querySelector(".no-products");
  
  let visibleCount = 0;
  
  // Première passe pour compter les éléments visibles
  allProductCards.forEach(({element, product}) => {
    if (brand === 'all' || product.marque === brand) {
      visibleCount++;
    }
  });
  
  // Déterminer le nombre de colonnes optimal pour la grille
  if (productsContainer) {
    const containerWidth = content.offsetWidth;
    const cardWidth = 300; // Largeur max d'une carte en px
    const gap = 40; // Estimation de l'espacement entre les cartes
    let columnsCount = Math.floor(containerWidth / (cardWidth + gap));
    
    // Si le nombre d'éléments visibles est inférieur au nombre de colonnes,
    // ajuster la disposition pour éviter l'étirement
    if (visibleCount > 0 && visibleCount < columnsCount) {
      columnsCount = visibleCount;
    }
    
    // Appliquer la mise en page de la grille
    if (columnsCount > 0) {
      productsContainer.style.gridTemplateColumns = `repeat(${columnsCount}, minmax(260px, 1fr))`;
    }
  }
  
  // Appliquer le filtrage
  allProductCards.forEach(({element, product}) => {
    if (brand === 'all' || product.marque === brand) {
      element.classList.remove("product-hidden");
    } else {
      element.classList.add("product-hidden");
    }
  });
  
  // Afficher le message si aucun produit ne correspond
  if (visibleCount === 0) {
    noProductsMessage.classList.remove("product-hidden");
  } else {
    noProductsMessage.classList.add("product-hidden");
  }
};

const createProductElement = (produit, index) => {
  const a = document.createElement("a");
  a.className = "product card overflow";
  a.href = `./product/product.html?id=${produit.id}`;

  const isAdmin = authService.isAdmin();

  a.innerHTML = `
    <div>
      <div class="overflow">
        <img src="${encodeURI(produit.image)}" alt="${produit.nom}" onerror="this.onerror=null; this.src='/assets/images/cartier.jpg';" />
      </div>
      <h3 class="brand">${produit.marque}</h3>
      <h2 class="title">${produit.nom}</h2>
      <h2 class="price">${produit.prix.toFixed(2)}$</h2>
      <button class="add-to-cart-btn" data-product-id="${produit.id}">
        <i class="fas fa-shopping-cart"></i> Ajouter au panier
      </button>
      ${isAdmin ? `
        <div class="admin-controls">
          <button class="btn-edit" data-product-id="${produit.id}" title="Éditer">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-delete" data-product-id="${produit.id}" title="Supprimer">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      ` : ''}
    </div>
  `;

  // Ajouter le gestionnaire pour le bouton "Ajouter au panier"
  const addToCartBtn = a.querySelector('.add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      addToCart(produit);
    });
  }
  
  if (isAdmin) {
    const editBtn = a.querySelector('.btn-edit');
    const deleteBtn = a.querySelector('.btn-delete');
    
    if (editBtn) {
      editBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        editProduct(produit.id);
      });
    }
    
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteProduct(produit.id);
      });
    }
  }
  
  return a;
};



// Gestionnaire d'événement pour le changement de filtre
const setupFilterListeners = () => {
  const brandFilter = document.getElementById('brand-filter');
  if (brandFilter) {
    brandFilter.addEventListener('change', (event) => {
      const selectedBrand = event.target.value;
      displayProduits(selectedBrand);
    });
  }
};

const initApp = async () => {
  authService.init();
  
  await initialDisplay();
  setupFilterListeners();
  updateUserMenu();
};

const validateEditForm = (product) => {
  const errors = [];
  
  // Validation du nom
  if (!product.nom || product.nom.length < 3) {
    errors.push('Le nom doit contenir au moins 3 caractères.');
  }
  
  // Validation de la marque
  if (!product.marque || product.marque.length < 2) {
    errors.push('La marque doit contenir au moins 2 caractères.');
  }
  
  // Validation du prix
  if (!product.prix || product.prix <= 0) {
    errors.push('Le prix doit être supérieur à zéro.');
  }
  
  if (product.prix > 1000000) {
    errors.push('Le prix est trop élevé.');
  }
  
  // Validation de l'image
  if (product.image && product.image.trim()) {
    const isValidUrl = /^https?:\/\/.+\.(jpe?g|png|gif|webp|svg)$/i.test(product.image);
    const isValidRelativePath = /^\.\.?\/.*\.(jpe?g|png|gif|webp|svg)$/i.test(product.image);
    const isValidAbsolutePath = /^\/.*\.(jpe?g|png|gif|webp|svg)$/i.test(product.image);
    
    if (!isValidUrl && !isValidRelativePath && !isValidAbsolutePath) {
      errors.push('Le chemin de l\'image semble invalide. Utilisez une URL complète ou un chemin relatif/absolu valide se terminant par .jpg, .jpeg, .png, .gif, .webp ou .svg');
    }
  }
  
  // Validation de la description
  if (product.description && product.description.trim() && product.description.length < 20) {
    errors.push('La description doit contenir au moins 20 caractères.');
  }
  
  return errors;
};

// Fonctions de validation pour le formulaire d'édition
const validateEditImage = (imagePath) => {
  if (!imagePath) {
    return true; // L'image n'est pas obligatoire pour l'édition
  }

  // Accepter les URLs complètes (http/https), les chemins relatifs avec points (./../) et les chemins absolus (/)
  const isValidUrl = /^https?:\/\/.+\.(jpe?g|png|gif|webp|svg)$/i.test(imagePath);
  const isValidRelativePath = /^\.\.?\/.*\.(jpe?g|png|gif|webp|svg)$/i.test(imagePath);
  const isValidAbsolutePath = /^\/[^\/].*\.(jpe?g|png|gif|webp|svg)$/i.test(imagePath);
  
  if (!isValidUrl && !isValidRelativePath && !isValidAbsolutePath) {
    return "Le chemin de l'image semble invalide. Utilisez une URL complète (https://...) ou un chemin relatif/absolu valide se terminant par .jpg, .jpeg, .png, .gif, .webp ou .svg";
  }
  
  return true;
};

// Fonctions d'administration des produits
const editProduct = async (productId) => {
  if (!authService.isAdmin()) {
    return;
  }
  
  try {
    // Récupérer les données du produit
    const product = await apiService.getProductById(productId);
    if (!product) {
      return;
    }
    
    // Afficher le formulaire modal d'édition
    showEditModal(product);
  } catch (error) {
    console.error('Erreur lors du chargement du produit:', error);
  }
};

const showEditModal = (product) => {
  const existingModal = document.querySelector('.edit-modal');
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement('div');
  modal.className = 'edit-modal';

  const modalContent = document.createElement('div');
  modalContent.className = 'modal-overlay';
  
  modalContent.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Éditer le produit</h2>
        <button class="close-modal" type="button">&times;</button>
      </div>
      <form class="edit-form">
        <div class="form-group">
          <label for="edit-nom">Nom *</label>
          <input type="text" id="edit-nom" name="nom" required>
        </div>
        
        <div class="form-group">
          <label for="edit-marque">Marque *</label>
          <input type="text" id="edit-marque" name="marque" required>
        </div>
        
        <div class="form-group">
          <label for="edit-prix">Prix *</label>
          <input type="number" id="edit-prix" name="prix" step="0.01" min="0" required>
        </div>
        
        <div class="form-group">
          <label for="edit-image">URL de l'image ou chemin relatif</label>
          <input type="text" id="edit-image" name="image" placeholder="https://example.com/image.jpg ou /assets/images/montre.png">
        </div>
        
        <div class="form-group">
          <label for="edit-description">Description</label>
          <textarea id="edit-description" name="description" rows="4" placeholder="Description du produit..."></textarea>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn-cancel">Annuler</button>
          <button type="submit" class="btn-save">Sauvegarder</button>
        </div>
      </form>
    </div>
  `;
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  setTimeout(() => {
    const nomField = modal.querySelector('#edit-nom');
    const marqueField = modal.querySelector('#edit-marque');
    const prixField = modal.querySelector('#edit-prix');
    const imageField = modal.querySelector('#edit-image');
    const descriptionField = modal.querySelector('#edit-description');
    
    if (nomField) nomField.value = product.nom || '';
    if (marqueField) marqueField.value = product.marque || '';
    if (prixField) prixField.value = product.prix || '';
    if (imageField) imageField.value = product.image || '';
    if (descriptionField) descriptionField.value = product.description || '';
  }, 50);
  
  // Gestionnaires d'événements
  const closeModal = () => {
    modal.remove();
  };

  modal.querySelector('.close-modal').addEventListener('click', closeModal);
  modal.querySelector('.btn-cancel').addEventListener('click', closeModal);
  modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
    if (e.target === modal.querySelector('.modal-overlay')) {
      closeModal();
    }
  });

  modal.querySelector('.edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const nomField = form.querySelector('#edit-nom');
    const marqueField = form.querySelector('#edit-marque');
    const prixField = form.querySelector('#edit-prix');
    const imageField = form.querySelector('#edit-image');
    const descriptionField = form.querySelector('#edit-description');

    if (!nomField || !marqueField || !prixField || !imageField || !descriptionField) {
      console.error('Erreur: Impossible de trouver tous les champs du formulaire');
      return;
    }
    
    const updatedProduct = {
      nom: nomField.value.trim(),
      marque: marqueField.value.trim(),
      prix: parseFloat(prixField.value),
      image: imageField.value.trim(),
      description: descriptionField.value.trim()
    };

    const validationErrors = validateEditForm(updatedProduct);
    if (validationErrors.length > 0) {
      console.error('Erreurs de validation:', validationErrors);
      return;
    }

    const imageValidation = validateEditImage(updatedProduct.image);
    if (imageValidation !== true) {
      console.error('Erreur de validation image:', imageValidation);
      return;
    }
    
    try {
      const submitBtn = modal.querySelector('.btn-save');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sauvegarde...';

      const response = await apiService.updateProduct(product.id, updatedProduct);
      
      if (response.success) {
        closeModal();
        await refreshProducts();
      } else {
        console.error('Erreur lors de la mise à jour:', response.error);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    } finally {
      const submitBtn = modal.querySelector('.btn-save');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sauvegarder';
      }
    }
  });
  modal.querySelector('#edit-nom').focus();
};

const refreshProducts = async () => {
  try {
    allProducts = await apiService.getAllProducts();

    const productsContainer = document.querySelector('.products-container');
    if (productsContainer) {
      productsContainer.innerHTML = '';
    }

    allProductCards = [];

    if (allProducts && allProducts.length > 0) {
      allProducts.forEach((produit, index) => {
        const productElement = createProductElement(produit, index);
        allProductCards.push({ element: productElement, product: produit });
        if (productsContainer) {
          productsContainer.appendChild(productElement);
        }
      });

      const brandFilter = document.getElementById('brand-filter');
      const currentBrand = brandFilter ? brandFilter.value : 'all';
      displayProduits(currentBrand);
    }
    
  } catch (error) {
    console.error('Erreur lors du rafraîchissement des produits:', error);
    window.location.reload();
  }
};

const deleteProduct = async (productId) => {
  if (!authService.isAdmin()) {
    return;
  }
  
  if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
    try {
      const response = await apiService.deleteProduct(productId);
      
      if (response.success) {
        await refreshProducts();
      } else {
        console.error('Erreur lors de la suppression:', response.error);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  }
};

const addToCart = (produit) => {
  cartService.addToCart(produit, 1);

  updateCartIndicator();

  showToast(`${produit.nom} ajouté au panier`);
};


const showToast = (message, type = 'success') => {
  let toast = document.querySelector('.toast-notification');
  
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.className = `toast-notification ${type}`;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
};

document.addEventListener('DOMContentLoaded', () => {
  updateCartIndicator();
});

initApp();
