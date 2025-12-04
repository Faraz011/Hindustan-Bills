// add this near the bottom of backend/src/utils/emailService.js

/**
 * sendInvoiceEmail(invoiceData)
 * Small wrapper used by paymentController (so import('sendInvoiceEmail') works).
 * Adapt the template/fields to match what paymentController expects.
 *
 * invoiceData example:
 *   { to, invoiceNumber, amount, htmlBody, textBody }
 */
export async function sendInvoiceEmail(invoiceData = {}) {
  const { to, invoiceNumber, amount, htmlBody, textBody } = invoiceData;

  // If htmlBody/textBody provided by caller, use them, otherwise build a small default template
  const html = htmlBody || `<p>Hi,</p>
    <p>Your invoice <strong>#${invoiceNumber}</strong> for ₹${amount} is attached/available.</p>
    <p>Thanks,<br/>Hindustan Bills</p>`;

  const text = textBody || `Hi,\nYour invoice #${invoiceNumber} for ₹${amount} is available.\n\nThanks,\nHindustan Bills`;

  // call the generic sendEmail so the logic stays in one place
  return await sendEmail({
    to,
    subject: `Your invoice #${invoiceNumber}`,
    html,
    text,
  });
}
