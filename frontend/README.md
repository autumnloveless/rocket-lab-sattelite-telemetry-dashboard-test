# Frontend Overview

React + TypeScript dashboard using AstroUXDS, TailwindCSS, React Router, and SWR.

## Key Files
- `src/services/telemetryService.ts`: all telemetry API calls.
- `src/hooks/useTelemetry.ts`: SWR list fetch + create/delete revalidation.
- `src/pages/TelemetryDashboardPage.tsx`: page orchestration and URL filter state.
- `src/components/TelemetryFilters.tsx`: Satellite ID and Health Status filters.
- `src/components/TelemetryForm.tsx`: add telemetry entry form.
- `src/components/TelemetryTable.tsx`: telemetry table and delete action.

## Query Filter State
Filter state is stored in the URL search params:
- `satelliteId`
- `status`

This makes filters shareable and persistent on refresh.

