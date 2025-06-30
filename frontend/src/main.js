import "./assets/styles/styles.scss";
import "./main.scss";
import { produits } from "../data/products.js";


const content = document.querySelector(".content");
let allProductCards = [];

// Création initiale de tous les produits
const initialDisplay = () => {
  const productsContainer = document.createElement("div");
  productsContainer.className = "products-container";
  
  // Déterminer le nombre de colonnes optimal pour la grille
  const containerWidth = content.offsetWidth;
  const cardWidth = 300; // Largeur max d'une carte en px
  const gap = 40; // Estimation de l'espacement entre les cartes
  const columnsCount = Math.floor(containerWidth / (cardWidth + gap));
  
  // Ajouter un style pour préserver la mise en page de la grille
  if (columnsCount > 1) {
    productsContainer.style.gridTemplateColumns = `repeat(${columnsCount}, minmax(260px, 1fr))`;
  }

  produits.forEach((produit, index) => {
    const card = createProductElement(produit, index);
    allProductCards.push({element: card, product: produit});
    productsContainer.appendChild(card);
  });

  content.appendChild(productsContainer);
  
  // Créons aussi un élément pour le message "aucun produit"
  const noProducts = document.createElement("p");
  noProducts.className = "no-products product-hidden"; // Utiliser la même classe pour la cohérence
  noProducts.textContent = "Aucun produit ne correspond à votre recherche.";
  content.appendChild(noProducts);
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
  
  // Créer le contenu HTML
  a.innerHTML = `
    <div>
      <div class="overflow">
        <img src="${encodeURI(produit.image)}" alt="${produit.nom}" onerror="this.onerror=null; this.src='/assets/images/cartier.jpg';" />
      </div>
      <h3 class="brand">${produit.marque}</h3>
      <h2 class="title">${produit.nom}</h2>
      <h2 class="price">${produit.prix.toFixed(2)}$</h2>
    </div>
  `;
  
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

// Démarrage
initialDisplay(); // Affiche tous les produits au départ
setupFilterListeners();
