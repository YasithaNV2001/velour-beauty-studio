"use client"

import { useState, useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { format, parseISO } from "date-fns"
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { AppointmentDetailDrawer } from "@/components/admin/AppointmentDetailDrawer"
import { cn } from "@/lib/utils"
import type { Appointment } from "@/lib/supabase/types"

type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled"

interface EnrichedAppointment extends Appointment {
  serviceName: string
  stylistName: string
}

interface AppointmentsTableProps {
  appointments: EnrichedAppointment[]
}

function SortIcon({
  sorted,
}: {
  sorted: false | "asc" | "desc"
}) {
  if (!sorted) return <ArrowUpDown className="size-3.5 text-plum/30" aria-hidden="true" />
  if (sorted === "asc") return <ArrowUp className="size-3.5 text-gold" aria-hidden="true" />
  return <ArrowDown className="size-3.5 text-gold" aria-hidden="true" />
}

export function AppointmentsTable({ appointments: initialData }: AppointmentsTableProps) {
  const [data, setData] = useState<EnrichedAppointment[]>(initialData)
  const [sorting, setSorting] = useState<SortingState>([
    { id: "appointment_date", desc: false },
  ])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [selectedAppointment, setSelectedAppointment] =
    useState<EnrichedAppointment | null>(null)

  function handleStatusChange(id: string, status: AppointmentStatus) {
    setData((prev) =>
      prev.map((appt) => (appt.id === id ? { ...appt, status } : appt))
    )
    if (selectedAppointment?.id === id) {
      setSelectedAppointment((prev) => (prev ? { ...prev, status } : null))
    }
  }

  const columns = useMemo<ColumnDef<EnrichedAppointment>[]>(
    () => [
      {
        accessorKey: "appointment_date",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1.5 text-xs font-semibold text-plum/50 uppercase tracking-wider hover:text-plum transition-colors focus-visible:outline-none"
            aria-label={`Sort by date ${column.getIsSorted() === "asc" ? "(descending)" : "(ascending)"}`}
          >
            Date
            <SortIcon sorted={column.getIsSorted()} />
          </button>
        ),
        cell: ({ getValue }) => {
          const raw = getValue<string>()
          return (
            <span className="text-sm text-plum font-sans whitespace-nowrap">
              {format(parseISO(raw), "MMM d, yyyy")}
            </span>
          )
        },
        enableSorting: true,
      },
      {
        accessorKey: "appointment_time",
        header: () => (
          <span className="text-xs font-semibold text-plum/50 uppercase tracking-wider">
            Time
          </span>
        ),
        cell: ({ getValue }) => (
          <span className="text-sm text-plum/70 font-sans">{getValue<string>()}</span>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "customer_name",
        header: () => (
          <span className="text-xs font-semibold text-plum/50 uppercase tracking-wider">
            Customer
          </span>
        ),
        cell: ({ getValue }) => (
          <span className="text-sm font-medium text-plum font-sans">{getValue<string>()}</span>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "customer_phone",
        header: () => (
          <span className="text-xs font-semibold text-plum/50 uppercase tracking-wider">
            Phone
          </span>
        ),
        cell: ({ getValue }) => (
          <span className="text-sm text-plum/60 font-sans">{getValue<string>()}</span>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "serviceName",
        header: () => (
          <span className="text-xs font-semibold text-plum/50 uppercase tracking-wider">
            Service
          </span>
        ),
        cell: ({ getValue }) => (
          <span className="text-sm text-plum/70 font-sans truncate max-w-[140px] block">
            {getValue<string>()}
          </span>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "stylistName",
        header: () => (
          <span className="text-xs font-semibold text-plum/50 uppercase tracking-wider">
            Stylist
          </span>
        ),
        cell: ({ getValue }) => (
          <span className="text-sm text-plum/70 font-sans">{getValue<string>()}</span>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "total_price_lkr",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1.5 text-xs font-semibold text-plum/50 uppercase tracking-wider hover:text-plum transition-colors focus-visible:outline-none"
            aria-label={`Sort by price ${column.getIsSorted() === "asc" ? "(descending)" : "(ascending)"}`}
          >
            Price (LKR)
            <SortIcon sorted={column.getIsSorted()} />
          </button>
        ),
        cell: ({ getValue }) => {
          const val = getValue<number | null>()
          return (
            <span className="text-sm text-plum font-sans">
              {val != null ? val.toLocaleString() : "—"}
            </span>
          )
        },
        enableSorting: true,
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1.5 text-xs font-semibold text-plum/50 uppercase tracking-wider hover:text-plum transition-colors focus-visible:outline-none"
            aria-label={`Sort by status ${column.getIsSorted() === "asc" ? "(descending)" : "(ascending)"}`}
          >
            Status
            <SortIcon sorted={column.getIsSorted()} />
          </button>
        ),
        cell: ({ getValue }) => (
          <StatusBadge status={getValue<AppointmentStatus>()} />
        ),
        enableSorting: true,
      },
      {
        id: "actions",
        header: () => (
          <span className="text-xs font-semibold text-plum/50 uppercase tracking-wider">
            Actions
          </span>
        ),
        cell: ({ row }) => (
          <Button
            onClick={() => setSelectedAppointment(row.original)}
            size="sm"
            variant="outline"
            className="h-7 px-2.5 text-xs border-cream-dark text-plum hover:bg-cream hover:text-plum"
            aria-label={`View details for ${row.original.customer_name}`}
          >
            <Eye className="size-3.5" aria-hidden="true" />
            View
          </Button>
        ),
        enableSorting: false,
      },
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue: string) => {
      const search = filterValue.toLowerCase()
      return (
        row.original.customer_name.toLowerCase().includes(search) ||
        row.original.customer_phone.toLowerCase().includes(search)
      )
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <>
      {/* Search bar */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-plum/30 pointer-events-none"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search by name or phone…"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9 border-cream-dark focus-visible:border-gold focus-visible:ring-gold/30"
            aria-label="Search appointments by customer name or phone"
          />
        </div>
        <p className="text-sm text-plum/40 font-sans shrink-0">
          {table.getFilteredRowModel().rows.length} of {data.length}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-cream-dark shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left" aria-label="Appointments table">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-cream-dark bg-cream/50">
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 whitespace-nowrap"
                      scope="col"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-12 text-center text-sm text-plum/40 font-sans"
                  >
                    No appointments match your search.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={cn(
                      "border-b border-cream-dark last:border-0 hover:bg-cream/40 transition-colors cursor-pointer",
                      selectedAppointment?.id === row.original.id && "bg-gold/5"
                    )}
                    onClick={() => setSelectedAppointment(row.original)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setSelectedAppointment(row.original)
                      }
                    }}
                    aria-label={`Appointment for ${row.original.customer_name} on ${format(parseISO(row.original.appointment_date), "MMM d yyyy")}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail drawer */}
      {selectedAppointment && (
        <AppointmentDetailDrawer
          appointment={selectedAppointment}
          serviceName={selectedAppointment.serviceName}
          stylistName={selectedAppointment.stylistName}
          open={selectedAppointment !== null}
          onClose={() => setSelectedAppointment(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  )
}
