import { RuxGlobalStatusBar, RuxNotification } from "@astrouxds/react";

import { TelemetryFilters } from "../components/TelemetryFilters";
import { TelemetryForm } from "../components/TelemetryForm";
import { TelemetryTable } from "../components/TelemetryTable";
import { useTelemetry } from "../hooks/useTelemetry";

export const TelemetryDashboardPage = () => {  
  // Using SWR for data fetching to simplify validation
  // Filter state lives in the URL for shareable links and refresh persistence.
  const { telemetry, isLoading, errorMessage, createTelemetry, deleteTelemetry } = useTelemetry();

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <RuxGlobalStatusBar className="p-4 my-2" includeIcon={true} menuIcon="satellite-transmit" appDomain="Rocket Lab" appName="Satellite Telemetry Dashboard" appVersion="1.0" />

        <RuxNotification open={Boolean(errorMessage)} status="critical" message={`Failed to load telemetry data: ${errorMessage ?? ""}`} />
        
        <TelemetryFilters />

        <TelemetryForm
          onCreateTelemetry={createTelemetry}
        />

        <TelemetryTable
          telemetry={telemetry}
          isLoading={isLoading}
          onDeleteTelemetry={deleteTelemetry}
        />

    </main>
  );
};
