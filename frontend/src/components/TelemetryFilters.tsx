import { RuxButton, RuxContainer, RuxOption, RuxSelect } from "@astrouxds/react";
import { useSearchParams } from "react-router";
import { HEALTH_STATUS_OPTIONS } from "../types/telemetry";

type TelemetryFiltersProps = {
  satelliteIds: string[];
};

const getSelectValue = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
};

export const TelemetryFilters = ({ satelliteIds }: TelemetryFiltersProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateFilter = (key: "satelliteId" | "status", value: string) => {
    const next = new URLSearchParams(searchParams);

    if (value.trim()) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    setSearchParams(next);
  };

  return (
    <div>
      <RuxContainer>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-wide">Filters</h2>
          <RuxButton secondary size="small" onClick={() => setSearchParams({})}>
            Clear
          </RuxButton>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <RuxSelect
            label="Satellite ID"
            value={searchParams.get("satelliteId") ?? ""}
            onRuxchange={(event) => {
              const selectedValue = getSelectValue(
                (event.currentTarget as HTMLRuxSelectElement).value,
              );
              updateFilter("satelliteId", selectedValue);
            }}
          >
            <RuxOption value="" label="All satellites">
              All satellites
            </RuxOption>
              {satelliteIds.map((satelliteId) => (
                <RuxOption key={satelliteId} value={satelliteId} label={satelliteId}>
                  {satelliteId}
                </RuxOption>
              ))}
          </RuxSelect>

          <RuxSelect
            label="Health Status"
            value={searchParams.get("status") ?? ""}
            onRuxchange={(event) => {
              const selectedValue = getSelectValue(
                (event.currentTarget as HTMLRuxSelectElement).value,
              );
              updateFilter("status", selectedValue);
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
