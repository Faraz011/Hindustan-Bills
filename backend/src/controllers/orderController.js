import Order from "../models/Order.js";
import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";

// @desc    Get order history for current customer
// @route   GET /api/orders/history
// @access  Private
export const getOrderHistory = asyncHandler(async (req, res) => {
  console.log("getOrderHistory called for user:", req.user);

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const { status, startDate, endDate } = req.query;
  console.log("Query params:", { status, startDate, endDate });

  let query = { customer: req.user.id };
  console.log("Base query:", query);

  // Add status filter if provided
  if (status) {
    query.status = status;
  }

  // Add date range filter if provided
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {
      const start = new Date(startDate);
      if (!isNaN(start.getTime())) {
        query.createdAt.$gte = start;
      }
    }
    if (endDate) {
      const end = new Date(endDate);
      if (!isNaN(end.getTime())) {
        query.createdAt.$lte = end;
      }
    }
  }

  console.log("Final query:", query);

  const orders = await Order.find(query)
    .populate("shop", "name businessType address")
    .populate("items.product", "name price")
    .sort({ createdAt: -1 })
    .lean();

  console.log("Found orders:", orders.length);

  res.json({ orders });

  res.json({ orders });
});

// @desc    Get all orders for a shop
// @route   GET /api/shop/orders
// @access  Private
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ shop: req.user.shop })
    .populate("customer", "name email")
    .populate("items.product", "name price")
    .sort({ createdAt: -1 })
    .lean();

  res.json(orders);
});

// @desc    Get single order
// @route   GET /api/shop/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    shop: req.user.shop,
  })
    .populate("customer", "name email")
    .populate("items.product", "name price")
    .lean();

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json(order);
});

// @desc    Create new order
// @route   POST /api/shop/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const { items, customer, shippingAddress, payment } = req.body;

  // Calculate order totals
  let subtotal = 0;
  const orderItems = [];

  // Validate products and calculate totals
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(400);
      throw new Error(`Product ${item.product} not found`);
    }

    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Not enough stock for ${product.name}`);
    }

    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;

    orderItems.push({
      product: product._id,
      name: product.name,
      quantity: item.quantity,
      price: product.price,
      total: itemTotal,
    });
  }

  // Calculate tax (example: 18% GST)
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  // Create order
  const order = new Order({
    customer,
    shop: req.user.shop,
    items: orderItems,
    subtotal,
    tax,
    total,
    shippingAddress,
    payment: {
      ...payment,
      amount: total,
    },
  });

  // Update product stock
  for (const item of items) {
    await Product.updateOne(
      { _id: item.product },
      { $inc: { stock: -item.quantity } }
    );
  }

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc    Update order status
// @route   PUT /api/shop/orders/:id/status
// @access  Private
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findOne({
    _id: req.params.id,
    shop: req.user.shop,
  });

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.status = status;
  const updatedOrder = await order.save();

  res.json(updatedOrder);
});
