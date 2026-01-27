
const baseUrl = 'http://localhost:8000'

// --- Service ---
export const defaultAPIConfiguration = {
  baseUrl: baseUrl,
  httpClient: fetch,
  tokenProvider: () => localStorage.getItem('token'),
};
