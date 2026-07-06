"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock, Calendar, User, Share2, Link2, Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.09.044 1.613.115v3.146a10 10 0 0 0-.916-.036c-1.3 0-1.804.491-1.804 1.77v2.563h3.593l-.617 3.668h-2.976v8.06A11.3 11.3 0 0 0 12 24c-.32 0-.636-.013-.949-.039a11 11 0 0 1-1.95-.27" />
    </svg>
  );
}


interface ArticleDetails {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  authorRole: string;
  summary: string;
  content: { heading: string; text: string }[];
  imageBg: string;
}

const ARTICLES_DB: { [slug: string]: ArticleDetails } = {
  "understanding-glp-1-weight-loss-mechanisms": {
    slug: "understanding-glp-1-weight-loss-mechanisms",
    title: "Understanding GLP-1: The Science of Metabolic Satiety",
    category: "GLP-1",
    readTime: "6 min read",
    date: "June 28, 2026",
    author: "MediGo Clinical Team",
    authorRole: "Chief Medical Officer, MediGo",
    summary: "Glucagon-like peptide-1 (GLP-1) receptor agonists have revolutionized obesity treatment. In this clinical guide, we outline how GLP-1 works in the digestive system and brain to manage insulin, reduce food noise, and regulate metabolic outputs.",
    content: [
      {
        heading: "1. What is GLP-1?",
        text: "GLP-1 is a natural physiological hormone generated in the gut in response to food intake. It acts as an incretin, signaling insulin production, regulating pancreatic endocrine outputs, and transmitting satiety codes directly to the brain."
      },
      {
        heading: "2. The Mechanisms of Brain-Level Satiety",
        text: "One of the most notable features of GLP-1 treatments is the reduction of 'food noise' — the constant, intrusive thoughts about eating. By binding to GLP-1 receptors in the hypothalamus, medications decrease hunger codes and increase feelings of fullness."
      },
      {
        heading: "3. Slowing Gastric Emptying",
        text: "At the digestive tier, GLP-1 agonists slow gastric motility. By delaying the rate at which your stomach empties its contents, digestion takes longer, leading to extended fullness and calorie restriction without feelings of starvation."
      },
      {
        heading: "4. Glycemic Control & Insulin Sensitivity",
        text: "For patients with insulin resistance, GLP-1 peptides stimulate insulin release in response to glucose rises. This keeps circulating blood sugar levels stable, reducing high-fat cravings and supporting chronic cardiovascular health."
      }
    ],
    imageBg: "from-green-500/25 to-primary-600/30",
  },
  "managing-glp1-nausea-side-effects": {
    slug: "managing-glp1-nausea-side-effects",
    title: "Managing Nausea and Side Effects During GLP-1 Titration",
    category: "Lifestyle",
    readTime: "5 min read",
    date: "June 25, 2026",
    author: "Dr. James Park",
    authorRole: "Endocrinology Lead, MediGo",
    summary: "Starting a GLP-1 program involves an adjustment period for your gastrointestinal tract. Learn standard methods to combat nausea, fatigue, and stomach cramps during the titration phase.",
    content: [
      {
        heading: "1. Understanding Titration Schedules",
        text: "GLP-1 prescriptions are started at low, sub-therapeutic doses and slowly titrated upwards over weeks. This titration allows the pancreas and gut receptors to build tolerance, mitigating side effects."
      },
      {
        heading: "2. Dietary Tweaks for Nausea Support",
        text: "Eat smaller meals more frequently. Avoid highly processed, high-fat, or deep-fried foods which delay digestion further and cause acid reflux. Focus on lean proteins, clear broths, and high-hydration vegetables."
      },
      {
        heading: "3. The Importance of Electrolytes and Hydration",
        text: "Slowing digestion can reduce your thirst drive. Make sure to drink at least 80 ounces of water daily. Adding sugar-free electrolyte mixes can prevent initial fatigue, brain fog, and muscle cramps."
      }
    ],
    imageBg: "from-blue-500/25 to-blue-600/30",
  }
};

const DEFAULT_ARTICLE: ArticleDetails = {
  slug: "understanding-glp-1-weight-loss-mechanisms",
  title: "Understanding GLP-1: The Science of Metabolic Satiety",
  category: "GLP-1",
  readTime: "6 min read",
  date: "June 28, 2026",
  author: "Dr. Sarah Mitchell",
  authorRole: "Chief Medical Officer, MediGo",
  summary: "Glucagon-like peptide-1 (GLP-1) receptor agonists have revolutionized obesity treatment. In this clinical guide, we outline how GLP-1 works in the digestive system and brain to manage insulin, reduce food noise, and regulate metabolic outputs.",
  content: [
    {
      heading: "1. What is GLP-1?",
      text: "GLP-1 is a natural physiological hormone generated in the gut in response to food intake. It acts as an incretin, signaling insulin production, regulating pancreatic endocrine outputs, and transmitting satiety codes directly to the brain."
    },
    {
      heading: "2. The Mechanisms of Brain-Level Satiety",
      text: "One of the most notable features of GLP-1 treatments is the reduction of 'food noise' — the constant, intrusive thoughts about eating. By binding to GLP-1 receptors in the hypothalamus, medications decrease hunger codes and increase feelings of fullness."
    },
    {
      heading: "3. Slowing Gastric Emptying",
      text: "At the digestive tier, GLP-1 agonists slow gastric motility. By delaying the rate at which your stomach empties its contents, digestion takes longer, leading to extended fullness and calorie restriction without feelings of starvation."
    },
    {
      heading: "4. Glycemic Control & Insulin Sensitivity",
      text: "For patients with insulin resistance, GLP-1 peptides stimulate insulin release in response to glucose rises. This keeps circulating blood sugar levels stable, reducing high-fat cravings and supporting chronic cardiovascular health."
    }
  ],
  imageBg: "from-green-500/25 to-primary-600/30",
};

export default function BlogDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "understanding-glp-1-weight-loss-mechanisms";
  const article = ARTICLES_DB[slug] || DEFAULT_ARTICLE;

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Back to listings */}
      <div className="pt-28 pb-6 container-custom max-w-4xl mx-auto">
        <Link
          href="/knowledge"
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Knowledge Center
        </Link>
      </div>

      {/* Main Container */}
      <article className="container-custom max-w-4xl mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="bg-white p-6 md:p-10 rounded-3xl border border-border/50 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider">
              {article.category}
            </span>
            <span className="text-xs text-text-secondary flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {article.date}
            </span>
            <span className="text-xs text-text-secondary flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {article.readTime}
            </span>
          </div>

          <h1 className="font-heading font-bold text-3xl md:text-5xl text-text-primary leading-tight">
            {article.title}
          </h1>

          {/* Author Block */}
          <div className="flex items-center gap-3 pt-4 border-t border-border-light">
            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary flex items-center justify-center font-heading font-extrabold text-sm shadow-inner">
              {article.author.split(" ").slice(-1)[0][0]}
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">{article.author}</p>
              <p className="text-xs text-text-secondary">{article.authorRole}</p>
            </div>
          </div>
        </div>

        {/* Thumbnail Hero Banner */}
        <div className={`h-[240px] md:h-[360px] rounded-3xl bg-gradient-to-tr ${article.imageBg} flex items-center justify-center shadow-inner relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <div className="p-6 rounded-2xl bg-white shadow-lg relative z-10">
            <BookOpen className="w-16 h-16 text-primary" />
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Table of Contents sticky panel */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-border/50 shadow-sm sticky top-28 space-y-4">
            <h4 className="font-heading font-bold text-sm text-text-primary uppercase tracking-wider border-b border-border-light pb-2">
              Key Sections
            </h4>
            <div className="space-y-2.5">
              {article.content.map((sec, idx) => (
                <a
                  key={idx}
                  href={`#section-${idx}`}
                  className="block text-xs font-semibold text-text-secondary hover:text-primary transition-colors leading-relaxed"
                >
                  {sec.heading}
                </a>
              ))}
            </div>

            {/* Share options */}
            <div className="border-t border-border-light pt-4 space-y-3">
              <h5 className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Share Publication</h5>
              <div className="flex gap-2">
                <button 
                  onClick={() => alert("Copied link to clipboard!")}
                  className="p-2 rounded-xl bg-background border border-border hover:border-primary hover:text-primary transition-all text-text-secondary"
                  aria-label="Copy link"
                >
                  <Link2 className="w-4 h-4" />
                </button>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-background border border-border hover:border-primary hover:text-primary transition-all text-text-secondary flex items-center justify-center"
                  aria-label="Share on X"
                >
                  <XIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-background border border-border hover:border-primary hover:text-primary transition-all text-text-secondary flex items-center justify-center"
                  aria-label="Share on Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>

              </div>
            </div>
          </div>

          {/* Prose Content */}
          <div className="lg:col-span-8 bg-white p-8 md:p-10 rounded-3xl border border-border/50 shadow-md space-y-8">
            <p className="text-base md:text-lg text-text-primary font-medium leading-relaxed border-l-4 border-primary pl-4 py-1 italic">
              {article.summary}
            </p>

            {article.content.map((sec, idx) => (
              <div key={idx} id={`section-${idx}`} className="space-y-3 scroll-mt-28">
                <h3 className="font-heading font-bold text-xl text-text-primary">
                  {sec.heading}
                </h3>
                <p className="text-text-secondary text-sm md:text-base leading-relaxed">
                  {sec.text}
                </p>
              </div>
            ))}

            {/* Medical Review Disclaimer */}
            <div className="p-5 rounded-2xl bg-background border border-border/40 text-xs text-text-tertiary leading-relaxed">
              <strong>Medical Editorial Review:</strong> This article is reviewed and updated periodically by our board-certified clinical board. Peer-reviewed metabolic data and FDA therapeutic guidelines serve as core editorial baselines.
            </div>
          </div>

        </div>

      </article>
    </div>
  );
}
