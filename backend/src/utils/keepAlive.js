import https from 'node:https';
import http from 'node:http';

/**
 
 * @param {string} url
 */
export const startKeepAlive = (url) => {
  if (!url) {
    console.warn("No BACKEND_URL provided. Keep-alive disabled.");
    return;
  }

  const interval = 14 * 60 * 1000;
  const protocol = url.startsWith('https') ? https : http;

  console.log(`Health keep-alive started for ${url}`);

  setInterval(() => {
    protocol.get(`${url}/api/health`, (res) => {
      console.log(`Self-ping success: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error(`Self-ping failed: ${err.message}`);
    });
  }, interval);
};
