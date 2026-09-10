/**
 * ERP ilə əlaqə üçün nazik HTTP qatı.
 * Real endpoint-lər hazır olanda yalnız BASE_URL və yol adları dəyişməlidir.
 */

const BASE_URL = process.env.NEXT_PUBLIC_ERP_API_URL ?? "";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Sessiya token-i YALNIZ yaddaşda (in-memory) saxlanılır — localStorage-də yox.
 * Beləliklə hər dəfə link təzə açılanda istifadəçi giriş etməmiş sayılır və
 * ondan yenidən nömrə soruşulur. Cari ziyarət ərzində (səhifələr arası keçid)
 * token qalır; tam yeniləmə (F5) və ya linkin yenidən açılması onu sıfırlayır.
 */
let currentToken: string | null = null;

export function getToken(): string | null {
  return currentToken;
}

export function setToken(token: string | null) {
  currentToken = token;
}

export async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (!res.ok) {
    let message = `Sorğu uğursuz oldu (${res.status})`;
    try {
      const body = await res.json();
      if (typeof body?.message === "string") message = body.message;
    } catch {
      // cavab JSON deyil — standart mesaj qalır
    }
    throw new ApiError(message, res.status);
  }

  return (await res.json()) as T;
}
