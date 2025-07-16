import { apiService } from './api.js';
import { env } from '../../config/env.js';

class OrderService {
  /**
   * Récupère toutes les commandes (admin uniquement)
   */
  async getAllOrders() {
    try {
      const response = await apiService.get(`${env.BACKEND_URL}/orders`);
      
      if (!response || !response.success) {
        console.warn('La réponse de l\'API ne contient pas la propriété success=true');
      }
      
      if (!response.data) {
        if (response.orders) {
          console.log('Utilisation de response.orders à la place de response.data');
          return response.orders;
        }
        if (Array.isArray(response)) {
          return response;
        }
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      throw error;
    }
  }

  async getUserOrders() {
    try {
      const response = await apiService.get(`${env.BACKEND_URL}/orders/me`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getOrder(id) {
    try {
      const response = await apiService.get(`${env.BACKEND_URL}/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la commande ${id}:`, error);
      throw error;
    }
  }

  async createOrder(orderData) {
    try {
      const response = await apiService.post(`${env.BACKEND_URL}/orders`, orderData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      throw error;
    }
  }

  async updateOrder(id, updateData) {
    try {
      const response = await apiService.put(`${env.BACKEND_URL}/orders/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la commande ${id}:`, error);
      throw error;
    }
  }

  async deleteOrder(id) {
    try {
      const response = await apiService.delete(`${env.BACKEND_URL}/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la commande ${id}:`, error);
      throw error;
    }
  }

  saveLocalOrder(orderData) {
    const orderId = 'local-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

    const orderNumber = this.generateOrderNumber();

    const order = {
      ...orderData,
      id: orderId,
      orderNumber,
      status: 'en attente',
      createdAt: new Date().toISOString()
    };

    const localOrders = JSON.parse(localStorage.getItem('localOrders') || '[]');
    localOrders.push(order);
    localStorage.setItem('localOrders', JSON.stringify(localOrders));

    return order;
  }

  getLocalOrders() {
    try {
      return JSON.parse(localStorage.getItem('localOrders') || '[]');
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes locales:', error);
      return [];
    }
  }

  generateOrderNumber() {
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ML-${timestamp}${random}`;
  }
}

export const orderService = new OrderService();
