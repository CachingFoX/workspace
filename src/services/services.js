
const baseUrl = 'http://localhost:8000'

// --- Service ---
export const defaultAPIConfiguration = {
  baseUrl: baseUrl,
  httpClient: fetch,
  tokenProvider: () => localStorage.getItem('token'),
  fnError: async (owner, message, response) => {
    const status = response.status;
    const body = await response.text();
    console.error(owner, message, status, body);
    throw new Error(`${owner}: ${message} (${status}): ${body}`);
  }
};
