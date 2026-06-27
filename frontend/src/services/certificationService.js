import { base } from "./base"

export function getAllCertifications() {
  return base("certifications")
}

export function addCertification(data) {
  return base("certifications", { data: data, method: "POST" })
}

export function deleteCertification(id) {
  return base("certifications/" + id,{
    method: "DELETE"
  })
}

