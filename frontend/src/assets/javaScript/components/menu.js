import { authService } from '../../../services/auth.js';

function updateMenuDisplay() {
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
      injectAdminLink();
    } else {
      document.body.classList.remove('admin-user');
      removeAdminLink();
    }
  } else {
    if (userMenu) {
      userMenu.style.display = 'none';
    }
    if (navUser) {
      navUser.style.display = 'flex';
    }

    document.body.classList.remove('admin-user');
    removeAdminLink();
  }
}

function getFormPath() {
  const currentPath = window.location.pathname;

  if (currentPath.includes('index.html') || currentPath.endsWith('/') || currentPath.endsWith('/JS-Montres-de-luxe/frontend/src/')) {
    return './form/form.html';
  }

  return '../form/form.html';
}

function injectAdminLink() {
  const navMain = document.querySelector('.nav-main');
  if (navMain && !navMain.querySelector('.admin-nav')) {
    const adminLink = document.createElement('li');
    adminLink.innerHTML = `
      <a href="${getFormPath()}" class="header-nav admin-nav">
        <span class="icon-circle"><i class="fas fa-plus"></i></span> Ajouter un produit
      </a>
    `;
    navMain.appendChild(adminLink);
  }
}

function removeAdminLink() {
  const currentPath = window.location.pathname;
  if (currentPath.includes('login.html') || currentPath.includes('register.html')) {
    const adminLink = document.querySelector('.nav-main .admin-nav');
    if (adminLink) {
      adminLink.parentElement.remove();
    }
  }
}

window.toggleUserMenu = function() {
  const dropdown = document.getElementById('user-dropdown');
  if (dropdown) {
    dropdown.classList.toggle('active');
  }
};

window.logout = function() {
  authService.logout();
  updateMenuDisplay();
  window.location.reload();
};

document.addEventListener('click', function(event) {
  const userMenu = document.getElementById('user-menu');
  const dropdown = document.getElementById('user-dropdown');
  
  if (userMenu && !userMenu.contains(event.target) && dropdown) {
    dropdown.classList.remove('active');
  }
});

document.addEventListener('DOMContentLoaded', function() {
  updateMenuDisplay();
});

window.updateMenuDisplay = updateMenuDisplay;
