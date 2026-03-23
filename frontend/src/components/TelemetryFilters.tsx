import { RuxButton, RuxContainer, RuxOption, RuxSelect } from "@astrouxds/react";
import { useSearchParams } from "react-router";
import { HEALTH_STATUS_OPTIONS } from "../types/telemetry";

type TelemetryFiltersProps = {
  satelliteIds: string[];
};

export const TelemetryFilters = ({ satelliteIds }: TelemetryFiltersProps) => {

  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div>
        <RuxContainer className="">
        <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-wide">Filters</h2>
            <RuxButton secondary size="small" onClick={() => setSearchParams({})}>Clear</RuxButton>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
            {/* Satellite ID */}
            <RuxSelect
            label="Satellite ID"
            value={searchParams.get("satelliteId") ?? ""}
            onRuxchange={(event) => {
              const next = new URLSearchParams(searchParams);
              const satelliteIdValue = (event.currentTarget as HTMLRuxSelectElement).value;
              const satelliteId = Array.isArray(satelliteIdValue)
                ? satelliteIdValue[0] ?? ""
                : satelliteIdValue ?? "";

              if (satelliteId.trim()) {
                next.set("satelliteId", satelliteId);
              } else {
                next.delete("satelliteId");
              }

              setSearchParams(next);
            }}
            >
              <RuxOption value="" label="All satellites">All satellites</RuxOption>
              {satelliteIds.map((satelliteId) => (
                <RuxOption key={satelliteId} value={satelliteId} label={satelliteId}>
                  {satelliteId}
                </RuxOption>
              ))}
            </RuxSelect>

            {/* Health Status */}
            <RuxSelect
            label="Health Status"
            value={searchParams.get("status") ?? ""}
            onRuxchange={(event) => {
              const next = new URLSearchParams(searchParams);
              const statusValue = (event.currentTarget as HTMLRuxSelectElement).value;
              const status = Array.isArray(statusValue) ? statusValue[0] ?? "" : statusValue;

              if (status) {
                next.set("status", status);
              } else {
                next.delete("status");
              }

              setSearchParams(next);
            }}
            >
            <RuxOption value="" label="All statuses">All statuses</RuxOption>
            {HEALTH_STATUS_OPTIONS.map((statusOption) => (
              <RuxOption key={statusOption} value={statusOption} label={statusOption}>
                {statusOption}
              </RuxOption>
            ))}
            </RuxSelect>
        </div>
        </RuxContainer>
    </div>
  );
};
