import { getSupabaseClient } from "./supabase";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * Typed API client wrapping fetch() against the FastAPI backend.
 * Automatically injects the Supabase session token as a Bearer header.
 */

async function getAuthHeaders(): Promise<Record<string, string>> {
  const supabase = getSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }

  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `API Error ${response.status}: ${errorBody || response.statusText}`
    );
  }
  return response.json() as Promise<T>;
}

export const api = {
  async get<T = unknown>(path: string): Promise<T> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "GET",
      headers,
    });
    return handleResponse<T>(response);
  },

  async post<T = unknown>(path: string, body?: unknown): Promise<T> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  async put<T = unknown>(path: string, body?: unknown): Promise<T> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "PUT",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  async del<T = unknown>(path: string): Promise<T> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
      headers,
    });
    return handleResponse<T>(response);
  },

  /**
   * Upload a file via multipart/form-data (for PDF upload).
   * Does NOT set Content-Type — lets browser set boundary.
   */
  async upload<T = unknown>(path: string, formData: FormData): Promise<T> {
    const supabase = getSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const headers: Record<string, string> = {};
    if (session?.access_token) {
      headers["Authorization"] = `Bearer ${session.access_token}`;
    }

    const response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers,
      body: formData,
    });
    return handleResponse<T>(response);
  },
};
