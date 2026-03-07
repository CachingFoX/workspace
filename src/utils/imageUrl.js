import { getApiBaseUrl } from "@/config/apiConfig"

export function imageUrl(path) {
  return `${getApiBaseUrl()}/images/${path}`
}
