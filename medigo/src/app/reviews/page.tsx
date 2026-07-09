"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Star } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<number>(5);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await api.request(`/api/v1/reviews/public/rating/${activeTab}`);
        setReviews(res.data || []);
      } catch (err) {
        console.error("Failed to load reviews", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [activeTab]);

  return (
    <div className="pt-24 min-h-screen bg-slate-50">
      <Section>
        <div className="container-custom">
          <SectionHeading
            badge="Patient Reviews"
            title="Real Stories, Real Results"
            subtitle="Explore how our medical weight loss programs have changed lives, categorized by rating."
          />

          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8 mb-12">
            {[5, 4, 3, 2, 1].map(stars => (
              <Button
                key={stars}
                variant={activeTab === stars ? "primary" : "outline"}
                onClick={() => setActiveTab(stars)}
                className="font-bold flex items-center gap-2"
              >
                {stars} Stars <Star className={`w-4 h-4 ${activeTab === stars ? 'text-white' : 'text-warning'} fill-current`} />
              </Button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="text-center py-20 text-text-tertiary">Loading {activeTab}-star reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-border shadow-sm">
              <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-text-secondary font-bold text-lg">No {activeTab}-star reviews found</p>
              <p className="text-text-tertiary text-sm mt-1">We don't have any reviews in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {reviews.map(story => (
                <div key={story.id} className="p-6 rounded-2xl bg-white border border-border hover:shadow-xl transition-all duration-300">
                  {/* Images Before/After */}
                  {(story.beforeImage || story.afterImage) && (
                    <div className="flex gap-2 mb-4 h-32 overflow-hidden rounded-xl bg-slate-100">
                      {story.beforeImage && (
                        <div className="flex-1 relative group">
                          <img src={story.beforeImage} alt="Before" className="w-full h-full object-cover" />
                          <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">Before</span>
                        </div>
                      )}
                      {story.afterImage && (
                        <div className="flex-1 relative group">
                          <img src={story.afterImage} alt="After" className="w-full h-full object-cover" />
                          <span className="absolute bottom-2 right-2 bg-green-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">After</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: story.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                    ))}
                  </div>

                  <blockquote className="text-text-secondary leading-relaxed italic text-sm">
                    &ldquo;{story.reviewText}&rdquo;
                  </blockquote>

                  <div className="mt-6 pt-6 border-t border-border-light flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {story.profileImage ? (
                        <img src={story.profileImage} alt={story.patientName} className="w-10 h-10 rounded-full object-cover border border-border" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {story.patientName?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-heading font-bold text-text-primary text-sm">
                          {story.patientName}
                        </p>
                        <p className="text-[10px] text-text-tertiary">Age {story.age}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">
                        -{story.weightLossKg}kg
                      </p>
                      <p className="text-[10px] text-text-tertiary">
                        in {story.durationMonths} months
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
