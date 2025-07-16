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
      const authLinks = navUser.querySelectorAll('.auth-nav');
      authLinks.forEach(link => {
        link.parentElement.style.display = 'none';
      });

      const cartLink = navUser.querySelector('.cart-nav');
      if (cartLink) {
        cartLink.parentElement.style.display = 'none';
      }
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
      const authLinks = navUser.querySelectorAll('.auth-nav, .cart-nav');
      authLinks.forEach(link => {
        link.parentElement.style.display = 'block';
      });
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

function getAdminPath(path) {
  const currentPath = window.location.pathname;

  if (currentPath.includes('index.html') || currentPath.endsWith('/') || currentPath.endsWith('/JS-Montres-de-luxe/frontend/src/')) {
    return `./${path}`;
  }

  return `../${path}`;
}

function injectAdminLink() {
  const adminLinks = document.querySelectorAll('.nav-main .admin-nav');
  if (adminLinks.length > 0) {
    adminLinks.forEach(link => {
      if (link.parentElement) {
        link.parentElement.style.display = 'block';
      }
    });
  } 

  else {
    const navMain = document.querySelector('.nav-main');
    if (navMain) {
      const addProductLink = document.createElement('li');
      addProductLink.innerHTML = `
        <a href="${getAdminPath('form/form.html')}" class="header-nav admin-nav">
          <span class="icon-circle"><i class="fas fa-plus"></i></span> Ajouter un produit
        </a>
      `;
      navMain.appendChild(addProductLink);

      const manageOrdersLink = document.createElement('li');
      manageOrdersLink.innerHTML = `
        <a href="${getAdminPath('admin/admin-orders.html')}" class="header-nav admin-nav">
          <span class="icon-circle"><i class="fas fa-clipboard-list"></i></span> Gérer les commandes
        </a>
      `;
      navMain.appendChild(manageOrdersLink);
    }
  }
}

function removeAdminLink() {
  const adminLinks = document.querySelectorAll('.nav-main .admin-nav');
  adminLinks.forEach(link => {
    if (link.parentElement) {
      link.parentElement.style.display = 'none';
    }
  });
}

window.toggleUserMenu = function() {
  const dropdown = document.getElementById('user-dropdown');
  if (dropdown) {
    dropdown.classList.toggle('active');

    if (dropdown.classList.contains('active')) {
      dropdown.style.opacity = '1';
      dropdown.style.transform = 'scale(1)';
    } else {
      dropdown.style.opacity = '0';
      dropdown.style.transform = 'scale(0.9)';
    }
  }
};

window.logout = function() {
  authService.logout();
  updateMenuDisplay();
  window.location.href = '/';
};

document.addEventListener('click', function(event) {
  const userMenu = document.getElementById('user-menu');
  const dropdown = document.getElementById('user-dropdown');

  if (userMenu && !userMenu.contains(event.target) && dropdown && dropdown.classList.contains('active')) {
    dropdown.classList.remove('active');
    dropdown.style.opacity = '0';
    dropdown.style.transform = 'scale(0.9)';
  }
});

document.addEventListener('DOMContentLoaded', function() {
  updateMenuDisplay();
});

window.updateMenuDisplay = updateMenuDisplay;
