"use client";

import React, { useState } from "react";
import { ShoppingBag, Box, Truck, CheckCircle2, ShieldCheck, MapPin, Eye, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Drawer } from "@/components/enterprise/Drawer";

interface OrderRecord {
  id: string;
  medicine: string;
  date: string;
  status: "Preparing" | "Shipped" | "Delivered";
  expectedDelivery: string;
  trackingNumber?: string;
  shippingAddress: string;
}

const mockOrders: OrderRecord[] = [];

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRecord[]>(mockOrders);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors duration-200 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
        Back
      </button>
      {/* Page Header */}
      <div>
        <h2 className="font-heading text-xl font-extrabold text-text-primary">
          Pharmacy Orders
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Track compounding medication kit deliveries and Quest lab sample kit shipments.
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
          {/* Left Column: Orders list */}
          <div className="lg:col-span-8 space-y-4">
            {orders.map((ord) => (
              <Card key={ord.id} padding="md" className="hover">
                <div className="flex items-center justify-between pb-3 border-b border-border-light mb-4">
                  <div className="flex items-center gap-2">
                    <Box className="w-5 h-5 text-primary-600" />
                    <span className="font-mono text-xs text-text-tertiary font-bold">#{ord.id}</span>
                  </div>
                  <Badge 
                    variant={ord.status === "Delivered" ? "success" : "info"} 
                    size="sm"
                  >
                    {ord.status}
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-text-primary">{ord.medicine}</h4>
                    <p className="text-[10px] text-text-secondary mt-1">
                      Ordered on {ord.date} • Expected delivery: <span className="font-semibold text-text-primary">{ord.expectedDelivery}</span>
                    </p>
                  </div>

                  <div className="flex gap-2 self-start sm:self-center shrink-0">
                    <button 
                      onClick={() => setSelectedOrderId(ord.id)}
                      className="p-2 rounded-xl border border-border text-text-secondary hover:text-text-primary hover:bg-slate-50 transition-colors"
                      title="View Tracking Details"
                    >
                      <Eye className="w-4.5 h-4.5" />
                    </button>
                    <button 
                      onClick={() => setSelectedOrderId(ord.id)}
                      className="py-2 px-4 border border-border text-text-primary hover:border-primary hover:text-primary rounded-xl text-xs font-bold transition-all focus:outline-none"
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Right Column: Secure Shipping Notice */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-border/50 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="font-heading text-sm font-bold text-text-primary">Insulated Cold Chain Delivery</h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              GLP-1 compounding medications require temperature control. All medication kits are shipped in insulated boxes with active cold gel packs via overnight couriers.
            </p>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4 bg-white border border-border rounded-3xl">
          <ShoppingBag className="w-12 h-12 text-text-tertiary" />
          <h3 className="font-heading text-lg font-bold text-text-primary">No recent orders</h3>
          <p className="text-xs text-text-secondary max-w-xs mx-auto leading-relaxed">
            You do not have any pending pharmacy compound or diagnostic kit orders at this time.
          </p>
        </div>
      )}

      {/* Track Order Drawer */}
      <Drawer
        isOpen={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        title={selectedOrder ? `Track Order #${selectedOrder.id}` : "Track Shipment"}
        size="md"
      >
        {selectedOrder && (
          <div className="space-y-6 text-left">
            <div className="space-y-2.5">
              <div>
                <span className="text-[10px] text-text-tertiary block font-bold uppercase">Medication</span>
                <span className="text-xs font-bold text-text-primary block mt-0.5">{selectedOrder.medicine}</span>
              </div>
              <div>
                <span className="text-[10px] text-text-tertiary block font-bold uppercase">Shipping Address</span>
                <span className="text-xs font-bold text-text-primary block mt-0.5 leading-relaxed">{selectedOrder.shippingAddress}</span>
              </div>
            </div>

            {/* Tracking Status indicator */}
            <div className="border-t border-border-light pt-5 space-y-4">
              <h4 className="font-heading text-xs font-bold text-text-secondary uppercase tracking-wider">
                Shipping Status Timeline
              </h4>

              <div className="space-y-6 border-l-2 border-border-light pl-4 relative text-xs text-text-secondary">
                {/* Step 1 */}
                <div className="relative">
                  <div className="absolute -left-[22px] top-0 w-3 h-3 rounded-full bg-primary" />
                  <span className="block font-bold text-text-primary">Compounding Lab Verified</span>
                  <span className="block text-[10px] text-text-tertiary mt-0.5">Approved by pharmacist</span>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className={`absolute -left-[22px] top-0 w-3 h-3 rounded-full ${
                    selectedOrder.status === "Preparing" ? "bg-primary animate-pulse" : selectedOrder.status === "Delivered" || selectedOrder.status === "Shipped" ? "bg-primary" : "bg-border"
                  }`} />
                  <span className={`block font-bold ${selectedOrder.status === "Preparing" ? "text-text-primary" : "text-text-secondary"}`}>
                    Medication Sterile Packaging
                  </span>
                  <span className="block text-[10px] text-text-tertiary mt-0.5">Cold-chain insulated kit</span>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className={`absolute -left-[22px] top-0 w-3 h-3 rounded-full ${
                    selectedOrder.status === "Shipped" ? "bg-primary animate-pulse" : selectedOrder.status === "Delivered" ? "bg-primary" : "bg-border"
                  }`} />
                  <span className={`block font-bold ${selectedOrder.status === "Shipped" ? "text-text-primary" : "text-text-secondary"}`}>
                    Carrier Dispatch (Overnight)
                  </span>
                  <span className="block text-[10px] text-text-tertiary mt-0.5">
                    {selectedOrder.trackingNumber ? `Tracking ID: ${selectedOrder.trackingNumber}` : "Pending tracking number generation"}
                  </span>
                </div>

                {/* Step 4 */}
                <div className="relative">
                  <div className={`absolute -left-[22px] top-0 w-3 h-3 rounded-full ${
                    selectedOrder.status === "Delivered" ? "bg-primary" : "bg-border"
                  }`} />
                  <span className={`block font-bold ${selectedOrder.status === "Delivered" ? "text-text-primary" : "text-text-secondary"}`}>
                    Delivered to Shipping Address
                  </span>
                  <span className="block text-[10px] text-text-tertiary mt-0.5">Requires signature upon delivery</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
