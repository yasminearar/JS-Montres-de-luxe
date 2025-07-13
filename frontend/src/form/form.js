import "../assets/styles/styles.scss";
import "./form.scss";
import { apiService } from "../services/api.js";
import { authService } from "../services/auth.js";

function checkAdminAccess() {
  if (!authService.isLoggedIn()) {
    window.location.href = '../login/login.html';
    return false;
  }
  
  if (!authService.isAdmin()) {
    window.location.href = '../index.html';
    return false;
  }
  
  return true;
}

// Fonction pour basculer l'affichage du menu utilisateur
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

window.logout = function() {
  authService.logout();
  updateUserMenu();
  window.location.href = '../index.html';
};

document.addEventListener('click', function(event) {
  const userMenu = document.getElementById('user-menu');
  const dropdown = document.getElementById('user-dropdown');
  
  if (userMenu && !userMenu.contains(event.target)) {
    dropdown.classList.remove('active');
  }
});

const form = document.querySelector("#add-product-form");
const errorElement = document.querySelector("#errors");
let errors = [];

function initializeForm() {
  authService.init();
  updateUserMenu();

  if (form) {
    form.addEventListener("submit", handleSubmit);
  }
}

async function handleSubmit(event) {
  event.preventDefault();
  console.log('Formulaire soumis');

  const formData = new FormData(form);
  const produit = Object.fromEntries(formData.entries());
  console.log('Données du produit:', produit);

  if (formIsValid(produit)) {
    try {
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.textContent = 'Ajout en cours...';

      const currentUser = authService.getCurrentUser();
      console.log('Utilisateur actuel:', currentUser);

      produit.prix = parseFloat(produit.prix);
      console.log('Produit après conversion prix:', produit);

      console.log('Envoi de la requête API...');
      const response = await apiService.createProduct(produit);
      console.log('Réponse API reçue:', response);
      
      if (response.success) {
        console.log('Produit ajouté avec succès');
        form.reset();
        window.location.href = '../index.html';
      } else {
        console.error('Erreur de l\'API:', response.error);
        errors = [response.error || 'Erreur lors de l\'ajout du produit'];
        displayErrors();
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      errors = [error.message || 'Erreur lors de l\'ajout. Vérifiez que le serveur est démarré.'];
      displayErrors();
    } finally {
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = false;
      submitButton.textContent = 'Ajouter le produit';
    }
  } else {
    console.log('Formulaire invalide, erreurs:', errors);
  }
}

function displayErrors() {
  const errorElement = document.querySelector("#errors");
  
  if (!errorElement) {
    console.error('Élément #errors non trouvé dans le DOM');
    return;
  }

  if (errors.length) {
    let errorHTML = "";
    errors.forEach((e) => {
      errorHTML += `<li>${e}</li>`;
    });
    errorElement.innerHTML = errorHTML;
  } else {
    errorElement.innerHTML = "";
  }
}

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

  const isValidUrl = /^https?:\/\/.+\.(jpe?g|png|gif|webp|svg)$/i.test(imagePath);
  const isValidRelativePath = /^\.\.?\/.*\.(jpe?g|png|gif|webp|svg)$/i.test(imagePath);
  const isValidAbsolutePath = /^\/[^\/].*\.(jpe?g|png|gif|webp|svg)$/i.test(imagePath);
  
  if (!isValidUrl && !isValidRelativePath && !isValidAbsolutePath) {
    return "Le chemin de l'image semble invalide. Utilisez une URL complète (https://...) ou un chemin relatif/absolu valide se terminant par .jpg, .jpeg, .png, .gif, .webp ou .svg";
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

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM chargé, vérification des accès...');
  
  if (!checkAdminAccess()) {
    return;
  }
  
  console.log('Accès autorisé, initialisation du formulaire...');

  setTimeout(() => {
    initializeForm();
  }, 100);
});
