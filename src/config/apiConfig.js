

const API_URL_PRODUCTIVE = "productive"
const API_URL_DEVELOPMENT = "development"

const API_URLS = {
  [API_URL_PRODUCTIVE]: {
    name: 'Productive',
    baseUrl: 'http://localhost:8000' // 7000
  },
  [API_URL_DEVELOPMENT]: {
    name: 'Development',
    baseUrl: 'http://localhost:8000' // 9000
  },
}

const STORAGE_KEY_API_ENVIRONMENT = "trackables.api.environment"

export function getApiEnvironment() {
  return localStorage.getItem(STORAGE_KEY_API_ENVIRONMENT) ?? API_URL_PRODUCTIVE
}

export function setApiEnvironment(env) {
  localStorage.setItem(STORAGE_KEY_API_ENVIRONMENT, env)
}

export function getApiBaseUrl() {
  console.log("API config:", getApiEnvironment(), "with BaseURL", API_URLS[getApiEnvironment()].baseUrl)
  return API_URLS[getApiEnvironment()].baseUrl
}
