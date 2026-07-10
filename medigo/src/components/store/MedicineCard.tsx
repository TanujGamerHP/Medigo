"use client";

import { useState } from "react";
import { MedicineBrand, VariantForm } from "@/data/medicines";
import { Pill } from "lucide-react";

interface MedicineCardProps {
  medicine: MedicineBrand;
  onAddToCart: (item: any) => void;
  onBuyNow: (item: any) => void;
}

export function MedicineCard({ medicine, onAddToCart, onBuyNow }: MedicineCardProps) {
  const [selectedForm, setSelectedForm] = useState<VariantForm>(medicine.variants[0].form);
  
  const currentVariant = medicine.variants.find(v => v.form === selectedForm) || medicine.variants[0];
  const [selectedDose, setSelectedDose] = useState<string>(currentVariant.doses[0]);

  const handleFormChange = (form: VariantForm) => {
    setSelectedForm(form);
    const newVariant = medicine.variants.find(v => v.form === form);
    if (newVariant) {
      setSelectedDose(newVariant.doses[0]);
    }
  };

  const doseIndex = currentVariant.doses.indexOf(selectedDose);
  const calculatedPrice = currentVariant.basePrice + (doseIndex * 200);

  const cartItem = {
    id: `${medicine.id}-${selectedForm}-${selectedDose}`,
    name: `${medicine.name} (${medicine.category}) - ${selectedForm} ${selectedDose}`,
    price: calculatedPrice,
    imageUrl: medicine.imageUrl,
    category: medicine.category,
  };

  return (
    <div className="group p-3 sm:p-4 rounded-xl bg-white border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col h-full w-[220px] sm:w-[260px]">
      
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

      <div className="text-left flex-grow flex flex-col">
        {/* Title & Description */}
        <h3 className="font-heading text-base font-bold text-text-primary leading-tight line-clamp-1">
          {medicine.name}
        </h3>
        <p className="mt-1 text-text-tertiary text-[11px] leading-tight line-clamp-2 min-h-[28px]">
          {medicine.description}
        </p>
        
        {/* Form Selector (Pills) */}
        <div className="mt-3 flex gap-1.5">
          {medicine.variants.map((v) => (
            <button
              key={v.form}
              onClick={() => handleFormChange(v.form)}
              className={`flex-1 py-1 text-[10px] font-bold rounded border transition-colors ${
                selectedForm === v.form 
                  ? 'bg-primary/10 text-primary border-primary' 
                  : 'bg-background text-text-tertiary border-border hover:border-primary/50'
              }`}
            >
              {v.form}
            </button>
          ))}
        </div>
        
        {/* Dose Selector */}
        <div className="mt-2">
          <select 
            value={selectedDose}
            onChange={(e) => setSelectedDose(e.target.value)}
            className="w-full text-xs font-medium p-1.5 rounded border border-border bg-background focus:ring-1 focus:ring-primary/50 outline-none text-text-secondary"
          >
            {currentVariant.doses.map(dose => (
              <option key={dose} value={dose}>{dose}</option>
            ))}
          </select>
        </div>

        <div className="mt-auto pt-3 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-text-tertiary line-through leading-none mb-0.5">₹{calculatedPrice + 500}</span>
            <span className="font-bold text-lg leading-none text-text-primary">₹{calculatedPrice}</span>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onAddToCart && onAddToCart(cartItem)}
          className="flex-1 py-1.5 rounded-lg text-xs font-bold text-primary bg-primary-50 border border-primary-200 hover:bg-primary-100 transition-colors"
        >
          Add
        </button>
        <button
          onClick={() => onBuyNow && onBuyNow(cartItem)}
          className="flex-1 py-1.5 rounded-lg text-xs font-bold text-white bg-primary hover:bg-primary-dark transition-colors shadow-sm"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
