import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Place a new order (from cart)
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const items = cart.items.map(i => {
      if (!i.product) throw new Error("Product not found in DB (cart item)");
      return {
        product: i.product._id,
        quantity: i.quantity,
        price: i.product.price
      };
    });

    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const order = await Order.create({
      user: userId,
      items,
      totalAmount,
      status: "pending"
    });

    // Clear the cart
    cart.items = [];
    await cart.save();

    await order.populate("items.product");
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all orders of the logged-in user
export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update order status (retailer/admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    await order.populate("items.product");
    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ New: Get order history with optional filters (status, date range)
export const getOrdersHistory = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    let filter = {};

    // Customers see only their orders
    if (req.user.role === "customer") filter.user = req.user.id;

    // Optional status filter
    if (status) filter.status = status;

    // Optional date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(filter)
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
