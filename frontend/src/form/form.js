import "../assets/styles/styles.scss";
import "./form.scss";

const form = document.querySelector("#add-product-form");
const errorElement = document.querySelector("#errors");
let errors = [];

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const produit = Object.fromEntries(formData.entries());

  if (formIsValid(produit)) {
    const json = JSON.stringify(produit);
    console.log("Produit prêt à être envoyé :", json);

    alert("Produit sauvegardé avec succès !");
    form.reset();
  }
});

function validatePrice(priceString) {
  if (!priceString) {
    return "Le prix est obligatoire !";
  }

  if (!/^\d*\.?\d+$/.test(priceString)) {
    return "Le format du prix est invalide !";
  }

  const price = parseFloat(priceString);

  if (price <= 0) {
    return "Le prix doit être supérieur à 0";
  }

  if (price > 1000000) {
    return "Le prix est trop haut !";
  }

  // Check decimal places
  if (priceString.split(".")[1]?.length > 2) {
    return "Mettez deux décimales après le point svp!";
  }

  return true;
}

function validateName(name) {
  if (!name) {
    return "Le nom est obligatoire !";
  }
  
  if (name.length < 3) {
    return "Le nom doit contenir au moins 3 caractères";
  }
  
  return true;
}

function validateBrand(brand) {
  if (!brand) {
    return "La marque est obligatoire !";
  }
  
  if (brand.length < 2) {
    return "La marque doit contenir au moins 2 caractères";
  }
  
  return true;
}

function validateImage(imagePath) {
  if (!imagePath) {
    return "L'image est obligatoire !";
  }

  if (!imagePath.match(/^(https?:\/\/|\.\.?\/|\/).+\.(jpe?g|png|gif|webp|svg)$/i)) {
    return "Le chemin de l'image semble invalide. Utilisez une URL ou un chemin relatif valide.";
  }
  
  return true;
}

function validateDescription(description) {
  if (!description) {
    return "La description est obligatoire !";
  }
  
  if (description.length < 20) {
    return "La description est trop courte (20 caractères min).";
  }
  
  return true;
}

function formIsValid(produit) {
  errors = [];
  
  // Validation du nom
  const nomValidation = validateName(produit.nom);
  if (nomValidation !== true) {
    errors.push(nomValidation);
  }
  
  // Validation de la marque
  const marqueValidation = validateBrand(produit.marque);
  if (marqueValidation !== true) {
    errors.push(marqueValidation);
  }
  
  // Validation du prix
  const prixValidation = validatePrice(produit.prix);
  if (prixValidation !== true) {
    errors.push(prixValidation);
  }
  
  // Validation de l'image
  const imageValidation = validateImage(produit.image);
  if (imageValidation !== true) {
    errors.push(imageValidation);
  }
  
  // Validation de la description
  const descriptionValidation = validateDescription(produit.description);
  if (descriptionValidation !== true) {
    errors.push(descriptionValidation);
  }

  // Affichage des erreurs
  if (errors.length) {
    let errorHTML = "";
    errors.forEach((e) => {
      errorHTML += `<li>${e}</li>`;
    });
    errorElement.innerHTML = errorHTML;
    return false;
  } else {
    errorElement.innerHTML = "";
    return true;
  }
}
