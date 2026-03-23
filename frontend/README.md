# Frontend Architecture

This frontend is a React + TypeScript telemetry dashboard focused on simple, understandable data flow.

Core stack:
- React 19 for UI composition.
- TypeScript for static typing and safer refactors.
- SWR for server-state fetching and cache revalidation.
- React Router for routing and URL-based filter state.
- Astro UXDS components for the design system.
- TailwindCSS utilities for layout and spacing.

## Design Goals

- Keep API interactions in one place.
- Keep UI components mostly presentational.
- Keep URL query params as the source of truth for filters.
- Keep page-level orchestration inside one page module.

## Folder Structure

```text
src/
	components/
		TelemetryFilters.tsx
		TelemetryForm.tsx
		TelemetryTable.tsx
	hooks/
		useTelemetry.ts
	pages/
		TelemetryDashboardPage.tsx
	services/
		telemetryService.ts
	types/
		telemetry.ts
	Router.tsx
	main.tsx
```

## Architecture Layers

1. Service Layer
- File: `src/services/telemetryService.ts`
- Responsibility: all HTTP communication with the backend.
- Why this helps: UI code does not need to know fetch details, error parsing, or query-string assembly.

2. Data Hook Layer
- File: `src/hooks/useTelemetry.ts`
- Responsibility: fetch telemetry, apply URL-driven filters, expose actions (`create`, `delete`, `refresh`) and derived data (`satelliteIds`).
- Why this helps: page and component code stay concise and focused on rendering.

3. Page Orchestration Layer
- File: `src/pages/TelemetryDashboardPage.tsx`
- Responsibility: compose the full dashboard view, connect user actions to the hook, and coordinate dialog open/close state.
- Why this helps: a single entry point for feature behavior makes onboarding easier.

4. Presentational Components
- Files:
	- `src/components/TelemetryFilters.tsx`
	- `src/components/TelemetryForm.tsx`
	- `src/components/TelemetryTable.tsx`
- Responsibility: render focused UI sections and emit user intent upward through callbacks.
- Why this helps: components remain reusable and easier to test in isolation.

## Data Flow

1. The page loads and mounts `TelemetryDashboardPage`.
2. `useTelemetry` requests telemetry through `telemetryService.list(...)`.
3. URL query params (`satelliteId`, `status`) are read with `useSearchParams`.
4. Filtered telemetry is computed locally in the hook.
5. Components receive plain props and render:
- `TelemetryFilters` updates URL params.
- `TelemetryForm` submits create requests.
- `TelemetryTable` handles sorting, pagination, and deletion.
6. After create/delete, SWR revalidates and updates UI state.

## URL State Strategy

Filter state lives in URL search params:
- `satelliteId`
- `status`

Benefits:
- Shareable links.
- Refresh-safe state.
- Predictable behavior without extra global state libraries.

## Error Handling Strategy

- API errors are normalized in `telemetryService.ts`.
- The hook exposes a single `errorMessage` string.
- The page displays failures through `RuxNotification`.

This gives one consistent place for backend-error translation and one consistent place for user-facing error display.

## Local Development

Install dependencies and start Vite dev server:

```sh
npm install
npm run dev
```

Build for production:

```sh
npm run build
```

