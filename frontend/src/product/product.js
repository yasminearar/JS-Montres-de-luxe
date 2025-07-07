import "../assets/styles/styles.scss";
import "./product.scss";
import { apiService } from "../services/api.js";

const container = document.querySelector('.product-detail');

// Récupérer l'ID dans l'URL
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

// Afficher un message de chargement
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
          <a href="../index.html">← Retour aux produits</a>
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

