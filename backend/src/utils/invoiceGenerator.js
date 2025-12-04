import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

/**
 * Generates a PDF invoice for a given order.
 * @param {Object} order - The order object (populated with products).
 * @returns {Promise<string>} The local path of the generated PDF.
 */
export const generateInvoice = async (order) => {
  return new Promise((resolve, reject) => {
    try {
      // Create invoices directory if missing
      const invoiceDir = path.resolve("invoices");
      if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir);

      const invoicePath = path.join(invoiceDir, `invoice_${order._id}.pdf`);
      const doc = new PDFDocument({ margin: 50 });

      const stream = fs.createWriteStream(invoicePath);
      doc.pipe(stream);

      // --- HEADER ---
      doc
        .fontSize(22)
        .text("🧾 Hindustan Bills", { align: "center" })
        .moveDown(0.5);

      doc
        .fontSize(14)
        .text("Smart Retail Billing System", { align: "center" })
        .moveDown(1);

      doc.fontSize(12).text(`Invoice ID: ${order._id}`);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
      doc.text(`Status: ${order.status}`);
      doc.moveDown(1);

      // --- CUSTOMER INFO ---
      doc.text(`Customer ID: ${order.user}`, { align: "left" });
      doc.moveDown(1);

      // --- ORDER ITEMS ---
      doc.fontSize(14).text("Items Purchased:", { underline: true });
      doc.moveDown(0.5);

      order.items.forEach((item, index) => {
        const productName = item.product?.name || "Unknown Item";
        doc
          .fontSize(12)
          .text(
            `${index + 1}. ${productName} — ₹${item.price} x ${item.quantity}`
          );
      });

      doc.moveDown(1.5);
      doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .text(`Total Amount: ₹${order.totalAmount}`, { align: "right" });

      // --- FOOTER ---
      doc.moveDown(2);
      doc
        .font("Helvetica")
        .fontSize(10)
        .text("Thank you for shopping with Hindustan Bills!", {
          align: "center",
        });
      doc.text("Visit again soon!", { align: "center" });

      doc.end();

      stream.on("finish", () => resolve(invoicePath));
      stream.on("error", (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
};
