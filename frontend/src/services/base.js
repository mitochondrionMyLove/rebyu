import axios from "axios"

export const API = "http://localhost:8080/api"

export async function base(endpoint, options = {}) {
  const response = await axios({
    url: `${API}/${endpoint}`,
    method: options.method || "GET",
    data: options.data,
    responseType: options.responseType,
    headers: options.headers,
  })

  return response.data
}