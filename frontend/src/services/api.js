import { env } from "../../config/env.js";

/**
 * Service pour gérer les appels API
 */
class ApiService {

  async fetchApi(url, options = {}) {
    try {
      const { headers: optionHeaders, ...otherOptions } = options;
      const cleanHeaders = { 'Content-Type': 'application/json' };
      if (optionHeaders) {
        Object.assign(cleanHeaders, optionHeaders);
      }

      if (cleanHeaders['Content-Type'].includes('json')) {
        cleanHeaders['Content-Type'] = 'application/json';
      }

      const token = localStorage.getItem('jwtToken');
      if (token) {
        cleanHeaders['Authorization'] = `Bearer ${token}`;
      }
      const requestOptions = {
        ...otherOptions,
        headers: cleanHeaders
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

  async createProduct(productData) {
    const requestData = {
      method: 'POST',
      body: JSON.stringify(productData),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    try {
      const response = await this.fetchApi(env.BACKEND_PRODUCTS_URL, requestData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(id, productData) {
    return await this.fetchApi(`${env.BACKEND_PRODUCTS_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async deleteProduct(id) {
    return await this.fetchApi(`${env.BACKEND_PRODUCTS_URL}/${id}`, {
      method: 'DELETE'
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

  async deleteUser(id) {
    return await this.fetchApi(`${env.BACKEND_USERS_URL}/${id}`, {
      method: 'DELETE'
    });
  }

  async getAdmins() {
    const response = await this.fetchApi(`${env.BACKEND_USERS_URL}/admin/list`);
    return response.data || [];
  }

  async promoteToAdmin(id) {
    return await this.fetchApi(`${env.BACKEND_USERS_URL}/${id}/promote`, {
      method: 'PATCH'
    });
  }

  // === AUTHENTIFICATION ===

  async login(email, password) {
    const response = await this.fetchApi(`${env.BACKEND_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (response.token) {
      localStorage.setItem('jwtToken', response.token);
      this.setCurrentUser(response.user);
    }
    
    return response;
  }

  logout() {
    localStorage.removeItem('jwtToken');
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
