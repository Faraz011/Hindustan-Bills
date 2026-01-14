import axios from 'axios';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

/**
 * Send order notification to retailer via Telegram
 * @param {string} chatId - Retailer's Telegram chat ID
 * @param {object} orderDetails - Order information
 */
export const sendOrderNotification = async (chatId, orderDetails) => {
  if (!BOT_TOKEN) {
    console.warn(' TELEGRAM_BOT_TOKEN not configured');
    return;
  }

  if (!chatId) {
    console.warn(' No Telegram chat ID configured for this shop');
    return;
  }

  const { orderNumber, tableNumber, items, total, customerName } = orderDetails;
  
  const message = `
🔔 *New Order Alert!*

📋 Order: \`${orderNumber}\`
🪑 Table: *${tableNumber || 'N/A'}*
👤 Customer: ${customerName || 'Guest'}
📦 Items: ${items.length}
💰 Total: *₹${total.toFixed(2)}*

✅ Payment confirmed by customer
⏰ ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}

_Please prepare the order_
  `.trim();

  try {
    const response = await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown'
    });

    if (response.data.ok) {
      console.log('✅ Telegram notification sent successfully');
    } else {
      console.error('❌ Telegram API error:', response.data);
    }
  } catch (error) {
    console.error('❌ Failed to send Telegram notification:', error.message);
    // Don't throw error - notification failure shouldn't break order creation
  }
};

/**
 * Send a test message to verify Telegram setup
 * @param {string} chatId - Chat ID to test
 */
export const sendTestMessage = async (chatId) => {
  if (!BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN not configured');
  }

  const message = `
✅ *Telegram Setup Successful!*

Your Hindustan Bills notification system is ready.

You will receive order alerts here when customers complete payment.
  `.trim();

  try {
    const response = await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown'
    });

    return response.data.ok;
  } catch (error) {
    throw new Error(`Failed to send test message: ${error.message}`);
  }
};
