import { useState } from "react";
import { RuxButton, RuxClock, RuxGlobalStatusBar, RuxNotification } from "@astrouxds/react";

import { TelemetryFilters } from "../components/TelemetryFilters";
import { TelemetryForm } from "../components/TelemetryForm";
import { TelemetryTable } from "../components/TelemetryTable";
import { useTelemetry } from "../hooks/useTelemetry";

export const TelemetryDashboardPage = () => {  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Using SWR for data fetching to simplify validation
  // Filter state lives in the URL for shareable links and refresh persistence.
  const { telemetry, satelliteIds, isLoading, errorMessage, createTelemetry, deleteTelemetry, refreshTelemetry } = useTelemetry();

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <RuxGlobalStatusBar className="p-4 my-2" includeIcon={true} menuIcon="satellite-transmit" appDomain="Rocket Lab" appName="Satellite Telemetry Dashboard" appVersion="1.0">
        <RuxClock />
      </RuxGlobalStatusBar>

        <RuxNotification open={Boolean(errorMessage)} status="critical" message={`Failed to load telemetry data: ${errorMessage ?? ""}`} />
        
        <div className="flex flex-col gap-4 py-2">
          <div className="self-end flex items-center gap-2">
            <RuxButton secondary onClick={() => void refreshTelemetry()}>
              Refresh
            </RuxButton>
            <RuxButton icon="add" onClick={() => setIsCreateDialogOpen(true)}>
              Add Telemetry Entry
            </RuxButton>
          </div>

          <TelemetryFilters satelliteIds={satelliteIds} />

          <TelemetryForm
            onCreateTelemetry={createTelemetry}
            isOpen={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          />

          <TelemetryTable
            telemetry={telemetry}
            isLoading={isLoading}
            onDeleteTelemetry={deleteTelemetry}
          />
        </div>

    </main>
  );
};
