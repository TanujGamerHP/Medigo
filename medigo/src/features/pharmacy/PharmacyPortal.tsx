"use client";

import React, { useState } from "react";
import { Pill, Box, ShieldAlert, Check, RefreshCw, AlertTriangle, ArrowRight, Eye } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { Drawer } from "@/components/enterprise/Drawer";

interface PrescriptionOrder {
  id: string;
  patient: string;
  medication: string;
  dosage: string;
  refillsLeft: number;
  doctor: string;
  status: "Pending Review" | "Preparing" | "Shipped" | "Delivered";
  date: string;
  trackingId?: string;
}

const initialOrders: PrescriptionOrder[] = [];

export function PharmacyPortal() {
  const { addToast } = useToast();
  const [orders, setOrders] = useState<PrescriptionOrder[]>(initialOrders);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Inventory thresholds
  const inventoryItems = [
    { name: "Semaglutide Base Compound", stock: "82 vials", limit: 100, status: "Normal" },
    { name: "Tirzepatide Raw Compound", stock: "14 vials", limit: 50, status: "Low Stock" },
    { name: "Compounding Vials 2ml", stock: "450 units", limit: 500, status: "Normal" },
    { name: "Subcutaneous Needles 31G", stock: "80 boxes", limit: 100, status: "Normal" },
  ];

  const handleUpdateStatus = (id: string, nextStatus: PrescriptionOrder["status"]) => {
    let trackingId = undefined;
    if (nextStatus === "Shipped") {
      trackingId = `USPS-${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    }

    setOrders(
      orders.map((o) =>
        o.id === id ? { ...o, status: nextStatus, ...(trackingId ? { trackingId } : {}) } : o
      )
    );

    addToast({
      type: "success",
      message: `Order #${id} status updated to: ${nextStatus}.`,
    });
  };

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  return (
    <div className="space-y-6">
      {/* Pharmacy warning banner */}
      <div className="flex items-start gap-3 bg-red-50 border border-red-200 p-4 rounded-2xl select-none">
        <ShieldAlert className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-heading text-xs font-bold text-red-900 uppercase tracking-wider">
            HIPAA Pharmacy Compounding Compliance
          </h4>
          <p className="text-xs text-red-800 mt-1 max-w-2xl leading-relaxed">
            Every compounded prescription vial must be matching-labeled with patient ID, doctor credentials, and titration instructions. Ensure sterile preparation logs are uploaded before shipping out medication kits.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Prescription Queue */}
        <div className="xl:col-span-2 bg-white border border-border rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border select-none">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-primary-600" />
              <h3 className="font-heading text-sm font-bold text-text-primary">
                Prescription Dispensing Queue
              </h3>
            </div>
            <span className="text-[10px] bg-slate-100 border border-border-light px-2.5 py-0.5 rounded font-mono font-bold">
              Compounding License: APPROVED
            </span>
          </div>

          <div className="divide-y divide-border-light">
            {orders.length > 0 ? orders.map((ord) => (
              <div key={ord.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-text-primary">#{ord.id} • {ord.patient}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                      ord.status === "Delivered"
                        ? "bg-slate-50 border-slate-200 text-slate-500"
                        : ord.status === "Shipped"
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : ord.status === "Preparing"
                        ? "bg-amber-50 border-amber-200 text-amber-700 animate-pulse"
                        : "bg-red-50 border-red-200 text-red-700"
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-text-secondary mt-1">
                    {ord.medication} ({ord.dosage}) • Refills Left: {ord.refillsLeft}
                  </p>
                  <p className="text-[9px] text-text-tertiary mt-0.5">
                    Authorized by: {ord.doctor} on {ord.date}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={() => setSelectedOrderId(ord.id)}
                    className="p-1.5 rounded hover:bg-slate-50 border border-border text-text-secondary hover:text-text-primary transition-all"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {ord.status === "Pending Review" && (
                    <button
                      onClick={() => handleUpdateStatus(ord.id, "Preparing")}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold shadow transition-all"
                    >
                      Fill Order
                    </button>
                  )}
                  {ord.status === "Preparing" && (
                    <button
                      onClick={() => handleUpdateStatus(ord.id, "Shipped")}
                      className="px-3 py-1.5 bg-primary hover:bg-primary-600 text-slate-950 rounded-lg text-[10px] font-bold shadow transition-all"
                    >
                      Ship Order
                    </button>
                  )}
                  {ord.status === "Shipped" && (
                    <button
                      onClick={() => handleUpdateStatus(ord.id, "Delivered")}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-text-primary border border-border rounded-lg text-[10px] font-bold transition-all"
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            )) : (
              <div className="py-8 text-center text-text-tertiary text-xs">
                No orders in queue
              </div>
            )}
          </div>
        </div>

        {/* Compounding Inventory Tracker */}
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border select-none">
            <Box className="w-5 h-5 text-primary-600" />
            <h3 className="font-heading text-sm font-bold text-text-primary">
              Compound Inventory levels
            </h3>
          </div>

          <div className="space-y-4">
            {inventoryItems.map((item) => {
              const isLow = item.status === "Low Stock";
              const pct = (parseInt(item.stock) / item.limit) * 100;
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-text-primary truncate max-w-[180px]">{item.name}</span>
                    <span className={`text-[10px] font-bold ${isLow ? "text-red-500" : "text-text-secondary"}`}>
                      {item.stock} / {item.limit}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(pct, 100)}%` }}
                      className={`h-full rounded-full ${isLow ? "bg-red-500" : "bg-emerald-500"}`}
                    />
                  </div>
                  {isLow && (
                    <span className="inline-flex items-center gap-1 text-[9px] text-red-500 font-bold">
                      <AlertTriangle className="w-3 h-3" />
                      Requires compounding raw material reorder.
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order Details Drawer */}
      <Drawer
        isOpen={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        title={selectedOrder ? `Pharmacy Order #${selectedOrder.id}` : "Order Profile"}
        size="md"
      >
        {selectedOrder && (
          <div className="space-y-5">
            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-text-tertiary block font-bold uppercase select-none">Patient Name</span>
                <span className="text-sm font-bold text-text-primary mt-0.5 block">{selectedOrder.patient}</span>
              </div>
              <div>
                <span className="text-[10px] text-text-tertiary block font-bold uppercase select-none">Compounding Form</span>
                <span className="text-sm font-bold text-text-primary mt-0.5 block">
                  {selectedOrder.medication} - {selectedOrder.dosage}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-text-tertiary block font-bold uppercase select-none">Authorized Doctor</span>
                <span className="text-sm font-bold text-text-primary mt-0.5 block">{selectedOrder.doctor}</span>
              </div>
              {selectedOrder.trackingId && (
                <div className="bg-slate-50 border border-border-light p-3 rounded-xl">
                  <span className="text-[10px] text-text-tertiary block font-bold uppercase select-none">Delivery Shipment Tracking</span>
                  <span className="text-xs font-bold text-primary-700 mt-1 block font-mono">{selectedOrder.trackingId}</span>
                </div>
              )}
            </div>

            {/* Compounding Checklist */}
            <div className="border-t border-border-light pt-4 space-y-3">
              <h4 className="font-heading text-xs font-bold text-text-secondary uppercase tracking-wider select-none">
                Sterile Compounding Audit Checklist
              </h4>
              <div className="space-y-2 text-xs font-medium text-text-primary">
                {[
                  "Verify metabolic lab eligibility approval matches patient dossier.",
                  "Transcribe dosage titration guidelines onto primary label.",
                  "Pack insulated shipping kit with active cold gel packs.",
                  "Transmit automated WhatsApp and Email shipping alerts.",
                ].map((check, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="mt-0.5 w-4 h-4 rounded bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-600 flex-shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="leading-tight">{check}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
