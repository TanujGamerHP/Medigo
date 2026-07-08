"use client";

import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  Search, 
  MoreVertical,
  CheckCircle2,
  Box,
  TrendingUp,
  MapPin
} from "lucide-react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await api.get('/api/v1/orders/admin/all');
        if (res.success && res.data) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    const term = searchQuery.toLowerCase();
    const patientName = `${o.patient?.firstName || ''} ${o.patient?.lastName || ''}`.toLowerCase();
    return (
      o.id.toLowerCase().includes(term) ||
      patientName.includes(term) ||
      o.status.toLowerCase().includes(term)
    );
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in text-left max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-text-primary">Order Management</h1>
          <p className="text-sm text-text-secondary mt-1">
            Track and fulfill pharmacy e-commerce orders across the platform.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="search" 
              placeholder="Search by ID or Patient..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
            />
          </div>
          <Button variant="outline" className="gap-2">
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card padding="md" className="border-l-4 border-l-primary flex flex-col justify-center">
          <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider block mb-1">Total Orders</span>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-heading font-black text-text-primary">{orders.length}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded-full mb-1">
              <TrendingUp className="w-3 h-3 mr-1" /> +12%
            </span>
          </div>
        </Card>
        
        <Card padding="md" className="border-l-4 border-l-blue-500 flex flex-col justify-center">
          <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider block mb-1">Total Revenue</span>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-heading font-black text-text-primary">₹{totalRevenue.toFixed(2)}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded-full mb-1">
              <TrendingUp className="w-3 h-3 mr-1" /> +8%
            </span>
          </div>
        </Card>
        
        <Card padding="md" className="border-l-4 border-l-warning flex flex-col justify-center">
          <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider block mb-1">Pending Fulfillment</span>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-heading font-black text-text-primary">
              {orders.filter(o => o.status === 'Paid').length}
            </span>
          </div>
        </Card>
      </div>

      {/* Orders Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-heading font-bold text-text-secondary uppercase tracking-wider text-xs">Order ID</th>
                <th className="px-6 py-4 font-heading font-bold text-text-secondary uppercase tracking-wider text-xs">Patient</th>
                <th className="px-6 py-4 font-heading font-bold text-text-secondary uppercase tracking-wider text-xs">Items</th>
                <th className="px-6 py-4 font-heading font-bold text-text-secondary uppercase tracking-wider text-xs">Total</th>
                <th className="px-6 py-4 font-heading font-bold text-text-secondary uppercase tracking-wider text-xs">Date</th>
                <th className="px-6 py-4 font-heading font-bold text-text-secondary uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 font-heading font-bold text-text-secondary uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-text-tertiary">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
                      <p>Loading orders...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-text-tertiary">
                    <ShoppingBag className="w-12 h-12 mx-auto text-text-tertiary mb-3 opacity-50" />
                    <p className="font-semibold text-text-primary">No orders found</p>
                    <p className="text-xs mt-1">Try adjusting your search criteria</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Box className="w-4 h-4 text-text-tertiary" />
                        <span className="font-mono text-xs font-bold text-text-primary">
                          {order.id.slice(0,8)}...
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-text-primary">
                        {order.patient?.firstName} {order.patient?.lastName}
                      </div>
                      <div className="text-[10px] text-text-tertiary">
                        {order.patient?.userId?.slice(0,10)}...
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-text-secondary">
                        {order.items?.length} item(s)
                      </div>
                      <div className="text-[10px] text-text-tertiary truncate max-w-[150px]">
                        {order.items?.map((i: any) => i.product?.name).join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-text-primary">
                      ₹{order.totalAmount?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={order.status === 'Paid' ? 'success' : order.status === 'Pending' ? 'warning' : 'info'} size="sm">
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 rounded-lg border border-transparent hover:border-border hover:bg-white text-text-tertiary hover:text-text-primary transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
