import axios from "axios"
import { fetchAuthSession } from "aws-amplify/auth"

// In development, Vite forwards /api to the local backend. In deployed builds,
// use the public API URL supplied by the host (for example, Railway).
const deployedApiOrigin = import.meta.env.VITE_API_URL?.replace(/\/+$/, "")

export const API = import.meta.env.DEV
  ? "/api"
  : `${deployedApiOrigin || "http://localhost:8080"}/api`

// Attaches the Cognito access token when a session exists.
async function currentAccessToken() {
  try {
    const session = await fetchAuthSession()
    return session?.tokens?.accessToken?.toString() ?? null
  } catch {
    return null
  }
}

export async function base(endpoint, options = {}) {
  const headers = { ...(options.headers ?? {}) }
  if (!headers.Authorization) {
    const token = await currentAccessToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  try {
    const response = await axios({
      url: `${API}/${endpoint}`,
      method: options.method || "GET",
      data: options.data,
      responseType: options.responseType,
      headers,
    })

    return response.data
  } catch (error) {
    console.error(
        `API request failed: ${options.method || "GET"} /${endpoint}`,
        error.response?.data || error.message
    )

    throw error
  }
}
