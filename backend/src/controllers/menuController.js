import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import asyncHandler from "express-async-handler";

// @desc    Add product to cart from menu
// @route   POST /api/menu/add-to-cart
// @access  Private
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user.id;

  // Validate inputs
  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  console.log(`🔍 Adding product to cart: ${productId} for user: ${userId}`);

  // Get selected shop from request body or headers
  const shopId = req.body.shopId || req.headers["x-selected-shop"];
  if (!shopId) {
    return res.status(400).json({ message: "Selected shop is required" });
  }

  // Look up product in database - filtered by shop
  const product = await Product.findOne({
    _id: productId,
    shop: shopId,
    isActive: true,
  })
    .select(
      "_id metadata.barcode metadata.sku name category price stock taxRate image description shop"
    )
    .populate("shop", "name")
    .lean();

  if (!product) {
    console.log(`❌ Product not found: ${productId} in shop: ${shopId}`);
    return res.status(404).json({
      message: `Product not found in selected shop`,
      productId: productId,
      shopId: shopId,
    });
  }

  // Find or create user's cart
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({
      user: userId,
      items: [],
    });
  }

  // Check if product already exists in cart
  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (existingItemIndex > -1) {
    // Update quantity if item already exists
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item to cart
    cart.items.push({
      product: productId,
      quantity: quantity,
    });
  }

  // Save the cart
  await cart.save();

  console.log(`✅ Product added to cart: ${product.name} (Qty: ${quantity})`);

  res.json({
    product: {
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity: quantity,
    },
    message: "Product added to cart successfully",
  });
});


export const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Find user's cart and populate product details
  const cart = await Cart.findOne({ user: userId }).populate({
    path: "items.product",
    select: "_id name price image category description",
    populate: {
      path: "shop",
      select: "name",
    },
  });

  if (!cart) {
    return res.json({
      items: [],
      total: 0,
      subtotal: 0,
      tax: 0,
    });
  }


  let subtotal = 0;
  let tax = 0; 

  const items = cart.items.map((item) => {
    const product = item.product;
    const itemSubtotal = product.price * item.quantity;
    const itemTax = 0; 

    subtotal += itemSubtotal;
    tax += itemTax;

    return {
      _id: item._id,
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.image,
      description: product.description,
      total: itemSubtotal + itemTax,
    };
  });

  const total = subtotal; 

  res.json({
    items,
    subtotal,
    tax,
    total,
  });
});


export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const userId = req.user.id;

  if (quantity < 1) {
    return res.status(400).json({ message: "Quantity must be at least 1" });
  }

  // Find user's cart
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  // Find the item in cart
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  // Update quantity
  cart.items[itemIndex].quantity = quantity;

  // Save the cart
  await cart.save();

  res.json({
    message: "Cart item updated successfully",
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/menu/cart/:productId
// @access  Private
export const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  // Find user's cart
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  // Find the item in cart
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  // Remove the item from cart
  cart.items.splice(itemIndex, 1);

  // Save the cart
  await cart.save();

  res.json({
    message: "Item removed from cart successfully",
  });
});
