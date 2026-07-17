"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Download, Filter, CheckCircle2 } from "lucide-react";
import { jsPDF } from "jspdf";

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface AdvancedTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  bulkActions?: {
    label: string;
    onClick: (selectedRows: T[]) => void;
    icon?: React.ReactNode;
    variant?: "primary" | "danger" | "secondary";
  }[];
  rowKey: (row: T) => string | number;
}

export function AdvancedTable<T>({
  data,
  columns,
  searchPlaceholder = "Search records...",
  searchKeys = [],
  bulkActions = [],
  rowKey,
}: AdvancedTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sorting
  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Process data (Search, Sort, Paginate)
  const processedData = useMemo(() => {
    let result = [...data];

    // Search
    if (searchTerm && searchKeys.length > 0) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((row) =>
        searchKeys.some((key) => {
          const val = row[key];
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(lowerSearch);
        })
      );
    }

    // Sort
    if (sortConfig) {
      const { key, direction } = sortConfig;
      result.sort((a: any, b: any) => {
        const valA = a[key];
        const valB = b[key];

        if (valA === undefined || valB === undefined) return 0;

        if (typeof valA === "number" && typeof valB === "number") {
          return direction === "asc" ? valA - valB : valB - valA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        if (strA < strB) return direction === "asc" ? -1 : 1;
        if (strA > strB) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, searchKeys, sortConfig]);

  // Pagination bounds
  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return processedData.slice(startIndex, startIndex + pageSize);
  }, [processedData, currentPage, pageSize]);

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = paginatedData.map(rowKey);
      setSelectedIds(new Set(allIds));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: string | number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const selectedRows = useMemo(() => {
    return data.filter((row) => selectedIds.has(rowKey(row)));
  }, [data, selectedIds, rowKey]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    let y = 15;
    
    doc.setFontSize(14);
    doc.text("Medigo Data Export", 14, y);
    y += 10;
    
    doc.setFontSize(10);
    const headers = columns.map((col) => col.label).join(" | ");
    doc.text(headers, 14, y);
    y += 8;
    
    data.forEach((row) => {
      const rowText = columns
        .map((col) => String(row[col.key as keyof T] ?? ""))
        .join(" | ");
      doc.text(rowText, 14, y);
      y += 8;
      
      if (y > 280) {
        doc.addPage();
        y = 15;
      }
    });

    doc.save(`medigo_export_${Date.now()}.pdf`);
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between bg-slate-50 p-4 rounded-2xl border border-border-light">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary w-4 h-4" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-text-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {bulkActions.length > 0 && selectedIds.size > 0 && (
            <div className="flex items-center gap-2 border-r border-border pr-3">
              <span className="text-xs font-semibold text-text-secondary">
                {selectedIds.size} selected:
              </span>
              {bulkActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => action.onClick(selectedRows)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    action.variant === "danger"
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : action.variant === "primary"
                      ? "bg-primary text-white hover:bg-primary-700"
                      : "bg-white border border-border text-text-primary hover:bg-slate-50"
                  }`}
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-border rounded-xl bg-white hover:bg-slate-50 text-text-primary text-xs font-semibold shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            PDF Export
          </button>
        </div>
      </div>

      {/* Responsive View (Table / Card Grid) */}
      <div className="overflow-x-auto border border-border rounded-2xl shadow-sm bg-white">
        {/* Desktop Table View */}
        <table className="hidden md:table w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-slate-50 text-text-secondary text-xs font-bold uppercase tracking-wider select-none">
              <th className="p-4 w-12 text-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={paginatedData.length > 0 && paginatedData.every((row) => selectedIds.has(rowKey(row)))}
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                />
              </th>
              {columns.map((col) => {
                const isSorted = sortConfig?.key === col.key;
                return (
                  <th
                    key={col.label}
                    onClick={() => col.sortable !== false && requestSort(col.key as string)}
                    className={`p-4 font-semibold text-text-secondary ${
                      col.sortable !== false ? "cursor-pointer hover:bg-slate-100" : ""
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span>{col.label}</span>
                      {col.sortable !== false && isSorted && (
                        sortConfig.direction === "asc" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm text-text-primary">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-12 text-center text-text-tertiary">
                  No records found.
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => {
                const keyVal = rowKey(row);
                const isSelected = selectedIds.has(keyVal);
                return (
                  <tr
                    key={keyVal}
                    className={`hover:bg-slate-50/50 transition-colors ${
                      isSelected ? "bg-primary-50/10" : ""
                    }`}
                  >
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(keyVal)}
                        className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                      />
                    </td>
                    {columns.map((col) => (
                      <td key={col.label} className="p-4 align-middle">
                        {col.render ? col.render(row) : String(row[col.key as keyof T] ?? "")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Mobile Card Grid View (<768px) */}
        <div className="md:hidden divide-y divide-border">
          {paginatedData.length === 0 ? (
            <div className="p-12 text-center text-text-tertiary text-sm">
              No records found.
            </div>
          ) : (
            paginatedData.map((row) => {
              const keyVal = rowKey(row);
              const isSelected = selectedIds.has(keyVal);
              return (
                <div
                  key={keyVal}
                  className={`p-4 space-y-3 relative ${
                    isSelected ? "bg-primary-50/10" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectRow(keyVal)}
                      className="rounded border-border text-primary focus:ring-primary h-4.5 w-4.5 mt-0.5"
                    />
                    <div className="flex-1 pl-3 space-y-2">
                      {columns.map((col) => (
                        <div key={col.label} className="text-xs">
                          <span className="text-text-tertiary block mb-0.5 font-bold uppercase tracking-wider">
                            {col.label}
                          </span>
                          <span className="text-text-primary font-medium text-sm">
                            {col.render ? col.render(row) : String(row[col.key as keyof T] ?? "")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-border bg-white rounded-2xl shadow-sm text-sm">
          <div className="text-text-secondary">
            Showing <span className="font-semibold">{(currentPage - 1) * pageSize + 1}</span> to{" "}
            <span className="font-semibold">{Math.min(currentPage * pageSize, totalItems)}</span> of{" "}
            <span className="font-semibold">{totalItems}</span> entries
          </div>

          <div className="flex items-center gap-3">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            >
              {[5, 10, 20, 50].map((sz) => (
                <option key={sz} value={sz}>
                  {sz} / page
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-2 border border-border rounded-xl bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1.5 rounded-xl border text-sm font-semibold transition-all ${
                    currentPage === i + 1
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white border-border hover:bg-slate-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-2 border border-border rounded-xl bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
