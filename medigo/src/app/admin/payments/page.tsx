"use client";

import React, { useState } from "react";
import { CircleDollarSign, Download, Eye } from "lucide-react";
import { AdvancedTable, TableColumn } from "@/components/enterprise/AdvancedTable";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

interface TransactionRecord {
  id: string;
  patient: string;
  amount: string;
  method: string;
  status: "Success" | "Failed" | "Refunded";
  date: string;
}

export default function AdminPaymentsPage() {
  const { show } = useToast();
  const [txns, setTxns] = useState<TransactionRecord[]>([]);

  const handleDownloadInvoice = (txn: TransactionRecord) => {
    show("Generating transactional invoice receipt PDF...", "info");
    setTimeout(() => {
      const element = document.createElement("a");
      const file = new Blob([
        `MEDI GO TRANSACTION RECEIPT\n` +
        `---------------------------\n` +
        `Transaction ID: ${txn.id}\n` +
        `Billing Date: ${txn.date}\n` +
        `Billed Patient: ${txn.patient}\n` +
        `Paid Amount: ${txn.amount}\n` +
        `Payment Method: ${txn.method}\n` +
        `Status: ${txn.status.toUpperCase()}\n` +
        `Thank you for billing with MediGo!\n`
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `medigo_${txn.id.toLowerCase()}_receipt.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1000);
  };

  const columns: TableColumn<TransactionRecord>[] = [
    {
      key: "id",
      label: "Transaction ID",
      sortable: true,
      render: (row) => <span className="font-mono font-bold text-text-secondary text-xs">#{row.id}</span>,
    },
    {
      key: "patient",
      label: "Patient Name",
      sortable: true,
      render: (row) => <span className="font-bold text-text-primary text-xs">{row.patient}</span>,
    },
    {
      key: "amount",
      label: "Billed Amount",
      sortable: true,
      render: (row) => <span className="font-extrabold text-text-primary text-xs">{row.amount}</span>,
    },
    {
      key: "method",
      label: "Payment Channel",
      sortable: false,
      render: (row) => <span className="text-xs text-text-secondary font-semibold">{row.method}</span>,
    },
    {
      key: "date",
      label: "Billed Date",
      sortable: true,
      render: (row) => <span className="text-xs text-text-secondary font-medium">{row.date}</span>,
    },
    {
      key: "status",
      label: "Payment Status",
      sortable: true,
      render: (row) => {
        const variantMap = {
          Success: "success" as const,
          Failed: "error" as const,
          Refunded: "warning" as const
        };
        return <Badge variant={variantMap[row.status]} size="sm">{row.status}</Badge>;
      },
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (row) => (
        <div className="flex gap-2">
          <button 
            onClick={() => show(`Opening ledger details for transaction #${row.id}...`, "info")}
            className="p-1.5 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-slate-50 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDownloadInvoice(row)}
            className="p-1.5 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-slate-50 transition-colors"
            title="Download Invoice"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pb-4 border-b border-border/60 text-left">
        <h2 className="font-heading text-xl font-extrabold text-text-primary">
          Payments Ledger
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Audit platform transaction history logs, trigger refund cycles, and generate PDF invoices receipt.
        </p>
      </div>

      <div className="space-y-4 text-left">
        <div className="bg-white p-5 border border-border rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-border mb-5 select-none">
            <CircleDollarSign className="w-5 h-5 text-primary-600" />
            <h3 className="font-heading text-sm font-bold text-text-primary">
              All Transaction Records
            </h3>
          </div>

          <AdvancedTable
            data={txns}
            columns={columns}
            rowKey={(row) => row.id}
            searchKeys={["patient", "id", "status"]}
            searchPlaceholder="Search transactional logs..."
          />
        </div>
      </div>
    </div>
  );
}
