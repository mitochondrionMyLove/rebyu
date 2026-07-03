import { base } from "./base"

export async function getAllCertifications() {
    return await base("certifications")
}

export async function addCertification(data) {
    return await base("certifications", {
        data,
        method: "POST",
    })
}

export async function updateCertification(id, data) {
    return await base(`certifications/${id}`, {
        data,
        method: "PUT",
    })
}

export async function deleteCertification(id) {
    return await base(`certifications/${id}`, {
        method: "DELETE",
    })
}