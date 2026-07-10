"use client";

import { MedicineBrand } from "@/data/medicines";
import { Pill } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface MedicineCardProps {
  medicine: MedicineBrand;
  onAddToCart: (item: any) => void;
  onBuyNow: (item: any) => void;
}

export function MedicineCard({ medicine, onAddToCart, onBuyNow }: MedicineCardProps) {
  const cartItem = {
    id: medicine.id,
    name: medicine.name,
    price: medicine.price,
    imageUrl: medicine.imageUrl,
    category: medicine.category,
  };

  return (
    <div className="group p-3 sm:p-4 rounded-xl bg-white border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col h-full w-full">
      
      {/* Product Image - Smaller */}
      <div className="w-full h-28 sm:h-32 mb-3 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 p-2 shrink-0 relative">
        <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider text-primary bg-primary-50 px-1.5 py-0.5 rounded-sm z-10">
          {medicine.category}
        </span>
        {medicine.imageUrl ? (
          <img src={medicine.imageUrl} alt={medicine.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
        ) : (
          <Pill className="w-8 h-8 text-primary-200" />
        )}
      </div>

      {/* Product Info */}
      <div className="flex-grow flex flex-col">
        <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-1 line-clamp-1">{medicine.name}</h3>
        <p className="text-[10px] sm:text-xs text-gray-500 mb-3 line-clamp-2 min-h-[32px]">
          {medicine.description}
        </p>

        <div className="mt-auto pt-2 border-t border-gray-50">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-gray-400 text-xs line-through">₹{medicine.price + 500}</span>
            <span className="text-lg sm:text-xl font-bold text-gray-900">₹{medicine.price}</span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1 text-xs h-8 sm:h-9 bg-primary-50 hover:bg-primary-100 text-primary border-primary-200"
              onClick={() => onAddToCart(cartItem)}
            >
              Add
            </Button>
            <Button 
              className="flex-1 text-xs h-8 sm:h-9 bg-[#25D366] hover:bg-[#20bd5a] text-white border-none"
              onClick={() => onBuyNow(cartItem)}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
