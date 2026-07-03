import * as React from "react";
import { cn } from "@/lib/utils";

export type TimelineItem = {
  title: string;
  description?: string;
  meta?: string;
  status?: "default" | "active" | "complete" | "warning" | "error";
};

export function Timeline({ items, className }: { items: TimelineItem[]; className?: string }) {
  return (
    <ol className={cn("space-y-4", className)}>
      {items.map((item, index) => (
        <li key={`${item.title}-${index}`} className="relative pl-8">
          <span className="absolute left-0 top-2 size-3 rounded-full bg-primary shadow-glow" aria-hidden="true" />
          <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="font-medium">{item.title}</h4>
                {item.description ? <p className="mt-1 text-sm text-muted-foreground">{item.description}</p> : null}
              </div>
              {item.meta ? <span className="text-xs text-muted-foreground">{item.meta}</span> : null}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export type DataTableColumn<T> = {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  className?: string;
};

export function DataTable<T>({ columns, data, className, emptyState }: { columns: Array<DataTableColumn<T>>; data: T[]; className?: string; emptyState?: React.ReactNode }) {
  return (
    <div className={cn("overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft", className)}>
      <div className="overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-muted/40 text-left text-xs uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-xl">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={cn("px-4 py-3 font-medium", column.className)}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t border-border/60 transition-colors hover:bg-muted/30">
                  {columns.map((column) => (
                    <td key={column.key} className={cn("px-4 py-4 align-top", column.className)}>
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center text-sm text-muted-foreground">
                  {emptyState ?? "No records found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
