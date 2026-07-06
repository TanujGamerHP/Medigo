"use client";

import React, { useState, useMemo } from "react";
import { BookOpen, Search, ArrowRight, Clock, Sparkles } from "lucide-react";
import Link from "next/link";

interface Article {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  date: string;
  imageBg: string;
}

const ARTICLES_DATA: Article[] = [
  {
    slug: "understanding-glp-1-weight-loss-mechanisms",
    title: "Understanding GLP-1: The Science of Metabolic Satiety",
    category: "GLP-1",
    excerpt: "Learn how GLP-1 receptor agonists mimic natural gut hormones to delay gastric emptying, reduce central cravings, and establish sustainable weight management.",
    readTime: "6 min read",
    date: "June 28, 2026",
    imageBg: "from-green-500/20 to-primary-600/30",
  },
  {
    slug: "managing-glp1-nausea-side-effects",
    title: "Managing Nausea and Side Effects During GLP-1 Titration",
    category: "Lifestyle",
    excerpt: "Clinical tips and nutritional habits to minimize initial nausea, digestive issues, and fatigue during your first few weeks on Semaglutide.",
    readTime: "5 min read",
    date: "June 25, 2026",
    imageBg: "from-blue-500/20 to-blue-600/30",
  },
  {
    slug: "nutritional-guidelines-for-medical-weight-loss",
    title: "Nutritional Frameworks for Active Medical Weight Loss",
    category: "Nutrition",
    excerpt: "Optimize your lean muscle retention and metabolic rates while on a calorie deficit. High-protein macronutrient planning made easy.",
    readTime: "8 min read",
    date: "June 18, 2026",
    imageBg: "from-amber-500/20 to-orange-600/30",
  },
  {
    slug: "combating-insulin-resistance-metabolic-syndrome",
    title: "Combating Insulin Resistance and Metabolic Syndrome",
    category: "Research",
    excerpt: "How therapeutic weight management programs improve cellular insulin sensitivity, glycemic ranges, and long-term cardiovascular indicators.",
    readTime: "7 min read",
    date: "June 12, 2026",
    imageBg: "from-purple-500/20 to-indigo-600/30",
  },
  {
    slug: "healthy-metabolic-habits-for-long-term-maintenance",
    title: "Building Healthy Habits for Weight Loss Maintenance",
    category: "Lifestyle",
    excerpt: "Dosage titration will eventually end. Establish solid circadian sleep, hydration, and resistance training frameworks to secure lifetime health results.",
    readTime: "5 min read",
    date: "June 05, 2026",
    imageBg: "from-red-500/20 to-rose-600/30",
  },
  {
    slug: "comparing-semaglutide-vs-tirzepatide-efficacy",
    title: "Clinical Analysis: Semaglutide vs. Tirzepatide Efficacy",
    category: "Research",
    excerpt: "An in-depth review of recent clinical trials comparing weight loss percentages, gastric safety, and dosage frequencies between the two primary GLP-1s.",
    readTime: "10 min read",
    date: "May 29, 2026",
    imageBg: "from-teal-500/20 to-cyan-600/30",
  },
];

const CATEGORIES = ["All Topics", "GLP-1", "Nutrition", "Lifestyle", "Research"];

export default function KnowledgeCenterPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => {
    return ARTICLES_DATA.filter((art) => {
      const matchesCategory = selectedCategory === "All Topics" || art.category === selectedCategory;
      const matchesSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Featured article is the first one in the main database
  const featuredArticle = ARTICLES_DATA[0];

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-b from-primary-50/50 to-background border-b border-border/20">
        <div className="relative z-10 container-custom text-center space-y-6 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            MediGo Knowledge Center
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary">
            Science-Backed <span className="gradient-text">Health Resources</span>
          </h1>
          <p className="text-text-secondary text-lg">
            Stay informed with verified medical articles regarding endocrinology, clinical weight management, peptide therapies, and diet protocols.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl mx-auto pt-4">
            <div className="absolute inset-y-0 left-4 top-4 flex items-center pointer-events-none text-text-tertiary">
              <Search className="w-4.5 h-4.5" />
            </div>
            <input
              type="text"
              placeholder="Search health topics, dietary guides, medications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full border border-border bg-white text-text-primary text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>
      </section>

      {/* Featured Post Card */}
      {searchQuery === "" && selectedCategory === "All Topics" && (
        <section className="py-8 container-custom max-w-5xl mx-auto">
          <Link
            id="featured-article-card"
            href={`/knowledge/${featuredArticle.slug}`}
            className="group grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white border border-border/50 overflow-hidden hover:shadow-xl transition-all duration-300 items-stretch"
          >
            {/* Visual block */}
            <div className={`lg:col-span-5 bg-gradient-to-tr ${featuredArticle.imageBg} min-h-[220px] flex items-center justify-center relative p-8`}>
              <div className="p-5 rounded-2xl bg-white shadow-md">
                <BookOpen className="w-12 h-12 text-primary" />
              </div>
            </div>

            {/* Text block */}
            <div className="lg:col-span-7 p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold">
                    Featured • {featuredArticle.category}
                  </span>
                  <span className="text-text-tertiary text-xs flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredArticle.readTime}
                  </span>
                </div>
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-text-primary group-hover:text-primary transition-colors leading-snug">
                  {featuredArticle.title}
                </h2>
                <p className="text-text-secondary text-sm md:text-base leading-relaxed line-clamp-3">
                  {featuredArticle.excerpt}
                </p>
              </div>

              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                Read Featured Article
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Categories Tabs Selector */}
      <section className="py-6 container-custom max-w-5xl mx-auto flex gap-2 overflow-x-auto scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? "bg-primary text-white shadow-sm"
                : "bg-white text-text-secondary border border-border/50 hover:bg-background"
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Grid of articles list */}
      <section className="py-6 container-custom max-w-5xl mx-auto">
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((art) => (
              <Link
                key={art.slug}
                id={`article-card-${art.slug}`}
                href={`/knowledge/${art.slug}`}
                className="group p-6 rounded-3xl bg-white border border-border/50 hover:border-primary/25 hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-[420px]"
              >
                <div className="space-y-4">
                  {/* Banner placeholder */}
                  <div className={`h-36 rounded-2xl bg-gradient-to-tr ${art.imageBg} flex items-center justify-center`}>
                    <BookOpen className="w-8 h-8 text-primary/60 group-hover:scale-110 transition-transform" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 font-semibold">
                        {art.category}
                      </span>
                      <span className="text-text-tertiary flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {art.readTime}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-base md:text-lg text-text-primary group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-text-secondary text-xs leading-relaxed line-clamp-3">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between text-xs font-bold text-primary">
                  <span>Read Article</span>
                  <span className="text-text-tertiary font-normal">{art.date}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-border/50 space-y-4 max-w-xl mx-auto">
            <BookOpen className="w-12 h-12 text-text-tertiary mx-auto" />
            <h3 className="text-lg font-heading font-bold text-text-primary">
              No Articles Found
            </h3>
            <p className="text-text-secondary text-sm max-w-sm mx-auto">
              We couldn&apos;t find any publications matching your filters. Try selecting a generic category or searching different clinical terms.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
