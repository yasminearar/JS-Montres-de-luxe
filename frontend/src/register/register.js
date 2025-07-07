import "../assets/styles/styles.scss";
import "./register.scss";
import { apiService } from "../services/api.js";

const form = document.getElementById('register-form');
const errorElement = document.getElementById('register-errors');
let errors = [];

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const user = Object.fromEntries(formData.entries());
  
  if (formIsValid(user)) {
    try {
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.textContent = 'Inscription...';
      const response = await apiService.createUser(user);
      
      if (response.success) {
        window.location.href = '../login/login.html';
      } else {
        errors = [response.error || 'Erreur lors de l\'inscription'];
        displayErrors();
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      errors = [error.message || 'Erreur lors de l\'inscription. Vérifiez que le serveur est démarré.'];
      displayErrors();
    } finally {
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = false;
      submitButton.textContent = 'S\'inscrire';
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

function validateName(name, fieldName) {
  // Test if name is provided
  if (!name) {
    return `${fieldName} est obligatoire !`;
  }
  
  // Check if name has minimum length
  if (name.length < 2) {
    return `${fieldName} doit contenir au moins 2 caractères`;
  }
  
  return true;
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

function formIsValid(user) {
  errors = [];

  const firstnameValidation = validateName(user.firstname, "Le prénom");
  if (firstnameValidation !== true) {
    errors.push(firstnameValidation);
  }

  // Validation du nom
  const lastnameValidation = validateName(user.lastname, "Le nom");
  if (lastnameValidation !== true) {
    errors.push(lastnameValidation);
  }
  
  // Validation de l'email
  const emailValidation = validateEmail(user.email);
  if (emailValidation !== true) {
    errors.push(emailValidation);
  }
  
  // Validation du mot de passe
  const passwordValidation = validatePassword(user.password);
  if (passwordValidation !== true) {
    errors.push(passwordValidation);
  }
  
  // Affichage des erreurs
  displayErrors();
  return errors.length === 0;
}
