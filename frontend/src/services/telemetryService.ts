import type {
  CreateTelemetryPayload,
  Telemetry,
  TelemetryFilters,
} from "../types/telemetry";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const toQueryString = (filters: TelemetryFilters): string => {
  const params = new URLSearchParams();

  if (filters.satelliteId.trim()) {
    params.set("satelliteId", filters.satelliteId.trim());
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  const query = params.toString();
  return query ? `?${query}` : "";
};

const readErrorMessage = async (response: Response): Promise<string> => {
  try {
    const body = await response.json();
    if (body?.detail) {
      return typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
    }
  } catch {
    // Fallback to status text below when body parsing fails.
  }

  return response.statusText || "Unexpected API error.";
};

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  // DELETE endpoint currently returns no body.
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
};

export const telemetryService = {
  list(filters: TelemetryFilters): Promise<Telemetry[]> {
    return request<Telemetry[]>(`/telemetry${toQueryString(filters)}`);
  },

  create(payload: CreateTelemetryPayload): Promise<Telemetry> {
    return request<Telemetry>("/telemetry", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  delete(telemetryId: number): Promise<void> {
    return request<void>(`/telemetry/${telemetryId}`, {
      method: "DELETE",
    });
  },
};
