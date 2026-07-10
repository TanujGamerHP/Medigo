"use client";

import { useState } from "react";
import { MedicineBrand, VariantForm } from "@/data/medicines";
import { Pill } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface MedicineCardProps {
  medicine: MedicineBrand;
  onAddToCart: (item: any) => void;
  onBuyNow: (item: any) => void;
}

export function MedicineCard({ medicine, onAddToCart, onBuyNow }: MedicineCardProps) {
  const [selectedForm, setSelectedForm] = useState<VariantForm>(medicine.variants[0].form);
  
  const currentVariant = medicine.variants.find(v => v.form === selectedForm) || medicine.variants[0];
  const [selectedDose, setSelectedDose] = useState<string>(currentVariant.doses[0]);

  // If the user switches form, auto-select the first dose of the new form
  const handleFormChange = (form: VariantForm) => {
    setSelectedForm(form);
    const newVariant = medicine.variants.find(v => v.form === form);
    if (newVariant) {
      setSelectedDose(newVariant.doses[0]);
    }
  };

  // Mock pricing logic: base price + extra for higher doses
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
    <div className="group p-6 rounded-2xl bg-white border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 flex flex-col min-w-[280px] sm:min-w-[auto]">
      <div className="w-full h-48 mb-4 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50 p-4 shrink-0">
        {medicine.imageUrl ? (
          <img src={medicine.imageUrl} alt={medicine.name} className="max-w-full max-h-full object-contain" />
        ) : (
          <Pill className="w-12 h-12 text-primary-200" />
        )}
      </div>

      <div className="text-left flex-grow">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary-50 px-2 py-0.5 rounded-full">
          {medicine.category}
        </span>
        <h3 className="mt-3 font-heading text-lg font-bold text-text-primary leading-tight">
          {medicine.name}
        </h3>
        <p className="mt-2 text-text-secondary text-sm line-clamp-2">
          {medicine.description}
        </p>
        
        {/* Variant Selection */}
        <div className="mt-4 space-y-3">
          <div>
            <p className="text-xs font-semibold text-text-secondary mb-1">Form</p>
            <div className="flex gap-2">
              {medicine.variants.map((v) => (
                <button
                  key={v.form}
                  onClick={() => handleFormChange(v.form)}
                  className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                    selectedForm === v.form 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-white text-text-secondary border-border hover:border-primary/50'
                  }`}
                >
                  {v.form}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-xs font-semibold text-text-secondary mb-1">Dose</p>
            <select 
              value={selectedDose}
              onChange={(e) => setSelectedDose(e.target.value)}
              className="w-full text-sm p-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
            >
              {currentVariant.doses.map(dose => (
                <option key={dose} value={dose}>{dose}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <span className="font-bold text-xl">₹{calculatedPrice}</span>
        </div>
      </div>
      
      <div className="mt-4 flex gap-2">
        {onAddToCart ? (
          <>
            <Button
              onClick={() => onAddToCart(cartItem)}
              variant="outline"
              className="flex-1 shadow-sm hover:shadow-md transition-all font-bold border-border"
            >
              Add to Cart
            </Button>
            <Button
              onClick={() => onBuyNow(cartItem)}
              variant="primary"
              className="flex-1 shadow-md hover:shadow-lg transition-all font-bold"
            >
              Buy Now
            </Button>
          </>
        ) : (
          <Button
            onClick={() => onBuyNow(cartItem)}
            variant="primary"
            fullWidth
            className="shadow-md hover:shadow-lg transition-all font-bold"
          >
            Buy Now
          </Button>
        )}
      </div>
    </div>
  );
}
