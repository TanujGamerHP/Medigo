"use client";

import { MedicineBrand } from "@/data/medicines";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface MedicineCardProps {
  medicine: MedicineBrand;
  onSelect?: (item: MedicineBrand, dose: string) => void;
}

export function MedicineCard({ medicine, onSelect }: MedicineCardProps) {
  const [selectedDose, setSelectedDose] = useState<string | null>(null);

  const handleSelect = () => {
    if (onSelect && selectedDose) {
      onSelect(medicine, selectedDose);
    }
  };

  return (
    <div className="group relative bg-white rounded-[24px] p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col h-full overflow-hidden">
      
      {/* Type Badge */}
      <div className="absolute top-6 left-6 z-10">
        <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full tracking-wide uppercase border border-gray-100 shadow-sm">
          {medicine.medicationType}
        </span>
      </div>

      {/* Product Image Container */}
      <div className="w-full h-48 sm:h-56 mb-6 rounded-2xl flex items-center justify-center overflow-hidden bg-[#f8fafc] p-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        {medicine.imageUrl && (
          <motion.img 
            src={medicine.imageUrl} 
            alt={medicine.name} 
            className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-300"
            whileHover={{ scale: 1.04 }}
          />
        )}
      </div>

      {/* Product Info */}
      <div className="flex-grow flex flex-col">
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{medicine.name}</h3>
          <p className="text-sm font-medium text-gray-500 mt-1">{medicine.genericName}</p>
        </div>
        
        <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed">
          {medicine.description}
        </p>

        {/* Dosages */}
        <div className="mb-6 flex-grow">
          <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Available Dosages</p>
          <div className="flex flex-wrap gap-2">
            {medicine.dosages.map((dose) => (
              <button
                key={dose}
                onClick={() => setSelectedDose(dose)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-300 ${
                  selectedDose === dose
                    ? "bg-primary text-white border-primary shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:border-primary/50 hover:bg-primary/5 group-hover:border-primary/30"
                }`}
              >
                {dose}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto pt-4 flex flex-col gap-3 border-t border-gray-50">
          <Button 
            className="w-full h-12 text-sm font-semibold rounded-xl transition-all duration-300 shadow-sm hover:shadow-md group-hover:bg-primary-600"
            onClick={handleSelect}
            disabled={!selectedDose}
          >
            {selectedDose ? "Select Medication" : "Choose a Dosage"}
          </Button>
          
          <Link 
            href={`/store/${medicine.id}`} 
            className="w-full h-10 flex items-center justify-center text-sm font-medium text-gray-500 hover:text-primary transition-colors duration-300"
          >
            View Details
            <ChevronRight className="w-4 h-4 ml-1 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
}
