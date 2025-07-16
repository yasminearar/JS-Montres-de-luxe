import { orderService } from '../services/order.service.js';
import { authService } from '../services/auth.js';

document.addEventListener('DOMContentLoaded', () => {
  // Vérifier si l'utilisateur est admin
  const currentUser = authService.getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    window.location.href = '/src/login/login.html';
    return;
  }

  // Éléments DOM
  const ordersTable = document.getElementById('orders-table');
  const ordersTableBody = document.getElementById('orders-table-body');
  const searchInput = document.getElementById('search-input');
  const statusFilter = document.getElementById('status-filter');
  const orderModal = document.getElementById('order-modal');
  const confirmationModal = document.getElementById('confirmation-modal');
  const editForm = document.getElementById('edit-order-form');
  const closeModalBtns = document.querySelectorAll('.close-modal');
  const cancelEditBtn = document.getElementById('cancel-edit');
  const cancelDeleteBtn = document.getElementById('cancel-delete');
  const confirmDeleteBtn = document.getElementById('confirm-delete');

  // Variables d'état
  let orders = [];
  let currentOrderId = null;
  let filteredOrders = [];

  // Charger toutes les commandes
  async function loadOrders() {
    try {
      console.log("Début du chargement des commandes...");
      ordersTableBody.innerHTML = '<tr><td colspan="7" class="table-loading">Chargement des commandes...</td></tr>';
      
      // Vérifier l'authentification
      const token = localStorage.getItem('jwtToken');
      console.log("Token présent:", !!token);
      
      // Charger les commandes
      const ordersData = await orderService.getAllOrders();
      console.log("Commandes reçues:", ordersData);
      
      if (Array.isArray(ordersData)) {
        orders = ordersData;
      } else {
        console.warn("Format de données inattendu:", ordersData);
        orders = [];
      }
      
      filteredOrders = [...orders];
      console.log(`${orders.length} commandes chargées`);
      renderOrders();
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      ordersTableBody.innerHTML = `<tr><td colspan="7" class="table-error">Erreur lors du chargement des commandes: ${error.message}</td></tr>`;
    }
  }

  // Afficher les commandes dans le tableau
  function renderOrders() {
    console.log("Rendu des commandes:", filteredOrders);
    
    if (!filteredOrders || filteredOrders.length === 0) {
      ordersTableBody.innerHTML = '<tr><td colspan="7" class="table-loading">Aucune commande trouvée</td></tr>';
      return;
    }

    ordersTableBody.innerHTML = '';
    filteredOrders.forEach(order => {
      try {
        console.log("Traitement de la commande:", order);
        if (!order) {
          console.error("Commande invalide détectée");
          return;
        }
        
        const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-FR') : 'Date inconnue';
        let totalPrice = 0;
        
        if (order.items && Array.isArray(order.items)) {
          totalPrice = order.items.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0);
        } else {
          console.warn("Pas d'items dans la commande ou format incorrect:", order);
        }
        
        const row = document.createElement('tr');
        let statusClass = '';
        
        // Remplacer les espaces par des points pour la classe CSS
        if (order.status) {
          statusClass = order.status.toLowerCase().replace(/ /g, '.');
        }
        
        // Récupération sécurisée du nom du client
        const firstName = (order.customer ? order.customer.firstName : (order.user ? order.user.firstName : '')) || '';
        const lastName = (order.customer ? order.customer.lastName : (order.user ? order.user.lastName : '')) || '';
        
        row.innerHTML = `
          <td>${order.orderNumber || (order.id ? order.id.slice(-8) : 'ID inconnu')}</td>
          <td>${firstName} ${lastName}</td>
          <td>${date}</td>
          <td>${order.items ? order.items.length : 0}</td>
          <td>${totalPrice.toLocaleString('fr-FR')} €</td>
          <td><span class="order-status ${statusClass}">${order.status || 'Statut inconnu'}</span></td>
          <td class="order-actions">
            <button class="edit-btn" data-id="${order.id}"><i class="fas fa-edit"></i> Modifier</button>
            <button class="delete-btn" data-id="${order.id}"><i class="fas fa-trash"></i> Supprimer</button>
          </td>
        `;
        ordersTableBody.appendChild(row);
      } catch (err) {
        console.error("Erreur lors du rendu d'une commande:", err, order);
      }
    });

    // Ajouter les événements aux boutons après avoir rendu la table
    addEventListeners();
  }

  // Filtrer les commandes
  function filterOrders() {
    const searchTerm = searchInput.value.toLowerCase();
    const statusValue = statusFilter.value;

    filteredOrders = orders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm) ||
        `${order.user.firstName} ${order.user.lastName}`.toLowerCase().includes(searchTerm) ||
        order.shippingAddress.toLowerCase().includes(searchTerm);
      
      const matchesStatus = statusValue === 'all' || order.status.toLowerCase() === statusValue;
      
      return matchesSearch && matchesStatus;
    });

    renderOrders();
  }

  // Ouvrir la modal de modification de commande
  function openEditModal(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    currentOrderId = orderId;
    
    // Remplir le formulaire avec les données de la commande
    document.getElementById('order-id').value = order.id;
    document.getElementById('order-status').value = order.status || 'En attente';
    document.getElementById('order-notes').value = order.notes || '';

    // Mettre à jour le numéro de commande dans la modal
    const detailOrderNumber = document.querySelector('.detail-order-number');
    if (detailOrderNumber) {
      detailOrderNumber.textContent = order.orderNumber || order.id.slice(-8);
    }

    // Afficher les informations client
    const customerInfoBlock = document.querySelector('.customer-info');
    const customer = order.customer || order.user;
    const email = customer?.email || (order.user ? order.user.email : 'N/A');
    const phone = customer?.phone || (order.user ? order.user.phone : 'N/A');
    const firstName = customer?.firstName || (order.user ? order.user.firstName : '');
    const lastName = customer?.lastName || (order.user ? order.user.lastName : '');
    
    customerInfoBlock.innerHTML = `
      <div class="info-block">
        <h3>Adresse de livraison</h3>
        <address>
          <span class="name">${firstName} ${lastName}</span>
          <span>${order.shippingAddress || 'Non spécifiée'}</span>
          <span>${email}</span>
          <span>${phone || 'N/A'}</span>
        </address>
      </div>
      <div class="info-block">
        <h3>Informations de paiement</h3>
        <div class="payment-info">
          <span>Méthode: ${order.paymentMethod || 'Non spécifiée'}</span>
          <span>Date: ${new Date(order.createdAt).toLocaleDateString('fr-FR')}</span>
          <span>Référence: ${order.orderNumber || order.id.slice(-12)}</span>
        </div>
      </div>
    `;

    // Afficher les articles de la commande
    const itemsTable = document.getElementById('order-items-table');
    const tbody = itemsTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    let total = 0;
    order.items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${item.price.toLocaleString('fr-FR')} €</td>
        <td>${itemTotal.toLocaleString('fr-FR')} €</td>
      `;
      tbody.appendChild(row);
    });
    
    // Ajouter la ligne du total
    const totalRow = document.createElement('tr');
    totalRow.className = 'total-row';
    totalRow.innerHTML = `
      <td colspan="3">Total</td>
      <td>${total.toLocaleString('fr-FR')} €</td>
    `;
    tbody.appendChild(totalRow);

    // Afficher la modal
    orderModal.classList.add('show');
  }

  // Ouvrir la modal de confirmation de suppression
  function openDeleteModal(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    currentOrderId = orderId;
    const orderIdDisplay = document.getElementById('delete-order-id');
    orderIdDisplay.textContent = order.orderNumber || order.id.slice(-8);
    confirmationModal.classList.add('show');
  }

  // Fermer les modals
  function closeModals() {
    orderModal.classList.remove('show');
    confirmationModal.classList.remove('show');
    currentOrderId = null;
  }

  // Mettre à jour une commande
  async function updateOrder(event) {
    event.preventDefault();
    
    if (!currentOrderId) return;
    
    try {
      const status = document.getElementById('order-status').value;
      const notes = document.getElementById('order-notes').value;
      
      await orderService.updateOrder(currentOrderId, { 
        status, 
        notes 
      });
      
      // Mettre à jour l'état local
      const orderIndex = orders.findIndex(o => o.id === currentOrderId);
      if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        orders[orderIndex].notes = notes;
        filteredOrders = filterOrders(); // Réappliquer les filtres
      }
      
      closeModals();
      loadOrders(); // Recharger les commandes pour être sûr d'avoir les données à jour
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la commande:', error);
      alert(`Erreur lors de la mise à jour de la commande: ${error.message}`);
    }
  }

  // Supprimer une commande
  async function deleteOrder() {
    if (!currentOrderId) return;
    
    try {
      await orderService.deleteOrder(currentOrderId);
      
      // Mettre à jour l'état local
      orders = orders.filter(o => o.id !== currentOrderId);
      filteredOrders = filteredOrders.filter(o => o.id !== currentOrderId);
      
      closeModals();
      renderOrders();
    } catch (error) {
      console.error('Erreur lors de la suppression de la commande:', error);
      alert(`Erreur lors de la suppression de la commande: ${error.message}`);
    }
  }

  // Ajouter les écouteurs d'événements aux boutons d'action
  function addEventListeners() {
    // Boutons d'édition
    const editBtns = document.querySelectorAll('.edit-btn');
    editBtns.forEach(btn => {
      btn.addEventListener('click', () => openEditModal(btn.dataset.id));
    });
    
    // Boutons de suppression
    const deleteBtns = document.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', () => openDeleteModal(btn.dataset.id));
    });
  }

  // Initialiser les écouteurs d'événements pour les filtres et modals
  function initEventListeners() {
    // Filtres
    searchInput.addEventListener('input', filterOrders);
    statusFilter.addEventListener('change', filterOrders);
    
    // Formulaire d'édition
    editForm.addEventListener('submit', updateOrder);
    
    // Boutons de fermeture des modals
    closeModalBtns.forEach(btn => {
      btn.addEventListener('click', closeModals);
    });
    
    // Boutons d'annulation
    cancelEditBtn.addEventListener('click', closeModals);
    cancelDeleteBtn.addEventListener('click', closeModals);
    
    // Bouton de confirmation de suppression
    confirmDeleteBtn.addEventListener('click', deleteOrder);
  }

  // Initialiser la page
  function init() {
    loadOrders();
    initEventListeners();
  }

  // Démarrer l'application
  init();
});
