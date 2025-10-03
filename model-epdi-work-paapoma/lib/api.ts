export const API_BASE =
  (typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL) ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8000"

export async function postFormData<T = any>(
  path: string,
  formData: FormData,
  init?: RequestInit,
): Promise<{ data?: T; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      body: formData,
      ...init,
    })
    const text = await res.text()
    try {
      const json = JSON.parse(text)
      if (!res.ok) return { error: json?.error || res.statusText }
      return { data: json as T }
    } catch {
      // when backend returns plain text JSON string (e.g., timeline_json)
      if (!res.ok) return { error: text || res.statusText }
      return { data: text as unknown as T }
    }
  } catch (e: any) {
    return { error: e?.message || "Network error" }
  }
}

export async function postJson<T = any, B = any>(
  path: string,
  body: B,
  init?: RequestInit,
): Promise<{ data?: T; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      ...init,
    })
    const json = await res.json()
    if (!res.ok) return { error: json?.error || res.statusText }
    return { data: json as T }
  } catch (e: any) {
    return { error: e?.message || "Network error" }
  }
}
