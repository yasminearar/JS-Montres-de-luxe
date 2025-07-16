// controllers/order.controller.js
import asyncHandler from '../middleware/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import JSONArrayDatabase from '../database/JSONArrayDatabase.js';

const ordersDb = new JSONArrayDatabase('../data/orders.json');

export const createOrder = asyncHandler(async (req, res, next) => {
  try {
    const orderData = req.body;
    
    // Vérification des données requises
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return next(new ErrorResponse('Les articles de la commande sont requis', 400));
    }
    
    // Vérification des informations client
    if (!orderData.customer || !orderData.customer.email) {
      return next(new ErrorResponse('Les informations client sont requises', 400));
    }
    
    // Si l'utilisateur est connecté, associer l'ID utilisateur à la commande
    if (req.user) {
      orderData.userId = req.user.id;
      orderData.userStatus = 'registered';
    } else {
      orderData.userStatus = 'guest';
    }
    
    // Ajouter la date de création
    orderData.createdAt = new Date().toISOString();

    orderData.orderNumber = generateOrderNumber();

    const order = await ordersDb.create(orderData);
    
    console.log('Commande créée avec succès:', order.id);
    
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    return next(new ErrorResponse(`Erreur lors de la création de la commande: ${error.message}`, 500));
  }
});

export const getUserOrders = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse('Accès non autorisé', 401));
  }
  
  const userId = req.user.id;
  const allOrders = await ordersDb.getAll();

  const userOrders = allOrders.filter(order => order.userId === userId);
  
  res.status(200).json({
    success: true,
    count: userOrders.length,
    data: userOrders
  });
});

export const getOrderById = asyncHandler(async (req, res, next) => {
  const orderId = req.params.id;
  const order = await ordersDb.getById(orderId);
  
  if (!order) {
    return next(new ErrorResponse(`Commande avec l'ID ${orderId} non trouvée`, 404));
  }

  if (req.user && order.userId !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Accès non autorisé à cette commande', 403));
  }
  
  res.status(200).json({
    success: true,
    data: order
  });
});

export const getAllOrders = asyncHandler(async (req, res, next) => {
  console.log('Requête getAllOrders reçue avec utilisateur:', JSON.stringify({
    id: req.user?.id,
    role: req.user?.role,
    email: req.user?.email
  }));

  if (!req.user || req.user.role !== 'admin') {
    console.log('Accès refusé - Utilisateur non admin:', req.user?.role);
    return next(new ErrorResponse('Accès non autorisé', 403));
  }
  
  const orders = await ordersDb.getAll();
  
  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

export const updateOrder = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ErrorResponse('Accès non autorisé', 403));
  }
  
  const orderId = req.params.id;
  const orderData = req.body;

  let existingOrder = await ordersDb.getById(orderId);
  if (!existingOrder) {
    return next(new ErrorResponse(`Commande avec l'ID ${orderId} non trouvée`, 404));
  }
  
  try {
    const updatedOrder = await ordersDb.update(orderId, {
      ...existingOrder,
      ...orderData,
      updatedAt: new Date().toISOString()
    });
    
    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    return next(new ErrorResponse(`Erreur lors de la mise à jour de la commande: ${error.message}`, 500));
  }
});

export const deleteOrder = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ErrorResponse('Accès non autorisé', 403));
  }
  
  const orderId = req.params.id;

  const existingOrder = await ordersDb.getById(orderId);
  if (!existingOrder) {
    return next(new ErrorResponse(`Commande avec l'ID ${orderId} non trouvée`, 404));
  }
  
  try {
    await ordersDb.delete(orderId);
    
    res.status(200).json({
      success: true,
      message: `Commande ${orderId} supprimée avec succès`
    });
  } catch (error) {
    return next(new ErrorResponse(`Erreur lors de la suppression de la commande: ${error.message}`, 500));
  }
});

// Fonction utilitaire pour générer un numéro de commande unique
const generateOrderNumber = () => {
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ML-${timestamp}${random}`;
};
