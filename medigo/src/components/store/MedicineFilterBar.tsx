"use client";

import { MedicationCategory, MedicationType } from "@/data/medicines";
import { Check } from "lucide-react";

export interface FilterState {
  category: MedicationCategory | "All";
  type: MedicationType | "All";
  brand: string | "All";
}

interface MedicineFilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  availableBrands: string[];
}

export function MedicineFilterBar({ filters, onChange, availableBrands }: MedicineFilterBarProps) {
  const updateFilter = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const categories = ["All", "Semaglutide", "Tirzepatide"];
  const types = ["All", "Injection", "Tablet"];

  return (
    <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4 mb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center overflow-x-auto hide-scrollbar pb-2 sm:pb-0">
          
          {/* Category Filter */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Category</span>
            <div className="flex gap-2 bg-gray-50 p-1 rounded-lg border border-gray-100">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => updateFilter("category", cat)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                    filters.category === cat 
                      ? "bg-white text-primary shadow-sm ring-1 ring-black/5" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden sm:block w-px h-8 bg-gray-200 shrink-0" />

          {/* Type Filter */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Type</span>
            <div className="flex gap-2 bg-gray-50 p-1 rounded-lg border border-gray-100">
              {types.map(type => (
                <button
                  key={type}
                  onClick={() => updateFilter("type", type)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                    filters.type === type 
                      ? "bg-white text-primary shadow-sm ring-1 ring-black/5" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden sm:block w-px h-8 bg-gray-200 shrink-0" />

          {/* Brand Filter */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Brand</span>
            <div className="flex gap-2">
              <button
                onClick={() => updateFilter("brand", "All")}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 border ${
                  filters.brand === "All" 
                    ? "bg-gray-900 text-white border-gray-900" 
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                All Brands
              </button>
              {availableBrands.map(brand => (
                <button
                  key={brand}
                  onClick={() => updateFilter("brand", brand)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 border flex items-center gap-1.5 ${
                    filters.brand === brand 
                      ? "bg-gray-900 text-white border-gray-900" 
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {filters.brand === brand && <Check className="w-3.5 h-3.5" />}
                  {brand}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
