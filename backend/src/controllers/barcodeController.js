import Product from "../models/Product.js";

// Controller: verify barcode
export const verifyBarcode = async (req, res) => {
    try {
        const { barcode } = req.body;

        if (!barcode) {
            return res.status(400).json({ message: "Barcode is required" });
        }

        // Search product by barcode
        const product = await Product.findOne({ barcode });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({
            message: "Product found",
            product,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
