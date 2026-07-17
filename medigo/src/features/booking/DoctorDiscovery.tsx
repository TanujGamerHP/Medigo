"use client";

import React, { useState, useMemo } from "react";
import { Search, Star, ShieldCheck, Filter, ArrowRight, UserCheck, Calendar, DollarSign, Globe } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  reviews: number;
  imageInitials: string;
  availability: string;
  fee: number;
  languages: string[];
  profileImage?: string | null;
}

const DOCTORS_DB: Doctor[] = [];

const SPECIALTIES = ["All Specialties", "Obesity Medicine", "Endocrinology", "Internal Medicine", "Bariatric Medicine"];
const LANGUAGES = ["All Languages", "English", "Spanish", "Mandarin", "Korean"];

export function DoctorDiscovery() {
  const { show } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [selectedLanguage, setSelectedLanguage] = useState("All Languages");
  const [maxFee, setMaxFee] = useState(200);
  const [onlyAvailableToday, setOnlyAvailableToday] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/api/v1/doctors");
        if (res.success && res.data) {
          const mappedDoctors = res.data.map((doc: any) => ({
            id: doc.id,
            name: `Dr. ${doc.firstName} ${doc.lastName}`,
            specialty: doc.specialization,
            experience: doc.experience,
            rating: 4.8, // Default rating as schema doesn't have it
            reviews: Math.floor(Math.random() * 200) + 50, // Simulated reviews
            imageInitials: `${doc.firstName.charAt(0)}${doc.lastName.charAt(0)}`.toUpperCase(),
            availability: doc.availabilityStatus,
            fee: doc.consultationFee,
            languages: ["English"], // Hardcoded default
            profileImage: doc.profileImage || null,
          }));
          setDoctors(mappedDoctors);
        }
      } catch (err: any) {
        show(err.message || "Failed to load doctors", "error");
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty = selectedSpecialty === "All Specialties" || doc.specialty === selectedSpecialty;
      const matchesLanguage = selectedLanguage === "All Languages" || doc.languages.includes(selectedLanguage);
      const matchesFee = doc.fee <= maxFee;
      const matchesAvailability = !onlyAvailableToday || doc.availability.includes("Today") || doc.availability.includes("Available");
      return matchesSearch && matchesSpecialty && matchesLanguage && matchesFee && matchesAvailability;
    });
  }, [doctors, searchQuery, selectedSpecialty, selectedLanguage, maxFee, onlyAvailableToday]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Search & Filter cards */}
      <div className="p-6 bg-white rounded-3xl border border-border/50 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
          
          {/* Text search */}
          <div className="md:col-span-4 space-y-1.5 text-left">
            <label htmlFor="doc-search-input" className="text-xs font-bold text-text-secondary uppercase tracking-wider">Search Practitioner</label>
            <div className="relative">
              <div className="absolute left-3.5 top-3.5 text-text-tertiary">
                <Search className="w-4.5 h-4.5" />
              </div>
              <input
                id="doc-search-input"
                type="text"
                placeholder="e.g. Mitchell, Endocrinology"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Specialty */}
          <div className="md:col-span-3 space-y-1.5 text-left">
            <label htmlFor="doc-spec-select" className="text-xs font-bold text-text-secondary uppercase tracking-wider">Specialty</label>
            <select
              id="doc-spec-select"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
            >
              {SPECIALTIES.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div className="md:col-span-3 space-y-1.5 text-left">
            <label htmlFor="doc-lang-select" className="text-xs font-bold text-text-secondary uppercase tracking-wider">Language</label>
            <select
              id="doc-lang-select"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* Availability checkbox */}
          <div className="md:col-span-2 flex items-center justify-end pb-3">
            <label htmlFor="discovery-avail-toggle" className="flex items-center gap-2 cursor-pointer select-none">
              <input
                id="discovery-avail-toggle"
                type="checkbox"
                checked={onlyAvailableToday}
                onChange={(e) => setOnlyAvailableToday(e.target.checked)}
                className="w-4 h-4 text-primary border-border focus:ring-primary/20"
              />
              <span className="text-xs font-semibold text-text-secondary">Available Today</span>
            </label>
          </div>

        </div>

        {/* Custom Range Slider Fee Filter */}
        <div className="border-t border-border-light pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="space-y-1.5 text-left">
            <div className="flex justify-between items-center text-xs font-bold text-text-secondary uppercase">
              <span>Maximum Consultation Fee</span>
              <span className="text-primary font-black">₹{maxFee}</span>
            </div>
            <input
              type="range"
              min={100}
              max={250}
              step={10}
              value={maxFee}
              onChange={(e) => setMaxFee(Number(e.target.value))}
              className="w-full h-2 bg-background border rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
            />
          </div>
        </div>

      </div>

      {/* Discovery listings */}
      {filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="group p-6 rounded-3xl bg-white border border-border/50 hover:border-primary/25 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header details */}
                <div className="flex items-center gap-4">
                  {doc.profileImage ? (
                    <img src={doc.profileImage} alt={doc.name} className="w-14 h-14 rounded-full object-cover shrink-0 shadow-sm border border-primary-200/30" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary-50 to-primary-100/50 border border-primary-200/30 text-primary-950 font-heading font-extrabold text-lg flex items-center justify-center shadow-sm shrink-0">
                      {doc.imageInitials}
                    </div>
                  )}
                  <div>
                    <h3 className="font-heading font-bold text-base text-text-primary group-hover:text-primary transition-colors">
                      {doc.name}
                    </h3>
                    <p className="text-primary font-semibold text-[11px]">
                      {doc.specialty}
                    </p>
                  </div>
                </div>

                {/* Info parameters */}
                <div className="grid grid-cols-2 gap-4 border-y border-border-light py-4 my-5">
                  <div className="space-y-0.5">
                    <span className="text-text-tertiary text-[10px] block uppercase font-bold">Consult Fee</span>
                    <span className="text-text-primary font-black text-sm">₹{doc.fee}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-text-tertiary text-[10px] block uppercase font-bold">Reviews</span>
                    <span className="text-text-primary font-bold text-xs flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-warning text-warning shrink-0" />
                      {doc.rating} ({doc.reviews})
                    </span>
                  </div>
                </div>

                {/* Additional parameters */}
                <div className="space-y-2 text-xs text-text-secondary">
                  <div className="flex gap-2 items-center">
                    <Globe className="w-4 h-4 text-primary shrink-0" />
                    <span>Speaks: {doc.languages.join(", ")}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Calendar className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-semibold text-primary">{doc.availability}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 grid grid-cols-2 gap-3">
                <Link
                  href={`/doctors/${doc.id}`}
                  className="w-full text-center py-2.5 rounded-xl border border-border hover:border-primary text-text-primary hover:text-primary hover:bg-primary-50/10 text-xs font-bold transition-all duration-200"
                >
                  View Profile
                </Link>
                <Link
                  href={`/consultation?doctor=${doc.id}`}
                  className="w-full text-center py-2.5 rounded-xl gradient-cta text-white text-xs font-bold transition-all duration-200 shadow-sm"
                >
                  Book Visit
                </Link>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-border/50 max-w-xl mx-auto space-y-4">
          <UserCheck className="w-12 h-12 text-text-tertiary mx-auto" />
          <h4 className="font-heading font-bold text-lg text-text-primary">No matching providers found</h4>
          <p className="text-text-secondary text-sm max-w-sm mx-auto">
            Try adjusting your maximum fee slider, language filters, or specialization options.
          </p>
        </div>
      )}

    </div>
  );
}
