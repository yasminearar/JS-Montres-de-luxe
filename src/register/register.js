import "../assets/styles/styles.scss";
import "./register.scss";

const form = document.getElementById('register-form');
const errorElement = document.getElementById('register-errors');
let errors = [];

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const user = Object.fromEntries(formData.entries());
  
  if (formIsValid(user)) {
    console.log('Formulaire soumis :', user);
    alert("Inscription réussie !");
    form.reset();
  }
});

function validateName(name) {
  // Test if name is provided
  if (!name) {
    return "Le nom est obligatoire !";
  }
  
  // Check if name has minimum length
  if (name.length < 2) {
    return "Le nom doit contenir au moins 2 caractères";
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
  
  // Check if password has at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return "Le mot de passe doit contenir au moins une lettre majuscule";
  }
  
  // Check if password has at least one number
  if (!/[0-9]/.test(password)) {
    return "Le mot de passe doit contenir au moins un chiffre";
  }
  
  return true;
}

function formIsValid(user) {
  errors = [];
  
  // Validation du nom
  const nomValidation = validateName(user.nom);
  if (nomValidation !== true) {
    errors.push(nomValidation);
  }
  
  // Validation de l'email
  const emailValidation = validateEmail(user.email);
  if (emailValidation !== true) {
    errors.push(emailValidation);
  }
  
  // Validation du mot de passe
  const passwordValidation = validatePassword(user.motdepasse);
  if (passwordValidation !== true) {
    errors.push(passwordValidation);
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
