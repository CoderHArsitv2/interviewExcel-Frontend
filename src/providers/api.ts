import { getToken } from "./authProvider";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface ErrorPayload {
  error?: string;
}

interface MessagePayload {
  message?: string;
}

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  [key: string]: unknown;
}

async function request<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  body?: unknown,
  requireAuth: boolean = false,
  silentError: boolean = false
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
  let errorPayload: ErrorPayload = {};

  try {
    errorPayload = (await res.clone().json()) as ErrorPayload;
  } catch {}

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

    if (!silentError) {
      toast.error(errorMessage);
    }
    throw new Error(errorMessage);
  }

  const data = (await res.json()) as T & MessagePayload;

  // Show success toast if explicitly provided a message
  if (data.message) {
    toast.success(data.message);
  }

  return data;
}

// MULTIPART FILE UPLOAD
// The JSON `request` helper can't be reused here: it forces
// `Content-Type: application/json` and JSON.stringifies the body, whereas a
// file upload needs FormData and lets the browser set the multipart boundary.
export async function uploadFile<T>(
  url: string,
  file: File,
  fieldName: string = "image"
): Promise<T> {
  const token = getToken();
  if (!token) throw new Error("No access token found");

  const formData = new FormData();
  formData.append(fieldName, file);

  const res = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // Intentionally NOT setting Content-Type — the browser adds the
      // correct multipart/form-data boundary automatically.
    },
    credentials: "include", //FIXME: ENV SPECIFIC
    body: formData,
  });

  let errorPayload: ErrorPayload = {};
  try {
    errorPayload = (await res.clone().json()) as ErrorPayload;
  } catch {}

  if (!res.ok) {
    const errorMessage =
      errorPayload.error || `Image upload failed (${res.status})`;
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }

  const data = (await res.json()) as T & MessagePayload;
  if (data.message) {
    toast.success(data.message);
  }
  return data;
}

// UNAUTHENTICATED
export const get = <T>(url: string) => request<T>("GET", url);
export const post = <T>(url: string, body: unknown) =>
  request<T>("POST", url, body);

// AUTHENTICATED
export const authenticatedGet = <T>(url: string, silentError: boolean = false) =>
  request<T>("GET", url, undefined, true, silentError);
export const authenticatedPost = <T>(
  url: string,
  body: unknown,
  silentError: boolean = false
) => request<T>("POST", url, body, true, silentError);
export const authenticatedPut = <T>(url: string, body: unknown) =>
  request<T>("PUT", url, body, true);
export const authenticatedDelete = <T>(url: string) =>
  request<T>("DELETE", url, undefined, true);
