import { useState } from "react";
import type { StatusTags } from "@astrouxds/astro-web-components";
import { RuxButton, RuxContainer, RuxDialog, RuxTag } from "@astrouxds/react";
import type { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

import type { Telemetry } from "../types/telemetry";

type TelemetryTableProps = {
  telemetry: Telemetry[];
  isLoading: boolean;
  onDeleteTelemetry: (telemetryId: number) => Promise<void>;
};

const formatTimestamp = (timestamp: string): string => {
  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) {
    // Preserve original server value if parsing fails instead of showing an invalid date.
    return timestamp;
  }

  return parsed.toISOString().replace("T", " ").replace("Z", " UTC");
};

export const TelemetryTable = ({ telemetry, isLoading, onDeleteTelemetry }: TelemetryTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Resolve the pending row from the latest telemetry array so dialog details stay in sync.
  const pendingDeleteTelemetry = pendingDeleteId === null
  ? null
  : telemetry.find((entry) => entry.id === pendingDeleteId) ?? null;
  
  const onConfirmDelete = async () => {
    if (pendingDeleteId === null) {
      return;
    }
    
    try {
      setIsDeleting(true);
      await onDeleteTelemetry(pendingDeleteId);
      setPendingDeleteId(null);
    } finally {
      // Always unlock the dialog actions, even if the delete request fails.
      setIsDeleting(false);
    }
  };
  
  // Column Definitions
  const TagStatus: Record<string, StatusTags> = { healthy: "pass", critical: "fail", warning: "unknown" };
  const DeleteButton = ({ id }: {id: number }) => <RuxButton iconOnly borderless icon="delete" size="small" onClick={() => setPendingDeleteId(id)}>Delete</RuxButton>
  const columns: ColumnDef<Telemetry>[] = [
    { accessorKey: "id", header: "ID", cell: ({ row }) => row.original.id },
    { accessorKey: "satelliteId", header: "Satellite ID", cell: ({ row }) => row.original.satelliteId },
    { accessorKey: "timestamp", header: "Timestamp", cell: ({ row }) => formatTimestamp(row.original.timestamp) },
    { accessorKey: "altitude", header: "Altitude", cell: ({ row }) => Number(row.original.altitude ?? 0).toFixed(2) },
    { accessorKey: "velocity", header: "Velocity", cell: ({ row }) => Number(row.original.velocity ?? 0).toFixed(2) },
    { accessorKey: "status", header: "Health Status", cell: ({ row }) => <RuxTag status={TagStatus[row.original.status] ?? "unknown"}>{row.original.status}</RuxTag> },
    { id: "actions", header: "Actions", enableSorting: false, cell: ({ row }) => <DeleteButton id={row.original.id} /> },
  ]

  const table = useReactTable({
    data: telemetry,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <RuxContainer>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-wide">Telemetry Table</h2>
        <span className="text-sm opacity-80">{telemetry.length} record(s)</span>
      </div>

      <div className="mt-2 w-full overflow-auto">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted();

                  return (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        // column header sort buttons
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


        <div className="mt-3 flex items-center justify-center gap-2">
          <RuxButton
            secondary
            size="small"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </RuxButton>
          <span className="text-sm opacity-80">
            Page {table.getPageCount() === 0 ? 0 : table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
        <RuxButton secondary size="small" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </RuxButton>
        </div>

      {/* Delete Confirmation Dialog */}
      <RuxDialog open={pendingDeleteId !== null} onRuxdialogclosed={() => setPendingDeleteId(null)}>
        <span slot="header">Confirm Delete</span>
        <div className="p-4">
          {pendingDeleteTelemetry
            ? `Delete telemetry entry ${pendingDeleteTelemetry.id} from ${formatTimestamp(pendingDeleteTelemetry.timestamp)}?`
            : "Delete this telemetry entry?"}
        </div>
        <div slot="footer" className="flex justify-end gap-2">
          <RuxButton secondary onClick={() => setPendingDeleteId(null)} disabled={isDeleting}>
            Cancel
          </RuxButton>
          <RuxButton onClick={onConfirmDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </RuxButton>
        </div>
      </RuxDialog>

    </RuxContainer>
  );
};
