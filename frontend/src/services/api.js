import { env } from "../../config/env.js";

/**
 * Service pour gérer les appels API
 */
class ApiService {

  async fetchApi(url, options = {}) {
    try {
      const cleanHeaders = {
        'Content-Type': 'application/json',
        ...options.headers
      };

      if (cleanHeaders['Content-Type'].includes('json')) {
        cleanHeaders['Content-Type'] = 'application/json';
      }
      
      const requestOptions = {
        headers: cleanHeaders,
        ...options
      };
      
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async getAllProducts() {
    const response = await this.fetchApi(env.BACKEND_PRODUCTS_URL);
    return response.data || [];
  }

  async getProductById(id) {
    const response = await this.fetchApi(`${env.BACKEND_PRODUCTS_URL}/${id}`);
    return response.data;
  }

  async getAvailableProducts() {
    const response = await this.fetchApi(`${env.BACKEND_PRODUCTS_URL}/available`);
    return response.data || [];
  }

  async searchProducts(query) {
    const response = await this.fetchApi(`${env.BACKEND_PRODUCTS_URL}/search/${encodeURIComponent(query)}`);
    return response.data || [];
  }

  async getProductsByBrand(brand) {
    const response = await this.fetchApi(`${env.BACKEND_PRODUCTS_URL}/brand/${encodeURIComponent(brand)}`);
    return response.data || [];
  }

  async getAllBrands() {
    const response = await this.fetchApi(`${env.BACKEND_PRODUCTS_URL}/brands`);
    return response.data || [];
  }

  async createProduct(productData, userId) {
    console.log('API createProduct appelée avec:', { productData, userId });
    console.log('URL de destination:', env.BACKEND_PRODUCTS_URL);
    
    const requestData = {
      method: 'POST',
      body: JSON.stringify(productData),
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId
      }
    };
    
    console.log('Données de la requête:', requestData);
    
    try {
      const response = await this.fetchApi(env.BACKEND_PRODUCTS_URL, requestData);
      console.log('Réponse reçue de createProduct:', response);
      return response;
    } catch (error) {
      console.error('Erreur dans createProduct:', error);
      throw error;
    }
  }

  async updateProduct(id, productData, userId) {
    return await this.fetchApi(`${env.BACKEND_PRODUCTS_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId
      }
    });
  }

  async deleteProduct(id, userId) {
    return await this.fetchApi(`${env.BACKEND_PRODUCTS_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'x-user-id': userId
      }
    });
  }

  // === UTILISATEURS ===

  async getAllUsers() {
    const response = await this.fetchApi(env.BACKEND_USERS_URL);
    return response.data || [];
  }

  async getUserById(id) {
    const response = await this.fetchApi(`${env.BACKEND_USERS_URL}/${id}`);
    return response.data;
  }

  async createUser(userData) {
    return await this.fetchApi(env.BACKEND_USERS_URL, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async updateUser(id, userData) {
    return await this.fetchApi(`${env.BACKEND_USERS_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async deleteUser(id, userId) {
    return await this.fetchApi(`${env.BACKEND_USERS_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'x-user-id': userId
      }
    });
  }

  async getAdmins(userId) {
    const response = await this.fetchApi(`${env.BACKEND_USERS_URL}/admin/list`, {
      headers: {
        'x-user-id': userId
      }
    });
    return response.data || [];
  }

  async promoteToAdmin(id, userId) {
    return await this.fetchApi(`${env.BACKEND_USERS_URL}/${id}/promote`, {
      method: 'PATCH',
      headers: {
        'x-user-id': userId
      }
    });
  }

  // === AUTHENTIFICATION ===

  async login(email, password) {
    const response = await this.fetchApi(`${env.BACKEND_USERS_URL}/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (response.data) {
      this.setCurrentUser(response.data);
    }
    
    return response;
  }

  logout() {
    this.clearCurrentUser();
  }

  isLoggedIn() {
    return this.getCurrentUser() !== null;
  }

  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  }

  setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  clearCurrentUser() {
    localStorage.removeItem('currentUser');
  }
}

export const apiService = new ApiService();
