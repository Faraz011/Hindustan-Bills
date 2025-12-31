import express from "express";
import Receipt from "../models/Receipt.js";
import generateQR from "../utils/qr.js";

const router = express.Router();

// CUSTOMER CHECKOUT
router.post("/checkout", async (req, res) => {
  try {
    const { items } = req.body;

    const totalAmount = items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    const receipt = await Receipt.create({
      items,
      totalAmount,
    });

    const qr = await generateQR(
      `${process.env.FRONTEND_URL}/receipt/${receipt._id}`
    );

    res.json({
      receiptId: receipt._id,
      totalAmount,
      qr,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Checkout failed" });
  }
});

// RETAILER VIEW RECEIPT (QR scan)
router.get("/receipt/:id", async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found" });
    }
    res.json(receipt);
  } catch (err) {
    res.status(500).json({ error: "Error fetching receipt" });
  }
});

export default router;
