import https from 'node:https';

/**
 * Pings the server periodically to prevent Render from spinning down the free tier.
 * @param {string} url - The base URL of the backend (e.g. from process.env.BACKEND_URL)
 */
export const startKeepAlive = (url) => {
  if (!url) {
    console.warn("No BACKEND_URL provided. Keep-alive disabled.");
    return;
  }

  const interval = 14 * 60 * 1000;

  console.log(`Health keep-alive started for ${url}`);

  setInterval(() => {
    https.get(`${url}/api/health`, (res) => {
      console.log(`Self-ping success: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error(`Self-ping failed: ${err.message}`);
    });
  }, interval);
};
