import { base } from "./base"

export async  function getAllCertifications() {
  return await base("certifications")
}

export async function addCertification(data) {
  return await base("certifications", { data: data, method: "POST" })
}

export async function deleteCertification(id) {
  return await base("certifications/" + id,{
    method: "DELETE"
  })
}

export async function updateCertification(certificationId, payload) {
  return await base(
      `certifications/${certificationId}`,{
        data: payload,
        method: "PUT"
      }
  )
}


