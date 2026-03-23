import { RuxButton, RuxDialog, RuxInput, RuxOption, RuxSelect } from "@astrouxds/react";
import { useState } from "react";

import { HEALTH_STATUS_OPTIONS, type CreateTelemetryPayload, type HealthStatus } from "../types/telemetry";

type TelemetryFormProps = {
  onCreateTelemetry: (payload: CreateTelemetryPayload) => Promise<void>;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

type FormState = {
  satelliteId: string;
  timestampLocal: string;
  altitude: string;
  velocity: string;
  status: HealthStatus;
};

const createInitialState = (): FormState => ({
  satelliteId: "",
  timestampLocal: "",
  altitude: "",
  velocity: "",
  status: "healthy",
});

const timestampInputToUtcIso = (timestampInput: string): string => {
  // datetime-local has no timezone; treat entered value as UTC by appending Z.
  const hasSeconds = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?$/.test(timestampInput);
  const normalized = hasSeconds ? timestampInput : `${timestampInput}:00`;
  return `${normalized}Z`;
};

export const TelemetryForm = ({ onCreateTelemetry, isOpen, onOpenChange }: TelemetryFormProps) => {
  const [formState, setFormState] = useState<FormState>(createInitialState);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // form validation
  const canSubmit = (
    Boolean(formState.satelliteId.trim()) && 
    Boolean(formState.timestampLocal) && 
    Number(formState.altitude) > 0 &&
    Number(formState.velocity) > 0
  );

  const onSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    // perform form validation
    const altitude = Number(formState.altitude);
    const velocity = Number(formState.velocity);

    if (!formState.timestampLocal || Number.isNaN(altitude) || Number.isNaN(velocity)) {
      setSubmitError("Please enter valid telemetry values before submitting.");
      return;
    }

    // format data
    const payload: CreateTelemetryPayload = {
      satelliteId: formState.satelliteId.trim(),
      timestamp: timestampInputToUtcIso(formState.timestampLocal),
      altitude,
      velocity,
      status: formState.status,
    };

    // send data
    try {
      setIsSubmitting(true);
      await onCreateTelemetry(payload);
      setFormState(createInitialState());
      onOpenChange(false);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to create telemetry entry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RuxDialog
      open={isOpen}
      clickToClose
      onRuxdialogclosed={() => onOpenChange(false)}
    >
      <span slot="header">Add Telemetry Entry</span>

        <div className="p-4">
          <form className="grid gap-3 md:grid-cols-2" onSubmit={onSubmit}>
            <RuxInput
              required
              label="Satellite ID"
              value={formState.satelliteId}
              onInput={(event) => {
                setFormState((prev) => ({
                  ...prev,
                  satelliteId: (event.target as HTMLInputElement).value,
                }));
              }}
            />

            <RuxInput
              required
              label="Timestamp (UTC)"
              type="datetime-local"
              value={formState.timestampLocal}
              onInput={(event) => {
                setFormState((prev) => ({
                  ...prev,
                  timestampLocal: (event.target as HTMLInputElement).value,
                }));
              }}
            />

            <RuxInput
              required
              label="Altitude"
              type="number"
              min="0.000001"
              step="0.01"
              value={formState.altitude}
              onInput={(event) => {
                setFormState((prev) => ({
                  ...prev,
                  altitude: (event.target as HTMLInputElement).value,
                }));
              }}
            />

            <RuxInput
              required
              label="Velocity"
              type="number"
              min="0.000001"
              step="0.01"
              value={formState.velocity}
              onInput={(event) => {
                setFormState((prev) => ({
                  ...prev,
                  velocity: (event.target as HTMLInputElement).value,
                }));
              }}
            />

            <RuxSelect
              label="Health Status"
              value={formState.status}
              onRuxchange={(event) => {
                const nextStatus = (event.currentTarget as HTMLRuxSelectElement).value as HealthStatus;
                setFormState((prev) => ({ ...prev, status: nextStatus }));
              }}
            >
              {HEALTH_STATUS_OPTIONS.map((statusOption) => (
                <RuxOption key={statusOption} value={statusOption} label={statusOption}>
                  {statusOption}
                </RuxOption>
              ))}
            </RuxSelect>

            <div className="md:col-span-2 flex items-center gap-2">
              <RuxButton type="submit" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? "Saving..." : "Add Entry"}
              </RuxButton>
              {submitError ? (
                <p className="text-sm text-red-300">{submitError}</p>
              ) : null}
            </div>
          </form>
        </div>

      <div slot="footer" className="flex justify-end">
        <RuxButton secondary onClick={() => onOpenChange(false)}>
          Close
        </RuxButton>
      </div>
    </RuxDialog>
  );
};
