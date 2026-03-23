export const HEALTH_STATUS_OPTIONS = ["healthy", "warning", "critical"] as const;

export type HealthStatus = (typeof HEALTH_STATUS_OPTIONS)[number];

export type Telemetry = {
  id: number;
  satelliteId: string;
  timestamp: string;
  altitude: number;
  velocity: number;
  status: string;
};

export type CreateTelemetryPayload = {
  satelliteId: string;
  timestamp: string;
  altitude: number;
  velocity: number;
  status: HealthStatus;
};

export type TelemetryFilters = {
  satelliteId: string;
  status: string;
};
