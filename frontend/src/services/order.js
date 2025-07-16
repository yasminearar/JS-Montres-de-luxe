/**
 * Service pour gérer les commandes utilisateur
 */
import { apiService } from "./api.js";
import { env } from "../../config/env.js";

class OrderService {

  async createOrder(orderData) {
    try {
      const response = await apiService.fetchApi(`${env.BACKEND_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      throw error;
    }
  }

  async getUserOrders() {
    try {
      const response = await apiService.fetchApi(`${env.BACKEND_URL}/orders/me`);
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      throw error;
    }
  }

  async getOrderById(orderId) {
    try {
      const response = await apiService.fetchApi(`${env.BACKEND_URL}/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la commande:', error);
      throw error;
    }
  }

  saveLocalOrder(orderData) {
    try {
      let orders = this.getLocalOrders();

      const orderId = `local-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const orderWithId = {
        ...orderData,
        id: orderId,
        createdAt: new Date().toISOString()
      };

      orders.push(orderWithId);

      localStorage.setItem('luxe_watches_orders', JSON.stringify(orders));
      
      return orderWithId;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde locale de la commande:', error);
      throw error;
    }
  }

  getLocalOrders() {
    try {
      const ordersData = localStorage.getItem('luxe_watches_orders');
      return ordersData ? JSON.parse(ordersData) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes locales:', error);
      return [];
    }
  }

  async getAllOrders() {
    try {
      
      const response = await apiService.fetchApi(`${env.BACKEND_URL}/orders`);
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      throw error;
    }
  }

  async updateOrder(orderId, orderData) {
    try {
      const response = await apiService.fetchApi(`${env.BACKEND_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la commande:', error);
      throw error;
    }
  }

  async deleteOrder(orderId) {
    try {
      const response = await apiService.fetchApi(`${env.BACKEND_URL}/orders/${orderId}`, {
        method: 'DELETE'
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const orderService = new OrderService();
export { OrderService };
