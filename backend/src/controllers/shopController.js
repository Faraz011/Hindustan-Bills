import Shop from "../models/Shop.js";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

// @desc    Get shop details
// @route   GET /api/shop/details
// @access  Private
export const getShopDetails = asyncHandler(async (req, res) => {
  console.log("getShopDetails called with user ID:", req.user.id);
  const shop = await Shop.findOne({ owner: req.user.id }).select("-__v").lean();

  console.log("Shop found:", shop ? "Yes" : "No");
  if (shop) {
    console.log("Shop data:", JSON.stringify(shop, null, 2));
  }

  if (!shop) {
    console.log("Returning 404 - shop not found");
    return res.status(404).json({ message: "Shop not found" });
  }

  console.log("Returning shop data");
  res.json(shop);
});

// @desc    Create or update shop details
// @route   PUT /api/shop/details
// @access  Private
export const updateShopDetails = asyncHandler(async (req, res) => {
  console.log("updateShopDetails called with user ID:", req.user.id);
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  const { name, address, businessType, metadata, isActive } = req.body;

  const { gstNumber, fssaiLicense } = metadata || {};

  let shop = await Shop.findOne({ owner: req.user.id });
  console.log("Existing shop found:", shop ? "Yes" : "No");

  if (!shop) {
    console.log("Creating new shop...");
    // Create new shop if it doesn't exist
    shop = new Shop({
      owner: req.user.id,
      name,
      address: {
        ...address,
        coordinates: {
          type: "Point",
          coordinates: [0, 0], // Default coordinates, can be updated later with actual location
        },
      },
      businessType: businessType || "retail",
      metadata: {
        gstNumber,
        fssaiLicense,
      },
      isActive: isActive !== undefined ? isActive : true,
    });
  } else {
    console.log("Updating existing shop...");
    // Update existing shop
    shop.name = name || shop.name;
    if (address) {
      shop.address.street = address.street || shop.address.street;
      shop.address.city = address.city || shop.address.city;
      shop.address.state = address.state || shop.address.state;
      shop.address.pincode = address.pincode || shop.address.pincode;
      shop.address.country = address.country || shop.address.country;
      // Preserve existing coordinates if they exist
      if (!shop.address.coordinates) {
        shop.address.coordinates = {
          type: "Point",
          coordinates: [0, 0],
        };
      }
    }
    shop.businessType = businessType || shop.businessType;
    shop.metadata = {
      gstNumber: gstNumber || shop.metadata?.gstNumber,
      fssaiLicense: fssaiLicense || shop.metadata?.fssaiLicense,
    };
    if (typeof isActive !== "undefined") {
      shop.isActive = isActive;
    }
  }

  console.log("Saving shop...");
  const savedShop = await shop.save();
  console.log("Shop saved successfully");
  res.json(savedShop);
});

// @desc    Get shop products
// @route   GET /api/shop/products
// @access  Private
export const getProducts = asyncHandler(async (req, res) => {
  // First find the shop owned by this user
  const shop = await Shop.findOne({ owner: req.user.id });
  if (!shop) {
    return res.status(404).json({ message: "Shop not found" });
  }

  const products = await Product.find({ shop: shop._id }).select("-__v").lean();
  res.json(products);
});

// @desc    Get shop orders
// @route   GET /api/shop/orders
// @access  Private
export const getOrders = asyncHandler(async (req, res) => {
  // First find the shop owned by this user
  const shop = await Shop.findOne({ owner: req.user.id });
  if (!shop) {
    return res.status(404).json({ message: "Shop not found" });
  }

  const orders = await Order.find({ shop: shop._id })
    .populate("products.product", "name price")
    .select("-__v")
    .lean();
  res.json(orders);
});

// @desc    Get all available shops for customers
// @route   GET /api/shop/available
// @access  Private (customers)
export const getAvailableShops = asyncHandler(async (req, res) => {
  const shops = await Shop.find({ isActive: true })
    .select("name businessType address contact businessHours metadata")
    .populate("owner", "name email")
    .lean();

  // Filter out shops where owner is null (owner doesn't exist in database)
  const validShops = shops.filter((shop) => shop.owner !== null);

  res.json({
    shops: validShops,
    count: validShops.length,
  });
});
