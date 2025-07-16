import '../main.scss';
import './orders.scss';
import { orderService } from '../services/order.js';
import { authService } from '../services/auth.js';

class OrderHistory {
  constructor() {
    this.orderService = orderService;
    this.authService = authService;
    this.ordersContainer = document.querySelector('.orders-container');
    this.modal = document.querySelector('.order-details-modal');
    this.orders = [];
    
    this.init();
  }
  
  async init() {
    try {
      await this.loadOrders();
      this.setupEventListeners();
    } catch (error) {
      console.error('Error initializing order history:', error);
      this.showErrorMessage('Une erreur est survenue lors du chargement de vos commandes.');
    }
  }
  
  async loadOrders() {
    try {
      let orders;
      
      if (this.authService.isLoggedIn()) {
        try {
          orders = await this.orderService.getUserOrders();
        } catch (serverError) {
          orders = this.orderService.getLocalOrders();
        }
      } else {
        // Récupérer les commandes stockées localement pour les utilisateurs invités
        orders = this.orderService.getLocalOrders();
        console.log("Commandes locales:", orders);
      }

      this.orders = orders || [];
      
      this.renderOrders(this.orders);
    } catch (error) {
      console.error('Error loading orders:', error);
      this.showErrorMessage('Impossible de charger vos commandes. Veuillez réessayer plus tard.');
    }
  }
  
  renderOrders(orders) {
    this.ordersContainer.innerHTML = '';
    
    if (!orders || orders.length === 0) {
      const emptyTemplate = document.getElementById('empty-orders-template');
      const emptyContent = document.importNode(emptyTemplate.content, true);
      this.ordersContainer.appendChild(emptyContent);
      return;
    }

    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const orderTemplate = document.getElementById('order-template');
    
    orders.forEach(order => {
      const orderElement = document.importNode(orderTemplate.content, true);

      const orderNumber = orderElement.querySelector('.order-number');
      const orderDate = orderElement.querySelector('.order-date');
      const orderTotal = orderElement.querySelector('.order-total');
      const orderItems = orderElement.querySelector('.order-items');
      const viewDetailsBtn = orderElement.querySelector('.btn-view-details');

      orderNumber.textContent = `Commande #${order.orderNumber || order._id || order.id || 'Guest-' + new Date(order.createdAt).getTime()}`;
      orderDate.textContent = new Date(order.orderDate || order.createdAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      let totalPrice;
      if (order.totals && order.totals.total) {
        totalPrice = order.totals.total;
      } else if (order.totalPrice) {
        totalPrice = order.totalPrice;
      } else {
        totalPrice = this.calculateOrderTotal(order.items);
      }
      
      orderTotal.textContent = `Total: ${this.formatPrice(totalPrice)}`;

      const previewItems = order.items.slice(0, 3);
      previewItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item-preview';
        itemElement.innerHTML = `
          <span class="item-name">${item.nom || item.name || (item.product && item.product.name) || 'Produit'}</span>
          <span class="item-quantity">x${item.quantity}</span>
        `;
        orderItems.appendChild(itemElement);
      });
      
      if (order.items.length > 3) {
        const moreItems = document.createElement('div');
        moreItems.className = 'more-items';
        moreItems.textContent = `+ ${order.items.length - 3} produits supplémentaires`;
        orderItems.appendChild(moreItems);
      }

      viewDetailsBtn.dataset.orderId = JSON.stringify(order);
      
      this.ordersContainer.appendChild(orderElement);
    });
  }
  
  showOrderDetails(orderIdOrData) {
    try {
      let order;

      if (orderIdOrData.startsWith('{')) {
        order = JSON.parse(orderIdOrData);
      } else {
        order = this.orders.find(o => o._id === orderIdOrData || o.id === orderIdOrData);
      }
      
      if (!order) {
        console.error('Order not found:', orderIdOrData);
        return;
      }

      const modalHeader = this.modal.querySelector('.detail-order-number');
      const modalBody = this.modal.querySelector('.modal-body');
      
      modalHeader.textContent = `#${order.orderNumber || order._id || order.id || 'Guest-' + new Date(order.createdAt).getTime()}`;
      
      modalBody.innerHTML = `
        <div class="order-detail-info">
          <div class="detail-row">
            <span class="detail-label">Date de la commande:</span>
            <span class="detail-value">${new Date(order.orderDate || order.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric'
            })}</span>
          </div>
          ${order.customer ? `
          <div class="detail-row">
            <span class="detail-label">Client:</span>
            <span class="detail-value">
              ${order.customer.fullName || 'Client'} (${order.customer.email || 'Pas d\'email'})
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Adresse de livraison:</span>
            <span class="detail-value">
              ${order.customer.address || ''}, 
              ${order.customer.city || ''}, 
              ${order.customer.postalCode || ''}, 
              ${order.customer.country || ''}
            </span>
          </div>
          ` : ''}
        </div>
        
        <h3>Produits commandés</h3>
        <div class="order-items-table">
          <table>
            <thead>
              <tr>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.nom || item.name || (item.product && item.product.name) || 'Produit'}</td>
                  <td>${item.quantity}</td>
                  <td>${this.formatPrice(item.prix || item.price || (item.product && item.product.price) || 0)}</td>
                  <td>${this.formatPrice((item.prix || item.price || (item.product && item.product.price) || 0) * item.quantity)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="total-label">Total</td>
                <td class="total-value">${this.formatPrice(
                  order.totals ? order.totals.total : (order.totalPrice || this.calculateOrderTotal(order.items))
                )}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      `;

      this.modal.style.display = 'flex';
    } catch (error) {
      console.error('Error displaying order details:', error);
      alert('Impossible d\'afficher les détails de cette commande.');
    }
  }
  
  calculateOrderTotal(items) {
    return items.reduce((total, item) => {
      const itemPrice = item.prix || item.price || (item.product && item.product.price) || 0;
      return total + itemPrice * item.quantity;
    }, 0);
  }
  
  formatPrice(price) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }
  
  showErrorMessage(message) {
    this.ordersContainer.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <p>${message}</p>
      </div>
    `;
  }
  
  setupEventListeners() {
    // Gestionnaire pour les boutons de détails
    this.ordersContainer.addEventListener('click', (e) => {
      const detailsBtn = e.target.closest('.btn-view-details');
      if (detailsBtn) {
        const orderId = detailsBtn.dataset.orderId;
        this.showOrderDetails(orderId);
      }
    });

    const closeBtn = this.modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
      this.modal.style.display = 'none';
    });

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.modal.style.display = 'none';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new OrderHistory();
});
