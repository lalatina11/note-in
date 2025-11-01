import ENV from "./env"

export const apiRequest = {
    get: async (url: string, token?: string) => {
        return await fetch(ENV.EXPO_PUBLIC_API_BASE_URL + url, { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } })
    },
    post: async (url: string, body: Record<string, string>, token?: string) => {
        return await fetch(ENV.EXPO_PUBLIC_API_BASE_URL + url, { method: "POST", body: JSON.stringify(body), headers: { Accept: "application/json", Authorization: `Bearer ${token}`, "Content-Type": "application/json" } })
    },
    patch: async (url: string, body: Record<string, string>, token?: string) => {
        return await fetch(ENV.EXPO_PUBLIC_API_BASE_URL + url, { method: "PATCH", body: JSON.stringify(body), headers: { Accept: "application/json", Authorization: `Bearer ${token}`, "Content-Type": "application/json" } })
    },
    delete: async (url: string, token?: string) => {
        return await fetch(ENV.EXPO_PUBLIC_API_BASE_URL + url, { method: "DELETE", headers: { Accept: "application/json", Authorization: `Bearer ${token}` } })
    }
}