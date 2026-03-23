import useSWR from "swr";

import { telemetryService } from "../services/telemetryService";
import type { CreateTelemetryPayload } from "../types/telemetry";
import { useSearchParams } from "react-router";

export const useTelemetry = () => {
  
  // filter data is stored in url query parameters
  const [searchParams ] = useSearchParams();
  const filters = {
    satelliteId: searchParams.get("satelliteId") ?? "",
    status: searchParams.get("status") ?? "",
  };
  
  // Fetch once and apply filters locally to keep UI behavior deterministic.
  const swrKey = ["telemetry"];
  const query = useSWR(swrKey, () => telemetryService.list({ satelliteId: "", status: "" }));
  const allTelemetry = query.data ?? [];

  const telemetry = allTelemetry.filter((entry) => {
    const satelliteMatches = !filters.satelliteId.trim() || entry.satelliteId === filters.satelliteId.trim();
    const statusMatches = !filters.status || entry.status === filters.status;
    return satelliteMatches && statusMatches;
  });

  const satelliteIds = [...new Set(allTelemetry.map((entry) => entry.satelliteId))].sort();

  // helper function to call create API and then refresh data
  const createTelemetry = async (payload: CreateTelemetryPayload): Promise<void> => {
    await telemetryService.create(payload);
    await query.mutate();
  };

  // helper function to call delete API and then refresh data
  const deleteTelemetry = async (telemetryId: number): Promise<void> => {
    await telemetryService.delete(telemetryId);
    await query.mutate();
  };

  return {
    telemetry,
    satelliteIds,
    isLoading: query.isLoading,
    errorMessage: query.error instanceof Error ? query.error.message : null,
    createTelemetry,
    deleteTelemetry,
    refreshTelemetry: query.mutate,
  };
};
