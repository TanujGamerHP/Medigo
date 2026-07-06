"use client";

import React, { useState } from "react";
import { Edit2, Eye, FileText, Globe, Save, Trash2, Plus, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface BlogArticle {
  id: string;
  title: string;
  category: string;
  status: "Draft" | "Published";
  slug: string;
  metaDesc: string;
}

const initialArticles: BlogArticle[] = [
  { id: "1", title: "Understanding GLP-1: Mechanism of action & benefits", category: "Medications", status: "Published", slug: "understanding-glp-1", metaDesc: "Explore how GLP-1 weight loss medications compound metabolic health signals to improve insulin sensitivity." },
  { id: "2", title: "Compounding Semaglutide vs Brand Wegovy", category: "Weight Loss", status: "Draft", slug: "compounded-semaglutide-vs-wegovy", metaDesc: "Learn the core cost, availability, and clinical differences between compounded semaglutide and brand Wegovy." },
];

export function CMSModule() {
  const { addToast } = useToast();
  const [articles, setArticles] = useState<BlogArticle[]>(initialArticles);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  // Editor form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Weight Loss");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [metaDesc, setMetaDesc] = useState("");

  const handleOpenEditor = (articleId?: string) => {
    if (articleId) {
      const art = articles.find((a) => a.id === articleId);
      if (art) {
        setSelectedArticleId(art.id);
        setTitle(art.title);
        setCategory(art.category);
        setSlug(art.slug);
        setMetaDesc(art.metaDesc);
        setContent("This is mock blog post contents detailing medical parameters and dosage guidelines.");
      }
    } else {
      setSelectedArticleId(null);
      setTitle("");
      setCategory("Weight Loss");
      setSlug("");
      setContent("");
      setMetaDesc("");
    }
    setIsEditorOpen(true);
  };

  const handleSaveArticle = (status: "Draft" | "Published") => {
    if (!title.trim() || !slug.trim()) {
      addToast({
        type: "error",
        message: "Title and slug are required to compile blog articles.",
      });
      return;
    }

    if (selectedArticleId) {
      setArticles(
        articles.map((a) =>
          a.id === selectedArticleId
            ? { ...a, title, category, slug, metaDesc, status }
            : a
        )
      );
      addToast({ type: "success", message: "CMS article updated successfully." });
    } else {
      const newArt: BlogArticle = {
        id: String(articles.length + 1),
        title,
        category,
        slug,
        metaDesc,
        status,
      };
      setArticles([...articles, newArt]);
      addToast({ type: "success", message: "CMS article created successfully." });
    }
    setIsEditorOpen(false);
  };

  const handleDelete = (id: string) => {
    setArticles(articles.filter((a) => a.id !== id));
    addToast({ type: "info", message: "Blog article deleted from CMS." });
  };

  return (
    <div className="space-y-6">
      {/* Article Listing Grid */}
      {!isEditorOpen ? (
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border mb-2 select-none">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-600" />
              <h3 className="font-heading text-sm font-bold text-text-primary">
                Knowledge Center Articles
              </h3>
            </div>
            <button
              onClick={() => handleOpenEditor()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow transition-all hover:scale-[1.02]"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Article
            </button>
          </div>

          <div className="divide-y divide-border-light">
            {articles.map((art) => (
              <div key={art.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-text-primary">{art.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                      art.status === "Published" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-500"
                    }`}>
                      {art.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-text-secondary mt-1">
                    Slug: /knowledge/{art.slug} • Category: {art.category}
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={() => handleOpenEditor(art.id)}
                    className="p-1.5 rounded hover:bg-slate-50 border border-border text-text-secondary hover:text-text-primary transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(art.id)}
                    className="p-1.5 rounded hover:bg-red-50 border border-red-100 text-red-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Blog Article Editor Form */
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content Workspace */}
          <div className="xl:col-span-2 bg-white border border-border rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h4 className="font-heading text-sm font-bold text-text-primary">Article Content Editor</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 border border-border rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveArticle("Draft")}
                  className="px-4 py-2 border border-border rounded-xl text-xs font-bold text-text-primary hover:bg-slate-50 transition-all"
                >
                  Save Draft
                </button>
                <button
                  onClick={() => handleSaveArticle("Published")}
                  className="px-4 py-2 bg-primary hover:bg-primary-600 text-slate-950 rounded-xl text-xs font-bold shadow transition-all"
                >
                  Publish Live
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-text-tertiary block font-bold uppercase mb-1">Article Title</label>
              <input
                type="text"
                placeholder="Enter article title..."
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                }}
                className="w-full p-3 border border-border rounded-xl text-xs focus:outline-none bg-white text-text-primary font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-text-tertiary block font-bold uppercase mb-1">Slug URL PATH</label>
                <input
                  type="text"
                  placeholder="understanding-glp-1"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full p-2.5 border border-border rounded-xl text-xs focus:outline-none bg-white text-text-primary font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-text-tertiary block font-bold uppercase mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 border border-border rounded-xl text-xs focus:outline-none bg-white text-text-primary font-medium"
                >
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Medications">Medications</option>
                  <option value="Nutrition">Nutrition</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-text-tertiary block font-bold uppercase mb-1">Article Body (Markdown)</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing article parameters, clinical studies, dosage instructions..."
                rows={10}
                className="w-full p-4 border border-border rounded-xl text-xs focus:outline-none bg-white text-text-primary font-medium"
              />
            </div>
          </div>

          {/* SEO Metadata Form & Google Snippet Previews */}
          <div className="space-y-6">
            <div className="bg-white border border-border rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-1 pb-3 border-b border-border select-none">
                <Globe className="w-4.5 h-4.5 text-primary-600" />
                <h4 className="font-heading text-sm font-bold text-text-primary">SEO Metadata Form</h4>
              </div>

              <div>
                <label className="text-[10px] text-text-tertiary block font-bold uppercase mb-1">Meta Description</label>
                <textarea
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                  placeholder="Enter SEO meta description (keep under 160 characters)..."
                  rows={3}
                  className="w-full p-3 border border-border rounded-xl text-xs focus:outline-none bg-white text-text-primary"
                />
              </div>

              {/* Cover Image Simulation */}
              <div className="border-t border-border pt-4">
                <label className="text-[10px] text-text-tertiary block font-bold uppercase mb-2 select-none">Cover Illustration</label>
                <div className="border border-dashed border-border rounded-xl p-6 text-center hover:bg-slate-50 cursor-pointer transition-all">
                  <Sparkles className="w-6 h-6 text-primary mx-auto mb-2" />
                  <span className="text-[10px] text-text-secondary block font-semibold">Select cover image to compile</span>
                  <span className="text-[8px] text-text-tertiary block mt-1">Recommended: 1200 x 630 px</span>
                </div>
              </div>
            </div>

            {/* Google Search Snippet Preview */}
            <div className="bg-white border border-border rounded-2xl p-5 shadow-sm space-y-3 select-none">
              <div className="flex items-center gap-1.5 pb-2 border-b border-border">
                <Eye className="w-4 h-4 text-slate-500" />
                <h4 className="font-heading text-xs font-bold text-text-secondary uppercase tracking-wider">Google SERP Snippet Preview</h4>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-slate-500 block truncate">https://medigo.com › knowledge › {slug || "slug-path"}</div>
                <div className="text-base text-blue-800 hover:underline cursor-pointer font-medium block truncate">
                  {title || "Please enter title to preview snippet..."} | MediGo
                </div>
                <div className="text-xs text-text-secondary leading-normal block line-clamp-2">
                  {metaDesc || "Please enter description to preview Google Search snippet metadata..."}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
