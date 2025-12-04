import { Resend } from "resend";
import fs from "fs";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send invoice email to customer
 * @param {string} to - Customer email
 * @param {string} orderId - Order ID
 * @param {string} invoicePath - Local path to invoice PDF
 */
export const sendInvoiceEmail = async (to, orderId, invoicePath) => {
  try {
    const invoiceData = fs.readFileSync(invoicePath);

    await resend.emails.send({
      from: "Hindustan Bills <onboarding@resend.dev>",
      to,
      subject: `Invoice for your order #${orderId}`,
      html: `<p>Thank you for shopping with <b>Hindustan Bills</b>!</p>
             <p>Your invoice for order <b>${orderId}</b> is attached below.</p>`,
      attachments: [
        {
          filename: `invoice_${orderId}.pdf`,
          content: invoiceData.toString("base64"),
        },
      ],
    });

    console.log(`📧 Invoice email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email send error:", err.message);
  }
};
