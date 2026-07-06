"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { ShieldCheck, Truck, ShoppingBag, Pill } from "lucide-react";

export default function PharmacyCheckoutPage() {
  const router = useRouter();
  const { show } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [shippingAddress, setShippingAddress] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/api/v1/products");
        if (res.success && res.data) {
          setProducts(res.data);
          if (res.data.length > 0) {
            setSelectedProduct(res.data[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load products");
      }
    };
    fetchProducts();
  }, []);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !shippingAddress) {
      show("Please select a product and provide shipping details.", "error");
      return;
    }
    
    setIsSending(true);
    try {
      const res = await api.post("/api/v1/orders/checkout", {
        productId: selectedProduct,
        quantity: 1,
        shippingAddress,
      });

      if (res.success || res.id) {
        show("Medication ordered successfully!", "success");
        router.push("/dashboard");
      }
    } catch (err: any) {
      show(err.message || "Failed to process pharmacy checkout. Ensure you have an active prescription.", "error");
    } finally {
      setIsSending(false);
    }
  };

  const product = products.find(p => p.id === selectedProduct);

  return (
    <div className="bg-background min-h-screen pt-32 pb-12">
      <div className="container-custom max-w-xl mx-auto space-y-8 text-center">
        <h1 className="font-heading text-3xl font-bold text-text-primary">
          Pharmacy Checkout
        </h1>
        <p className="text-sm text-text-secondary">
          Select your prescribed medication to initiate secure cold-chain delivery.
        </p>

        <div className="bg-white p-8 rounded-3xl border border-border/50 shadow-md text-left space-y-6">
          <form onSubmit={handleCheckout} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">
                Select Medication
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="" disabled>Select a medication</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - ${p.price}
                  </option>
                ))}
              </select>
            </div>

            {product && (
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-3">
                <Pill className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-text-primary">Prescription Requirement</p>
                  <p className="text-[10px] text-text-secondary mt-1 leading-relaxed">
                    A valid, active clinical prescription on file is required to dispense {product.name}. Your order will be blocked at checkout if a valid prescription is not found.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">
                Shipping Address
              </label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="123 Main St, Suite 100, City, ST 12345"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <Button
              type="submit"
              isLoading={isSending}
              fullWidth
              className="py-3 font-bold gradient-cta text-white"
            >
              Authorize Medication Order
            </Button>
          </form>
        </div>

        <div className="flex justify-center gap-4 text-[10px] text-text-tertiary">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
            HIPAA Compliant
          </span>
          <span className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-primary shrink-0" />
            2-Day Cold Delivery
          </span>
        </div>
      </div>
    </div>
  );
}
