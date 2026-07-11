"use client";

import { useState } from "react";
import { MEDICINE_CATALOG, MedicineBrand } from "@/data/medicines";
import { MedicineCard } from "@/components/store/MedicineCard";
import { MedicineFilterBar, FilterState } from "@/components/store/MedicineFilterBar";
import { motion, AnimatePresence } from "framer-motion";
import { Pill, Check, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface CartItem {
  product: MedicineBrand;
  dose: string;
  quantity: number;
}

export default function StorePage() {
  const [filters, setFilters] = useState<FilterState>({
    category: "All",
    type: "All",
    brand: "All",
  });
  
  const [simulatedPlan, setSimulatedPlan] = useState<"None" | "1-Month" | "3-Months" | "6-Months">("1-Month");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const availableBrands = Array.from(new Set(MEDICINE_CATALOG.map(m => m.name)));

  const filteredProducts = MEDICINE_CATALOG.filter(p => {
    if (filters.category !== "All" && p.category !== filters.category) return false;
    if (filters.type !== "All" && p.medicationType !== filters.type) return false;
    if (filters.brand !== "All" && p.name !== filters.brand) return false;
    return true;
  });

  const handleSelectMedication = (medicine: MedicineBrand, dose: string) => {
    const exists = cart.find(item => item.product.id === medicine.id && item.dose === dose);
    if (!exists) {
      setCart(prev => [...prev, { product: medicine, dose, quantity: 1 }]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const cartTotal = cart.reduce((total, item) => total + item.product.basePrice * item.quantity, 0);

  // Group by category for the display sections
  const semaglutide = filteredProducts.filter(p => p.category === "Semaglutide");
  const tirzepatide = filteredProducts.filter(p => p.category === "Tirzepatide");

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans selection:bg-primary/20">
      <main className="flex-grow pt-24 pb-20">
        
        {/* Page Header */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              GLP-1 Medications
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 font-medium">
              Choose your medication by category, brand and dosage.
            </p>
          </motion.div>
        </div>

        {/* Membership Simulator Dropdown */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex justify-center">
          <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Simulate Membership Plan:</span>
            <select 
              className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2 font-medium"
              value={simulatedPlan}
              onChange={(e) => setSimulatedPlan(e.target.value as any)}
            >
              <option value="None">None (Guest)</option>
              <option value="1-Month">MediGo Care - 1 Month</option>
              <option value="3-Months">MediGo Care - 3 Months</option>
              <option value="6-Months">MediGo Care - 6 Months</option>
            </select>
          </div>
        </div>

        <MedicineFilterBar 
          filters={filters} 
          onChange={setFilters} 
          availableBrands={availableBrands} 
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center">
              <Pill className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No medications found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters to see more options.</p>
              <Button 
                variant="outline" 
                onClick={() => setFilters({ category: "All", type: "All", brand: "All" })}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-24">
              
              {/* Section 1: Semaglutide */}
              {semaglutide.length > 0 && (
                <section>
                  <div className="mb-8 border-b border-gray-200 pb-4">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Semaglutide</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {semaglutide.map((medicine, i) => (
                      <motion.div
                        key={medicine.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <MedicineCard 
                          medicine={medicine} 
                          onSelect={handleSelectMedication}
                          disabledReason={
                            simulatedPlan === "1-Month" && medicine.medicationType === "Injection"
                              ? "Upgrade plan to buy injections"
                              : undefined
                          }
                        />
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Section 2: Tirzepatide */}
              {tirzepatide.length > 0 && (
                <section>
                  <div className="mb-8 border-b border-gray-200 pb-4">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Tirzepatide</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tirzepatide.map((medicine, i) => (
                      <motion.div
                        key={medicine.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <MedicineCard 
                          medicine={medicine} 
                          onSelect={handleSelectMedication}
                          disabledReason={
                            simulatedPlan === "1-Month" && medicine.medicationType === "Injection"
                              ? "Upgrade plan to buy injections"
                              : undefined
                          }
                        />
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

            </div>
          )}
        </div>
      </main>

      {/* Slide-out Cart */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-gray-900" />
                  <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 bg-gray-50/50">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                    <ShoppingBag className="w-12 h-12 opacity-20" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item, index) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={`${item.product.id}-${item.dose}`}
                        className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm relative group"
                      >
                        <button 
                          onClick={() => removeFromCart(index)}
                          className="absolute -top-2 -right-2 p-1.5 bg-white border border-gray-200 text-gray-400 hover:text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="w-20 h-20 bg-[#f8fafc] rounded-xl p-2 shrink-0 flex items-center justify-center">
                          {item.product.imageUrl ? (
                            <img src={item.product.imageUrl} alt={item.product.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                          ) : (
                            <Pill className="w-6 h-6 text-primary-200" />
                          )}
                        </div>
                        <div className="flex-grow py-1">
                          <h4 className="font-bold text-gray-900 text-sm">{item.product.name}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{item.product.medicationType} • {item.dose}</p>
                          <div className="mt-2 font-bold text-gray-900">₹{item.product.basePrice}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 bg-white border-t border-gray-100">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Subtotal</span>
                      <span>₹{cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Prescription Fee</span>
                      <span className="text-green-600 font-medium">Included</span>
                    </div>
                    <div className="h-px bg-gray-100 my-2" />
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>₹{cartTotal}</span>
                    </div>
                  </div>
                  
                  <Link href="/pharmacy/checkout" onClick={() => setIsCartOpen(false)}>
                    <Button className="w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/25">
                      Proceed to Checkout
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
