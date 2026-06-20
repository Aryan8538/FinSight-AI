const API_URL = import.meta.env.VITE_API_URL || "/api/v1";

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export async function api(path, options = {}) {
  const token = localStorage.getItem("finsight_token");
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers
      }
    });
  } catch {
    throw new ApiError(
      "Cannot reach the FinSight API. Check the VITE_API_URL on Vercel and CLIENT_URL on Render.",
      0,
      null
    );
  }

  const type = response.headers.get("content-type") || "";
  if (type.includes("text/csv")) return response.blob();
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(
      payload?.error?.message || `The API returned an error (${response.status})`,
      response.status,
      payload?.error?.details
    );
  }
  return payload.data;
}

export function money(value, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits
  }).format(Number(value || 0));
}

export function percent(value) {
  const number = Number(value || 0);
  return `${number >= 0 ? "+" : ""}${number.toFixed(2)}%`;
}
