import Product from "../models/Product.js";
import Shop from "../models/Shop.js";
import asyncHandler from "express-async-handler";

// @desc    Get all products for a shop
// @route   GET /api/products
// @access  Private
export const getProducts = asyncHandler(async (req, res) => {
  // Find the shop owned by the current user
  const shop = await Shop.findOne({ owner: req.user.id });
  if (!shop) {
    return res.status(404).json({ message: "Shop not found" });
  }

  const products = await Product.find({ shop: shop._id })
    .select("-__v")
    .sort({ createdAt: -1 })
    .lean();

  res.json(products);
});

// @desc    Create a new product
// @route   POST /api/products
// @access  Private
export const createProduct = asyncHandler(async (req, res) => {
  console.log(`Creating product for user ${req.user.id}`);

  // Find the shop owned by the current user
  const shop = await Shop.findOne({ owner: req.user.id });
  console.log(
    `Shop found for user ${req.user.id}:`,
    shop ? shop._id : "No shop found"
  );

  if (!shop) {
    return res.status(404).json({
      message: "Shop not found. Please complete your shop setup first.",
    });
  }

  const {
    name,
    description,
    price,
    category,
    stock,
    image,
    barcode,
    sku,
    dietaryInfo,
    preparationTime,
    isAvailable,
  } = req.body;

  // Validate required fields
  if (!name || !price) {
    return res.status(400).json({ message: "Name and price are required" });
  }

  const product = await Product.create({
    name,
    description,
    price,
    category: category || "other",
    stock: stock || 0,
    image: image || "/placeholder-product.png",
    shop: shop._id,
    metadata: {
      barcode: barcode && barcode.trim() !== "" ? barcode.trim() : undefined,
      sku: sku && sku.trim() !== "" ? sku.trim() : undefined,
    },
    dietaryInfo,
    preparationTime,
    isAvailable: isAvailable !== undefined ? isAvailable : true,
  });

  res.status(201).json(product);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
export const updateProduct = asyncHandler(async (req, res) => {
  // Find the shop owned by the current user
  const shop = await Shop.findOne({ owner: req.user.id });
  if (!shop) {
    return res.status(404).json({ message: "Shop not found" });
  }

  const product = await Product.findOne({
    _id: req.params.id,
    shop: shop._id,
  });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const {
    name,
    description,
    price,
    category,
    stock,
    image,
    barcode,
    sku,
    isActive,
    dietaryInfo,
    preparationTime,
    isAvailable,
  } = req.body;

  product.name = name || product.name;
  product.description = description || product.description;
  if (price !== undefined) product.price = price;
  if (category) product.category = category;
  if (stock !== undefined) product.stock = stock;
  if (image) product.image = image;
  if (isActive !== undefined) product.isActive = isActive;
  if (dietaryInfo !== undefined) product.dietaryInfo = dietaryInfo;
  if (preparationTime !== undefined) product.preparationTime = preparationTime;
  if (isAvailable !== undefined) product.isAvailable = isAvailable;

  // Update metadata
  const newBarcode = barcode !== undefined ? (barcode.trim() !== "" ? barcode.trim() : undefined) : product.metadata?.barcode;
  const newSku = sku !== undefined ? (sku.trim() !== "" ? sku.trim() : undefined) : product.metadata?.sku;

  product.metadata = {
    ...product.metadata,
    barcode: newBarcode,
    sku: newSku,
  };

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// @desc    Get products for a specific shop (for customers)
// @route   GET /api/products/shop/:shopId
// @access  Private
export const getProductsByShopId = asyncHandler(async (req, res) => {
  const { shopId } = req.params;

  const products = await Product.find({
    shop: shopId,
    isActive: true,
  })
    .select("-__v")
    .sort({ createdAt: -1 })
    .lean();

  res.json(products);
});

// @desc    Delete a product
// @route   DELETE /api/shop/products/:id
// @access  Private
export const deleteProduct = asyncHandler(async (req, res) => {
  // Find the shop owned by the current user
  const shop = await Shop.findOne({ owner: req.user.id });
  if (!shop) {
    return res.status(404).json({ message: "Shop not found" });
  }

  const product = await Product.findOneAndDelete({
    _id: req.params.id,
    shop: shop._id,
  });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({ message: "Product removed" });
});
