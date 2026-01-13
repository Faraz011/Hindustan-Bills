import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import asyncHandler from "express-async-handler";

export const getOrderHistory = asyncHandler(async (req, res) => {
  console.log("getOrderHistory called for user:", req.user);

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const { status, startDate, endDate } = req.query;
  console.log("Query params:", { status, startDate, endDate });

  let query = { customer: req.user.id };
  console.log("Base query:", query);

  if (status) {
    query.status = status;
  }

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
});


export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ shop: req.user.shop })
    .populate("customer", "name email")
    .populate("items.product", "name price")
    .sort({ createdAt: -1 })
    .lean();

  res.json(orders);
});


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
// @route   PUT /api/orders/:id/status
// @access  Private
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  // Find the shop owned by this user (for retailers)
  let shopFilter = {};
  if (req.user.role === 'retailer') {
    const Shop = await import("../models/Shop.js").then(m => m.default);
    const shop = await Shop.findOne({ owner: req.user.id });
    if (!shop) {
      res.status(404);
      throw new Error("Shop not found");
    }
    shopFilter = { shop: shop._id };
  } else {
    // For customers, use the shop field from user if available
    shopFilter = req.user.shop ? { shop: req.user.shop } : {};
  }

  const order = await Order.findOne({
    _id: req.params.id,
    ...shopFilter,
  });

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.status = status;
  const updatedOrder = await order.save();

  res.json(updatedOrder);
});


export const createOrderFromCart = asyncHandler(async (req, res) => {
  const { upiId } = req.body;
  const userId = req.user.id;

  // Find user's cart
  const cart = await Cart.findOne({ user: userId }).populate({
    path: "items.product",
    select: "_id name price shop stock",
    populate: {
      path: "shop",
      select: "name",
    },
  });

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("Cart is empty");
  }


  if (!upiId || !upiId.includes("@")) {
    res.status(400);
    throw new Error("Valid UPI ID is required");
  }


  const shopId = cart.items[0].product.shop._id;


  let subtotal = 0;
  const orderItems = [];

  for (const item of cart.items) {
    const product = item.product;

    if (product.shop._id.toString() !== shopId.toString()) {
      res.status(400);
      throw new Error("All items must be from the same shop");
    }


    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price,
      total: itemTotal,
    });
  }

  const tax = 0;
  const total = subtotal;

  const orderCount = await Order.countDocuments();
  const orderNumber = `ORD${orderCount.toString().padStart(5, "0")}`;

  const order = new Order({
    orderNumber,
    customer: userId,
    shop: shopId,
    items: orderItems,
    subtotal,
    tax,
    total,
    payment: {
      status: "paid",
      method: "UPI",
      transactionId: `UPI_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      amount: total,
      currency: "INR",
    },
  });

  // Update product stock
  for (const item of cart.items) {
    await Product.updateOne(
      { _id: item.product._id },
      { $inc: { stock: -item.quantity } }
    );
  }

 
  await Cart.findOneAndDelete({ user: userId });

  const createdOrder = await order.save();

  
  await createdOrder.populate([
    { path: "customer", select: "name email" },
    { path: "shop", select: "name" },
    { path: "items.product", select: "name price" },
  ]);

  res.status(201).json({
    order: createdOrder,
    message: "Order created successfully",
  });
});
