import "../assets/styles/styles.scss";
import "./product.scss";
import { produits } from "../../data/products.js";

const container = document.querySelector('.product-detail');

// Récupérer l’ID dans l’URL
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

// Trouver le produit correspondant
const produit = produits.find((p) => p.id == id);

if (!produit) {
  container.innerHTML = `<p>Produit introuvable.</p>`;
} else {
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
}

