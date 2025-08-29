import { getToken, removeToken } from "./authProvider";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function request<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  body?: any,
  requireAuth: boolean = false
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (requireAuth) {
    const token = getToken();
    if (!token) throw new Error("No access token found");
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    method,
    headers,
    credentials: "include", //FIXME: ENV SPECIFIC
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  let errorMessage = "API request failed";
  let errorPayload: any = {};

  try {
    errorPayload = await res.clone().json();
  } catch {}

  if (!res.ok) {
    switch (res.status) {
      case 400:
        errorMessage = errorPayload.error || "Bad Request";
        break;
      case 401:
        errorMessage = "Unauthorized";
        break;
      case 403:
        errorMessage = "Forbidden";
        break;
      case 404:
        errorMessage = "Not Found";
        break;
      case 422:
        errorMessage = errorPayload.error || "Unprocessable Entity";
        break;
      case 500:
        errorMessage = "Internal Server Error";
        break;
      case 409:
        errorMessage = errorPayload.error || "User already exists";
        break;
      default:
        errorMessage = errorPayload.error || `Unexpected Error (${res.status})`;
    }

    throw new Error(errorMessage);
  }

  return res.json();
}

// UNAUTHENTICATED
export const get = <T>(url: string) => request<T>("GET", url);
export const post = <T>(url: string, body: any) =>
  request<T>("POST", url, body);

// AUTHENTICATED
export const authenticatedGet = <T>(url: string) =>
  request<T>("GET", url, undefined, true);
export const authenticatedPost = <T>(url: string, body: any) =>
  request<T>("POST", url, body, true);
