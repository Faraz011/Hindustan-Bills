import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import ScannedProduct from "../models/ScannedProduct.js";
import crypto from "crypto";

// Initialize shopping session
export const initializeSession = async (req, res) => {
  try {
    const userId = req.user.id;

    // Generate unique session code
    const sessionCode = crypto.randomBytes(4).toString("hex").toUpperCase();

    console.log(`🛒 Initializing session for user ${userId}: ${sessionCode}`);

    res.json({
      sessionCode,
      message: "Shopping session initialized successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Convert scanned products to cart
export const convertSessionToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionCode } = req.body;

    if (!sessionCode) {
      return res.status(400).json({ message: "Session code is required" });
    }

    // Get all active scanned products for this session
    const scannedProducts = await ScannedProduct.find({
      sessionCode,
      user: userId,
      isActive: true,
    }).populate("product");

    if (scannedProducts.length === 0) {
      return res.status(404).json({ message: "No products found in session" });
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Add scanned products to cart
    for (const scanned of scannedProducts) {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === scanned.product._id.toString()
      );

      if (existingItem) {
        existingItem.quantity += scanned.quantity;
      } else {
        cart.items.push({
          product: scanned.product._id,
          quantity: scanned.quantity,
        });
      }
    }

    await cart.save();
    await cart.populate("items.product");

    // Mark scanned products as processed (inactive)
    await ScannedProduct.updateMany(
      { sessionCode, user: userId, isActive: true },
      { isActive: false }
    );

    res.json({
      message: "Session converted to cart successfully",
      cart,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId)
      return res.status(400).json({ message: "productId is required" });
    if (quantity <= 0)
      return res.status(400).json({ message: "quantity must be >= 1" });

    // Ensure product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const idx = cart.items.findIndex((i) => i.product.toString() === productId);
    if (idx > -1) {
      cart.items[idx].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate("items.product");
    res.json({ message: "Item added to cart", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get cart for user
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    if (!productId)
      return res.status(400).json({ message: "productId is required" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    await cart.save();
    await cart.populate("items.product");
    res.json({ message: "Item removed from cart", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update quantity of cart item
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    if (!productId || quantity == null)
      return res
        .status(400)
        .json({ message: "productId and quantity required" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const idx = cart.items.findIndex((i) => i.product.toString() === productId);
    if (idx === -1)
      return res.status(404).json({ message: "Item not in cart" });

    if (quantity <= 0) {
      cart.items.splice(idx, 1); // remove item if quantity <= 0
    } else {
      cart.items[idx].quantity = quantity; // update quantity
    }

    await cart.save();
    await cart.populate("items.product");
    res.json({ message: "Cart updated", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
