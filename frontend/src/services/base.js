import axios from "axios"

// In dev the Vite proxy forwards /api to the backend (see vite.config.ts),
// which keeps requests same-origin regardless of the dev server port.
export const API = import.meta.env.DEV ? "/api" : "http://localhost:8080/api"

// Attaches the Cognito access token when a session exists. Imported lazily so
// modules that use base() don't force Amplify to load before configuration.
async function currentAccessToken() {
  try {
    const { fetchAuthSession } = await import("aws-amplify/auth")
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
