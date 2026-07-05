import axios from "axios"

// In dev the Vite proxy forwards /api to the backend (see vite.config.ts),
// which keeps requests same-origin regardless of the dev server port.
export const API = import.meta.env.DEV ? "/api" : "http://localhost:8080/api"

export async function base(endpoint, options = {}) {
  try {
    const response = await axios({
      url: `${API}/${endpoint}`,
      method: options.method || "GET",
      data: options.data,
      responseType: options.responseType,
      headers: options.headers,
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