import axios from "axios"

const API = "http://localhost:8080/api"

export async function base(endpoint, options = {}) {
  const response = await axios({
    url: `${API}/${endpoint}`,
    method: options.method || "GET",
    data: options.data,
  })
  return response.data
}
