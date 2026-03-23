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
  
  // data key is based on filters
  const swrKey = [ "telemetry", filters.satelliteId.trim(), filters.status ]
  const query = useSWR(swrKey, () => telemetryService.list(filters));

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
    telemetry: query.data ?? [],
    isLoading: query.isLoading,
    errorMessage: query.error instanceof Error ? query.error.message : null,
    createTelemetry,
    deleteTelemetry,
    refreshTelemetry: query.mutate,
  };
};
