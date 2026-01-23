import Product from "../models/Product.js";
import ScannedProduct from "../models/ScannedProduct.js";
import asyncHandler from "express-async-handler";

// @desc    Scan product by barcode and add to session
// @route   POST /api/barcode/scan
// @access  Private
export const scanProduct = asyncHandler(async (req, res) => {
  const { barcode, sessionCode, quantity = 1, shopId } = req.body;
  const userId = req.user.id;

  // Validate inputs
  if (!barcode || !sessionCode || !shopId) {
    return res
      .status(400)
      .json({ message: "Barcode, session code, and shop ID are required" });
  }

  const barcodeTrimmed = String(barcode).trim();
  const barcodeAsNum = Number(barcodeTrimmed);

  const barcodeQuery = [
    { barcode: barcodeTrimmed },
    { "metadata.barcode": barcodeTrimmed },
    { "item code": barcodeTrimmed },
  ];

  if (!isNaN(barcodeAsNum)) {
    barcodeQuery.push({ barcode: barcodeAsNum });
    barcodeQuery.push({ "metadata.barcode": barcodeAsNum });
    barcodeQuery.push({ "item code": barcodeAsNum });
  }

  // Look up product in database - now filtered by shop
  const product = await Product.findOne({
    $and: [
      { $or: barcodeQuery },
      { shop: shopId },
      {
        $or: [
          { isActive: true },
          { isActive: { $exists: false } },
          { Status: "Continue" },
          { isAvailable: true },
          { is_available: true }
        ]
      }
    ]
  })
    .select(
      "_id barcode sku metadata.barcode metadata.sku \"item code\" name category price stock taxRate image description shop is_available isAvailable"
    )
    .populate("shop", "name")
    .lean();

  if (!product) {
    console.log(`❌ Barcode not found: ${barcode} in shop: ${shopId}`);
    return res.status(404).json({
      message: `Product with barcode ${barcode} not found in selected shop`,
      barcode: barcode,
      shopId: shopId,
    });
  }

  // Check stock before returning
  if (product.stock <= 0) {
    return res.status(409).json({
      message: "Product out of stock",
      product,
    });
  }

  // Check if product already scanned in this session
  let scannedProduct = await ScannedProduct.findOne({
    sessionCode,
    user: userId,
    product: product._id,
  });

  if (scannedProduct) {
    // Re-activate and update quantity
    scannedProduct.isActive = true;
    scannedProduct.quantity += quantity;
    await scannedProduct.save();
  } else {
    // Create new scanned product entry
    scannedProduct = new ScannedProduct({
      sessionCode,
      user: userId,
      product: product._id,
      quantity,
    });
    await scannedProduct.save();
  }

  // Populate product details
  await scannedProduct.populate("product");

  console.log(
    `✅ Product scanned: ${product.name} (Qty: ${scannedProduct.quantity})`
  );

  res.json({
    scannedProduct: {
      _id: scannedProduct._id,
      sessionCode: scannedProduct.sessionCode,
      product: {
        _id: product._id,
        barcode: product.barcode || product.metadata?.barcode,
        sku: product.sku || product.metadata?.sku,
        name: product.name,
        category: product.category,
        price: product.price,
        taxRate: product.taxRate,
        stock: product.stock,
        imageUrl: product.image,
        description: product.description,
        shop: product.shop,
      },
      quantity: scannedProduct.quantity,
      scannedAt: scannedProduct.scannedAt,
    },
    message: "Product scanned successfully",
  });
});

// @desc    Get scanned products for session
// @route   GET /api/barcode/session/:sessionCode
// @access  Private
export const getSessionProducts = asyncHandler(async (req, res) => {
  const { sessionCode } = req.params;
  const userId = req.user.id;

  const scannedProducts = await ScannedProduct.find({
    sessionCode,
    user: userId,
    isActive: true,
  }).populate("product");

  const formattedProducts = scannedProducts.map((item) => ({
    _id: item._id,
    sessionCode: item.sessionCode,
    product: {
      _id: item.product._id,
      barcode: item.product.barcode || item.product.metadata?.barcode,
      sku: item.product.sku || item.product.metadata?.sku,
      name: item.product.name,
      category: item.product.category,
      price: item.product.price,
      taxRate: item.product.taxRate,
      stock: item.product.stock,
      imageUrl: item.product.imageUrl,
      description: item.product.description,
    },
    quantity: item.quantity,
    scannedAt: item.scannedAt,
  }));

  res.json({
    sessionCode,
    products: formattedProducts,
    totalItems: formattedProducts.length,
  });
});

// @desc    Update scanned product quantity
// @route   PUT /api/barcode/session/:sessionCode/:scannedProductId
// @access  Private
export const updateScannedProduct = asyncHandler(async (req, res) => {
  const { sessionCode, scannedProductId } = req.params;
  const { quantity } = req.body;
  const userId = req.user.id;

  if (quantity <= 0) {
    return res.status(400).json({ message: "Quantity must be greater than 0" });
  }

  const scannedProduct = await ScannedProduct.findOne({
    _id: scannedProductId,
    sessionCode,
    user: userId,
    isActive: true,
  });

  if (!scannedProduct) {
    return res.status(404).json({ message: "Scanned product not found" });
  }

  scannedProduct.quantity = quantity;
  await scannedProduct.save();
  await scannedProduct.populate("product");

  res.json({
    scannedProduct: {
      _id: scannedProduct._id,
      sessionCode: scannedProduct.sessionCode,
      product: scannedProduct.product,
      quantity: scannedProduct.quantity,
      scannedAt: scannedProduct.scannedAt,
    },
    message: "Quantity updated successfully",
  });
});

// @desc    Remove scanned product from session
// @route   DELETE /api/barcode/session/:sessionCode/:scannedProductId
// @access  Private
export const removeScannedProduct = asyncHandler(async (req, res) => {
  const { sessionCode, scannedProductId } = req.params;
  const userId = req.user.id;

  console.log(
    `🗑️ Removing scanned product ${scannedProductId} from session ${sessionCode} for user ${userId}`
  );

  const scannedProduct = await ScannedProduct.findOne({
    _id: scannedProductId,
    sessionCode,
    user: userId,
    isActive: true,
  });

  console.log(`Found scanned product:`, scannedProduct);

  if (!scannedProduct) {
    console.log(
      `❌ Scanned product not found for session ${sessionCode}, user ${userId}, scannedProductId ${scannedProductId}`
    );
    return res.status(404).json({ message: "Scanned product not found" });
  }

  scannedProduct.isActive = false;
  await scannedProduct.save();

  console.log(`✅ Product removed from session successfully`);
  res.json({ message: "Product removed from session successfully" });
});

// @desc    Clear session (mark all as inactive)
// @route   DELETE /api/barcode/session/:sessionCode
// @access  Private
export const clearSession = asyncHandler(async (req, res) => {
  const { sessionCode } = req.params;
  const userId = req.user.id;

  await ScannedProduct.updateMany(
    { sessionCode, user: userId, isActive: true },
    { isActive: false }
  );

  res.json({ message: "Session cleared successfully" });
});

// @desc    Scan product by barcode
// @route   GET /api/products/scan/:barcode
// @access  Private
export const scanProductByBarcode = asyncHandler(async (req, res) => {
  const { barcode } = req.params;
  const { shopId } = req.query;

  // Validate barcode format
  if (!barcode || String(barcode).trim().length === 0) {
    return res.status(400).json({ message: "Invalid barcode format" });
  }

  const barcodeTrimmed = String(barcode).trim();
  const barcodeAsNum = Number(barcodeTrimmed);

  const barcodeQuery = [
    { barcode: barcodeTrimmed },
    { "metadata.barcode": barcodeTrimmed },
    { "item code": barcodeTrimmed }
  ];

  if (!isNaN(barcodeAsNum)) {
    barcodeQuery.push({ barcode: barcodeAsNum });
    barcodeQuery.push({ "metadata.barcode": barcodeAsNum });
    barcodeQuery.push({ "item code": barcodeAsNum });
  }

  // Build query - filter by shop if provided
  const queryAnd = [
    { $or: barcodeQuery }
  ];

  if (shopId) {
    queryAnd.push({ shop: shopId });
  }

  // Status/Availability filter - being extra lenient
  queryAnd.push({
    $or: [
      { isActive: true },
      { isActive: { $exists: false } },
      { Status: "Continue" },
      { isAvailable: true },
      { is_available: true }
    ]
  });

  const query = { $and: queryAnd };

  // Look up product in database
  const product = await Product.findOne(query)
    .select(
      "_id barcode sku metadata.barcode metadata.sku \"item code\" name category price stock taxRate image shop is_available isAvailable"
    )
    .populate("shop", "name")
    .lean(); // Use .lean() for faster read-only queries

  if (!product) {
    console.log(
      `❌ Barcode not found: ${barcode}${shopId ? ` in shop: ${shopId}` : ""}`
    );
    return res.status(404).json({
      message: `Product with barcode ${barcode} not found${
        shopId ? " in selected shop" : ""
      }`,
      barcode: barcode,
    });
  }

  // Check stock before returning
  if (product.stock <= 0) {
    return res.status(409).json({
      message: "Product out of stock",
      product,
    });
  }

  console.log(`✅ Product found: ${product.name}`);

  res.json({
    _id: product._id,
    barcode: product.barcode || product.metadata?.barcode,
    sku: product.sku || product.metadata?.sku,
    name: product.name,
    category: product.category,
    price: product.price,
    taxRate: product.taxRate,
    stock: product.stock,
    imageUrl: product.image,
    description: product.description,
  });
});

// @desc    Add product to cart by product ID (for menu ordering)
// @route   POST /api/barcode/add-by-id
// @access  Private
export const addProductById = asyncHandler(async (req, res) => {
  const { productId, sessionCode, quantity = 1, shopId } = req.body;
  const userId = req.user.id;

  // Validate inputs
  if (!productId || !sessionCode || !shopId) {
    return res
      .status(400)
      .json({ message: "Product ID, session code, and shop ID are required" });
  }

  console.log(
    `🔍 Adding product by ID: ${productId} for session: ${sessionCode} in shop: ${shopId}`
  );

  const product = await Product.findOne({
    _id: productId,
    shop: shopId,
    $or: [
      { isActive: true },
      { isActive: { $exists: false } },
      { Status: "Continue" }
    ]
  })
    .select(
      "_id barcode sku metadata.barcode metadata.sku \"item code\" name category price stock taxRate image description shop is_available isAvailable"
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

  // Check stock before returning
  if (product.stock <= 0) {
    return res.status(409).json({
      message: "Product out of stock",
      product,
    });
  }

  // Check if product already scanned in this session
  let scannedProduct = await ScannedProduct.findOne({
    sessionCode,
    user: userId,
    product: product._id,
  });

  if (scannedProduct) {
    // Re-activate and update quantity
    scannedProduct.isActive = true;
    scannedProduct.quantity += quantity;
    await scannedProduct.save();
  } else {
    // Create new scanned product entry
    scannedProduct = new ScannedProduct({
      sessionCode,
      user: userId,
      product: product._id,
      quantity,
    });
    await scannedProduct.save();
  }

  // Populate product details
  await scannedProduct.populate("product");

  console.log(
    `✅ Product added: ${product.name} (Qty: ${scannedProduct.quantity})`
  );

  res.json({
    scannedProduct: {
      _id: scannedProduct._id,
      sessionCode: scannedProduct.sessionCode,
      product: {
        _id: product._id,
        barcode: product.barcode || product.metadata?.barcode,
        sku: product.sku || product.metadata?.sku,
        name: product.name,
        category: product.category,
        price: product.price,
        taxRate: product.taxRate,
        stock: product.stock,
        imageUrl: product.image,
        description: product.description,
        shop: product.shop,
      },
      quantity: scannedProduct.quantity,
      scannedAt: scannedProduct.scannedAt,
    },
    message: "Product added to cart successfully",
  });
});

// @desc    Search products by keyword
// @route   GET /api/products/search?q=keyword
// @access  Private
export const searchProducts = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: "Search query required" });
  }

  const products = await Product.find({
    $or: [
      { name: { $regex: q, $options: "i" } },
      { barcode: { $regex: q, $options: "i" } },
      { "metadata.barcode": { $regex: q, $options: "i" } },
      { "item code": { $regex: q, $options: "i" } },
      { sku: { $regex: q, $options: "i" } },
      { "metadata.sku": { $regex: q, $options: "i" } },
    ],
  })
    .limit(10)
    .lean();

  res.json(products);
});
