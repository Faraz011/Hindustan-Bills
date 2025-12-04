import Product from "../models/Product.js";

//Add a new product (retailer only)
export const addProduct = async (req, res) => {
  try {
    const { name, price, barcode } = req.body;

    if (!name || !price || !barcode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await Product.create({
      name,
      price,
      barcode,
      addedBy: req.user.id, // store which retailer added it
    });

    res.status(201).json({ message: "Product added successfully", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Get all products (public)
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Get product by barcode (public)
export const getProductByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;

    const product = await Product.findOne({ barcode });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Update a product (retailer only)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, barcode } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    //Only the retailer who added the product can update it
    if (product.addedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this product" });
    }

    if (name) product.name = name;
    if (price) product.price = price;
    if (barcode) product.barcode = barcode;

    await product.save();

    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Delete a product (retailer only)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Only the retailer who added the product can delete it
    if (product.addedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this product" });
    }

    await Product.findByIdAndDelete(id);

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
