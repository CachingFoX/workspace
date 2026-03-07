
export const API_ENVIRONMENT = {
  PRODUCTIVE: "productive",
  DEVELOPMENT: "development"
}

const API_ENVIRONMENT_CONFIGURATIONS = {
  [API_ENVIRONMENT.PRODUCTIVE]: {
    name: 'Productive',
    baseUrl: 'http://localhost:8000' // 7000
  },
  [API_ENVIRONMENT.DEVELOPMENT]: {
    name: 'Development',
    baseUrl: 'http://localhost:8000' // 9000
  },
}

const STORAGE_KEY_API_ENVIRONMENT = "trackables.api.environment"

export function getApiEnvironment() {
  return localStorage.getItem(STORAGE_KEY_API_ENVIRONMENT) ?? API_ENVIRONMENT.PRODUCTIVE
}

export function setApiEnvironment(env) {
  localStorage.setItem(STORAGE_KEY_API_ENVIRONMENT, env)
}

export function getApiBaseUrl() {
  console.log("API config:", getApiEnvironment(), "with BaseURL", API_ENVIRONMENT_CONFIGURATIONS[getApiEnvironment()].baseUrl)
  return API_ENVIRONMENT_CONFIGURATIONS[getApiEnvironment()].baseUrl
}
