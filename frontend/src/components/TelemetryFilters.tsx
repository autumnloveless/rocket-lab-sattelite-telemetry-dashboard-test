import { RuxButton, RuxContainer, RuxInput, RuxSelect } from "@astrouxds/react";
import { useSearchParams } from "react-router";
import { HEALTH_STATUS_OPTIONS } from "../types/telemetry";

export const TelemetryFilters = () => {

  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div>
        <RuxContainer className="mb-5">
        <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-wide">Filters</h2>
            <RuxButton secondary size="small" onClick={() => setSearchParams({})}>Clear</RuxButton>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
            {/* Satellite ID */}
            <RuxInput
            label="Satellite ID"
            placeholder="e.g. SAT-1"
            value={searchParams.get("satelliteId") ?? ""}
            onInput={(event) => {
              const next = new URLSearchParams(searchParams);
              const satelliteId = (event.target as HTMLInputElement).value;

              if (satelliteId.trim()) {
                next.set("satelliteId", satelliteId);
              } else {
                next.delete("satelliteId");
              }

              setSearchParams(next);
            }}
            />

            {/* Health Status */}
            <RuxSelect
            label="Health Status"
            value={searchParams.get("status") ?? ""}
            onInput={(event) => {
              const next = new URLSearchParams(searchParams);
              const status = (event.target as HTMLSelectElement).value;

              if (status) {
                next.set("status", status);
              } else {
                next.delete("status");
              }

              setSearchParams(next);
            }}
            >
            <option value="">All statuses</option>
            {HEALTH_STATUS_OPTIONS.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                {statusOption}
                </option>
            ))}
            </RuxSelect>
        </div>
        </RuxContainer>
    </div>
  );
};
