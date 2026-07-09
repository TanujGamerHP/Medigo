"use client";

import React, { useState, useEffect } from "react";
import { Star, Plus, Edit, Trash, Upload, CheckCircle2, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

export default function AdminReviewsPage() {
  const { show } = useToast();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    id: "",
    patientName: "",
    age: "",
    profileImage: "",
    beforeImage: "",
    afterImage: "",
    weightLossKg: "",
    durationMonths: "",
    reviewText: "",
    rating: "5",
    isSelectedForHome: false,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.request("/api/v1/reviews");
      setReviews(res.data || []);
    } catch (err) {
      console.error(err);
      show("Failed to fetch reviews", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real app, upload this file to the backend or Firebase
    // For now, we simulate a mock URL if there is no upload endpoint easily accessible,
    // or use FileReader for local preview if needed.
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, [fieldName]: reader.result as string }));
      show("Image loaded successfully", "success");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Manual validation to prevent silent failures on mobile due to out-of-view required fields
    if (!formData.patientName || !formData.age || !formData.weightLossKg || !formData.durationMonths || !formData.reviewText) {
      show("Please fill out all required fields (Name, Age, Weight Loss, Duration, and Text).", "error");
      return;
    }

    try {
      if (formData.id) {
        await api.patch(`/api/v1/reviews/${formData.id}`, formData);
        show("Review updated successfully", "success");
      } else {
        await api.post("/api/v1/reviews", formData);
        show("Review created successfully", "success");
      }
      setIsModalOpen(false);
      fetchReviews();
    } catch (err) {
      console.error(err);
      show("Failed to save review", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await api.delete(`/api/v1/reviews/${id}`);
      show("Review deleted", "success");
      fetchReviews();
    } catch (err) {
      show("Failed to delete", "error");
    }
  };

  const openNewModal = () => {
    setFormData({
      id: "", patientName: "", age: "", profileImage: "", beforeImage: "", afterImage: "",
      weightLossKg: "", durationMonths: "", reviewText: "", rating: "5", isSelectedForHome: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (review: any) => {
    setFormData({
      id: review.id,
      patientName: review.patientName,
      age: review.age.toString(),
      profileImage: review.profileImage || "",
      beforeImage: review.beforeImage || "",
      afterImage: review.afterImage || "",
      weightLossKg: review.weightLossKg.toString(),
      durationMonths: review.durationMonths.toString(),
      reviewText: review.reviewText,
      rating: review.rating.toString(),
      isSelectedForHome: review.isSelectedForHome,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-text-primary">Patient Reviews Hub</h1>
          <p className="text-sm text-text-secondary mt-1">Manage reviews, ratings, and featured homepage testimonials.</p>
        </div>
        <Button onClick={openNewModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Review
        </Button>
      </div>

      <Card padding="md">
        {loading ? (
          <div className="text-center py-10 text-text-tertiary font-bold text-sm">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10 text-text-tertiary font-bold text-sm">No reviews found. Click "Add Review" to create one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs text-text-secondary uppercase">
                <tr>
                  <th className="px-4 py-3 font-bold">Patient</th>
                  <th className="px-4 py-3 font-bold">Rating</th>
                  <th className="px-4 py-3 font-bold">Metrics</th>
                  <th className="px-4 py-3 font-bold">Featured</th>
                  <th className="px-4 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {r.profileImage ? (
                          <img src={r.profileImage} alt="" className="w-10 h-10 rounded-full object-cover border border-border" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {r.patientName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-text-primary">{r.patientName}</p>
                          <p className="text-xs text-text-tertiary">{r.age} yrs</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-green-600">-{r.weightLossKg}kg</span>
                      <span className="text-xs text-text-tertiary block">in {r.durationMonths}mo</span>
                    </td>
                    <td className="px-4 py-3">
                      {r.isSelectedForHome ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Home Page
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold">
                          Hidden
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(r)} className="p-2 text-text-secondary hover:text-primary transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(r.id)} className="p-2 text-text-secondary hover:text-error transition-colors">
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl max-h-[95vh] overflow-hidden">
            
            {/* Sticky Header */}
            <div className="px-6 py-4 border-b border-border/60 bg-slate-50 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-heading font-extrabold text-text-primary">
                {formData.id ? "Edit Review" : "Add New Review"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-text-tertiary hover:text-text-primary p-1 bg-white rounded-full shadow-sm border border-border"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Form */}
            <form id="reviewForm" onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6 text-sm">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <label className="font-bold text-text-primary block">Patient Name <span className="text-error">*</span></label>
                    <input value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})} placeholder="e.g. John Doe" className="w-full p-3 rounded-xl border focus:border-primary outline-none transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-bold text-text-primary block">Age <span className="text-error">*</span></label>
                    <input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} placeholder="e.g. 45" className="w-full p-3 rounded-xl border focus:border-primary outline-none transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <label className="font-bold text-text-primary block">Weight Loss (kg) <span className="text-error">*</span></label>
                    <input type="number" step="0.1" value={formData.weightLossKg} onChange={e => setFormData({...formData, weightLossKg: e.target.value})} placeholder="e.g. 12.5" className="w-full p-3 rounded-xl border focus:border-primary outline-none transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-bold text-text-primary block">Duration (Months) <span className="text-error">*</span></label>
                    <input type="number" value={formData.durationMonths} onChange={e => setFormData({...formData, durationMonths: e.target.value})} placeholder="e.g. 3" className="w-full p-3 rounded-xl border focus:border-primary outline-none transition-colors" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-text-primary block">Review Text <span className="text-error">*</span></label>
                  <textarea rows={4} value={formData.reviewText} onChange={e => setFormData({...formData, reviewText: e.target.value})} placeholder="Enter the patient's testimonial here..." className="w-full p-3 rounded-xl border focus:border-primary outline-none transition-colors resize-none"></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Images */}
                  {[
                    { key: "profileImage", label: "Profile Photo" },
                    { key: "beforeImage", label: "Before Photo" },
                    { key: "afterImage", label: "After Photo" },
                  ].map(img => (
                    <div key={img.key} className="space-y-2">
                      <label className="font-bold text-text-primary block">{img.label}</label>
                      <label className="flex flex-col items-center justify-center w-full h-32 sm:h-24 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors overflow-hidden relative group">
                        {(formData as any)[img.key] ? (
                          <>
                            <img src={(formData as any)[img.key]} alt="Upload preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <Edit className="w-5 h-5" />
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center text-text-tertiary text-xs">
                            <Upload className="w-5 h-5 mb-2 sm:mb-1" />
                            <span className="font-semibold">Upload Image</span>
                          </div>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, img.key)} />
                      </label>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border-light">
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                    <div className="space-y-1">
                      <label className="font-bold text-text-primary block text-xs">Star Rating</label>
                      <select value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} className="p-2.5 rounded-lg border font-bold text-sm bg-white outline-none focus:border-primary w-full sm:w-auto">
                        <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                        <option value="4">⭐⭐⭐⭐ (4)</option>
                        <option value="3">⭐⭐⭐ (3)</option>
                        <option value="2">⭐⭐ (2)</option>
                        <option value="1">⭐ (1)</option>
                      </select>
                    </div>
                    
                    <label className="flex items-center gap-2 cursor-pointer mt-0 sm:mt-5 bg-slate-50 p-2.5 sm:p-0 rounded-lg sm:bg-transparent">
                      <input type="checkbox" checked={formData.isSelectedForHome} onChange={e => setFormData({...formData, isSelectedForHome: e.target.checked})} className="w-5 h-5 rounded border-border text-primary focus:ring-primary accent-primary" />
                      <span className="font-bold text-text-primary text-sm">Feature on Home Page</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="px-6 py-4 border-t border-border bg-slate-50 flex items-center justify-end gap-3 shrink-0 rounded-b-2xl">
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto">Cancel</Button>
                <Button type="submit" className="w-full sm:w-auto shadow-md">Save Review</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
