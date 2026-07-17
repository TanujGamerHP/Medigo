"use client";

import React, { useState, useEffect } from "react";
import { CircleDollarSign, Download, Eye } from "lucide-react";
import { AdvancedTable, TableColumn } from "@/components/enterprise/AdvancedTable";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import jsPDF from "jspdf";
import { api } from "@/lib/api";

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

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get('/api/v1/admin/payments');
        if (res.success && res.data) {
          setTxns(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch payments:", err);
      }
    };
    fetchPayments();
  }, []);

  const handleDownloadInvoice = (txn: TransactionRecord) => {
    show("Generating transactional invoice receipt PDF...", "info");
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(22);
      doc.setTextColor(15, 118, 110);
      doc.text("Medigo - Transaction Receipt", 20, 20);
      
      doc.setFontSize(12);
      doc.setTextColor(50, 50, 50);
      doc.text(`Transaction ID: ${txn.id}`, 20, 40);
      doc.text(`Billing Date: ${txn.date}`, 20, 50);
      doc.text(`Billed Patient: ${txn.patient}`, 20, 60);
      doc.text(`Paid Amount: ${txn.amount}`, 20, 70);
      doc.text(`Payment Method: ${txn.method}`, 20, 80);
      doc.text(`Status: ${txn.status.toUpperCase()}`, 20, 90);

      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text("Thank you for choosing Medigo!", 20, 120);
      
      doc.save(`Receipt_${txn.id}.pdf`);
      show("Receipt downloaded successfully!", "success");
    } catch (err) {
      console.error(err);
      show("Failed to generate PDF.", "error");
    }
  };

  const columns: TableColumn<TransactionRecord>[] = [
    {
      key: "patient",
      label: "Patient Name",
      sortable: true,
      render: (row) => <span className="font-bold text-text-primary text-sm">{row.patient}</span>,
    },
    {
      key: "amount",
      label: "Amount Paid",
      sortable: true,
      render: (row) => <span className="font-extrabold text-emerald-600 text-sm">{row.amount}</span>,
    },
    {
      key: "method",
      label: "Payment Method",
      sortable: false,
      render: (row) => <span className="text-xs text-text-secondary font-semibold bg-slate-100 px-2.5 py-1 rounded-md">{row.method}</span>,
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
            onClick={() => handleDownloadInvoice(row)}
            className="p-1.5 rounded-lg border border-border text-text-secondary hover:text-primary hover:bg-primary-50 transition-colors flex items-center gap-1.5"
            title="Download Invoice"
          >
            <Download className="w-4 h-4" />
            <span className="text-xs font-bold">Receipt</span>
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
