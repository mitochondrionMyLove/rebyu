import { base } from "./base"

export function getAllCertifications() {
  return base("certifications")
}

export function addCertification(data) {
  return base("certifications", { data: data, method: "POST" })
}
