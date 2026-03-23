import { useState } from "react";
import { RuxButton, RuxContainer, RuxTag } from "@astrouxds/react";
import type { StatusTags } from "@astrouxds/astro-web-components";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";

import type { Telemetry } from "../types/telemetry";

type TelemetryTableProps = {
  telemetry: Telemetry[];
  isLoading: boolean;
  onDeleteTelemetry: (telemetryId: number) => Promise<void>;
};

const TagStatus: Record<string, StatusTags> = {
  healthy: "pass",
  critical: "fail",
  warning: "unknown",
};

const formatTimestamp = (timestamp: string): string => {
  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) {
    return timestamp;
  }

  return parsed.toLocaleString();
};

export const TelemetryTable = ({
  telemetry,
  isLoading,
  onDeleteTelemetry,
}: TelemetryTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  function DeleteButton({ id }: {id: number }) {
    return (
      <RuxButton secondary size="small" onClick={() => onDeleteTelemetry(id) }>Delete</RuxButton>
    );
  }

  function Tag({ status }: {status: string }) {
    return (
      <RuxTag status={TagStatus[status] ?? "unknown"}>{status}</RuxTag>
    );
  }

  const columns: ColumnDef<Telemetry>[] = [
    { accessorKey: "satelliteId", header: "Satellite ID", cell: ({ row }) => row.original.satelliteId },
    { accessorKey: "timestamp", header: "Timestamp", cell: ({ row }) => formatTimestamp(row.original.timestamp) },
    { accessorKey: "altitude", header: "Altitude", cell: ({ row }) => Number(row.original.altitude ?? 0).toFixed(2) },
    { accessorKey: "velocity", header: "Velocity", cell: ({ row }) => Number(row.original.velocity ?? 0).toFixed(2) },
    { accessorKey: "status", header: "Health Status", cell: ({ row }) => <Tag status={row.original.status} /> },
    { id: "actions", header: "Actions", enableSorting: false, cell: ({ row }) => <DeleteButton id={row.original.id} /> },
  ]

  const table = useReactTable({
    data: telemetry,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <RuxContainer>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-wide">Telemetry Table</h2>
        <span className="text-sm opacity-80">{telemetry.length} record(s)</span>
      </div>

      <div className="mt-2 h-[440px] w-full overflow-auto">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted();

                  return (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          className="inline-flex cursor-pointer items-center gap-2 bg-transparent text-left"
                          onClick={header.column.getToggleSortingHandler()}
                          disabled={!header.column.getCanSort()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sorted === "asc" ? " ▲" : sorted === "desc" ? " ▼" : ""}
                        </button>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            { 
              // loading
              isLoading 
              ? (<tr><td colSpan={columns.length}>Loading telemetry...</td></tr>)
              
              // no data 
              : table.getRowModel().rows.length === 0
              ? <tr><td colSpan={columns.length}>No telemetry entries found for the current filter.</td></tr>
              
              // has data
              : (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  ))
              ) 
            } 
          </tbody>
        </table>
      </div>
    </RuxContainer>
  );
};
