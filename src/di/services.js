
const baseUrl = 'http://localhost:8000'

// TODO also defined in stores/TokenStore.js

const KEY_PREFIX = "TRACKABLE_"
const KEY_BEARER_TOKEN = KEY_PREFIX + 'authToken';

// --- Service ---
export const defaultAPIConfiguration = {
  baseUrl: baseUrl,
  httpClient: fetch,
  tokenProvider: () => localStorage.getItem(KEY_BEARER_TOKEN),
  fnError: async (owner, message, response) => {
    const status = response.status;
    const body = await response.text();
    console.error(owner, message, status, body);
    throw new Error(`${owner}: ${message} (${status}): ${body}`);
  }
};
