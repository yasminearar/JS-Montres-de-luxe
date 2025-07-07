import '../assets/styles/styles.scss';
import './login.scss';
import { apiService } from '../services/api.js';

const form = document.querySelector('.login-form');
const errorElement = document.getElementById('login-errors');
let errors = [];

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  if (formIsValid(email, password)) {
    try {
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.textContent = 'Connexion...';
      const response = await apiService.login(email, password);
      
      if (response.success) {
        window.location.href = '../index.html';
      } else {
        errors = [response.error || 'Erreur de connexion'];
        displayErrors();
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      errors = [error.message || 'Erreur de connexion. Vérifiez que le serveur est démarré.'];
      displayErrors();
    } finally {
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = false;
      submitButton.textContent = 'Se connecter';
    }
  }
});

function displayErrors() {
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

function validateEmail(email) {
  // Test if email is provided
  if (!email) {
    return "L'adresse e-mail est obligatoire !";
  }

  // Check if email format is valid using regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Le format de l'adresse e-mail est invalide !";
  }
  
  return true;
}

function validatePassword(password) {
  // Test if password is provided
  if (!password) {
    return "Le mot de passe est obligatoire !";
  }
  
  // Check if password has minimum length
  if (password.length < 8) {
    return "Le mot de passe doit contenir au moins 8 caractères";
  }
  
  return true;
}

function formIsValid(email, password) {
  errors = [];
  
  // Validation de l'email
  const emailValidation = validateEmail(email);
  if (emailValidation !== true) {
    errors.push(emailValidation);
  }
  
  // Validation du mot de passe
  const passwordValidation = validatePassword(password);
  if (passwordValidation !== true) {
    errors.push(passwordValidation);
  }
  
  // Affichage des erreurs
  displayErrors();
  return errors.length === 0;
}
