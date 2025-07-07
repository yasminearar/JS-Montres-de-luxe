import { apiService } from './api.js';

class AuthService {

  init() {
    this.updateAuthUI();
  }

  updateAuthUI() {
    const user = apiService.getCurrentUser();
    const isLoggedIn = user !== null;

    this.updateNavigation(isLoggedIn, user);
  }

  updateNavigation(isLoggedIn, user) {
    const navLinks = document.querySelectorAll('.auth-nav');
    const adminLinks = document.querySelectorAll('.admin-nav');

    navLinks.forEach(link => {
      const isLoginLink = link.getAttribute('href').includes('login');
      const isRegisterLink = link.getAttribute('href').includes('register');
      
      if (isLoggedIn) {
        if (isLoginLink || isRegisterLink) {
          link.parentElement.style.display = 'none';
        }
      } else {
        if (isLoginLink || isRegisterLink) {
          link.parentElement.style.display = 'block';
        }
      }
    });

    adminLinks.forEach(link => {
      if (isLoggedIn && user && user.role === 'admin') {
        link.parentElement.style.display = 'block';
      } else {
        link.parentElement.style.display = 'none';
      }
    });

    if (isLoggedIn) {
      this.addUserInfo(user);
    } else {
      this.removeUserInfo();
    }
  }

  addUserInfo(user) {
    let userInfo = document.querySelector('.user-info');
    if (!userInfo) {
      userInfo = document.createElement('div');
      userInfo.className = 'user-info';

      const headerNav = document.querySelector('header ul');
      if (headerNav) {
        const userInfoLi = document.createElement('li');
        userInfoLi.appendChild(userInfo);
        headerNav.appendChild(userInfoLi);
      }
    }
    
    userInfo.innerHTML = `
      <div class="user-profile">
        <span class="user-name">
          <i class="fas fa-user"></i>
          ${user.firstname} ${user.lastname}
          ${user.role === 'admin' ? '<span class="admin-badge">Admin</span>' : ''}
        </span>
      </div>
    `;
  }

  removeUserInfo() {
    const userInfo = document.querySelector('.user-info');
    if (userInfo) {
      userInfo.parentElement.remove();
    }
  }

  async logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      apiService.logout();
      window.location.href = '/index.html';
    }
  }

  isAdmin() {
    return apiService.isAdmin();
  }

  isLoggedIn() {
    return apiService.isLoggedIn();
  }

  getCurrentUser() {
    return apiService.getCurrentUser();
  }
}

export const authService = new AuthService();

window.authService = authService;
