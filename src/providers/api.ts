import { getToken } from "./authProvider";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  [key: string]: unknown;
}

async function request<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  body?: unknown,
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let errorPayload: any = {};

  try {
    errorPayload = await res.clone().json();
  } catch { }

  if (!res.ok) {
    if (errorPayload.error) {
      errorMessage = errorPayload.error;
    } else {
      switch (res.status) {
        case 400:
          errorMessage = "Bad Request";
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
          errorMessage = "Unprocessable Entity";
          break;
        case 500:
          errorMessage = "Internal Server Error";
          break;
        case 409:
          errorMessage = "User already exists";
          break;
        default:
          errorMessage = `Unexpected Error (${res.status})`;
      }
    }

    toast.error(errorMessage);
    throw new Error(errorMessage);
  }

  const data = await res.json();

  // Show success toast if explicitly provided a message
  if ((data as any).message) {
    toast.success((data as any).message);
  }

  return data;
}

// UNAUTHENTICATED
export const get = <T>(url: string) => request<T>("GET", url);
export const post = <T>(url: string, body: unknown) =>
  request<T>("POST", url, body);

// AUTHENTICATED
export const authenticatedGet = <T>(url: string) =>
  request<T>("GET", url, undefined, true);
export const authenticatedPost = <T>(url: string, body: unknown) =>
  request<T>("POST", url, body, true);
export const authenticatedPut = <T>(url: string, body: unknown) =>
  request<T>("PUT", url, body, true);
export const authenticatedDelete = <T>(url: string) =>
  request<T>("DELETE", url, undefined, true);
