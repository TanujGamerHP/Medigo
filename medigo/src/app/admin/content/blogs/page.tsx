"use client";

import React, { useState, useEffect } from "react";
import { FileText, Plus, Download, Trash2, Globe, Eye, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { AdvancedTable, TableColumn } from "@/components/enterprise/AdvancedTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

interface BlogItem {
  id: string;
  title: string;
  category: string;
  author: string;
  status: "Published" | "Draft";
  publishedDate: string;
  updatedDate: string;
  slug: string;
  shortDesc: string;
}

export default function BlogCMSPage() {
  const { show } = useToast();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await api.get('/api/v1/blogs');
        if (res.success && res.data) {
          setBlogs(res.data);
        }
      } catch (err) {
        console.error("Failed to load blogs", err);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

  const [showEditor, setShowEditor] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Research");
  const [shortDesc, setShortDesc] = useState("");
  const [content, setContent] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [status, setStatus] = useState<"Draft" | "Published">("Draft");

  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !shortDesc) {
      show("Please fill out Title, Slug, and Description fields.", "error");
      return;
    }

    const newBlog: BlogItem = {
      id: `b-${Math.floor(100 + Math.random() * 900)}`,
      title,
      category,
      author: "Lucky Malik",
      status,
      publishedDate: status === "Published" ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "--",
      updatedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      slug,
      shortDesc
    };

    setBlogs([newBlog, ...blogs]);
    setShowEditor(false);
    show("Blog article created successfully in CMS.", "success");

    // reset fields
    setTitle("");
    setSlug("");
    setShortDesc("");
    setContent("");
    setSeoTitle("");
    setSeoDesc("");
    setStatus("Draft");
  };

  const handleTogglePublish = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Published" ? "Draft" as const : "Published" as const;
    setBlogs(blogs.map(b => b.id === id ? { ...b, status: nextStatus, publishedDate: nextStatus === "Published" ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "--" } : b));
    show(`Article status updated to ${nextStatus}.`, "success");
  };

  const handleDelete = (id: string) => {
    setBlogs(blogs.filter(b => b.id !== id));
    show("Blog article deleted from CMS.", "warning");
  };

  const columns: TableColumn<BlogItem>[] = [
    {
      key: "title",
      label: "Article Title",
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-bold text-text-primary block text-sm">{row.title}</span>
          <span className="text-[10px] text-text-secondary block mt-0.5">Author: {row.author} • Slug: /{row.slug}</span>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (row) => <Badge variant="neutral" size="sm">{row.category}</Badge>,
    },
    {
      key: "publishedDate",
      label: "Published Date",
      sortable: true,
      render: (row) => <span className="text-xs text-text-secondary font-medium">{row.publishedDate}</span>,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <Badge variant={row.status === "Published" ? "success" : "neutral"} size="sm">
          {row.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleTogglePublish(row.id, row.status)}
            className={`px-2.5 py-1.5 border rounded-xl text-[10px] font-bold transition-all ${
              row.status === "Published"
                ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
            }`}
          >
            {row.status === "Published" ? "Draft" : "Publish"}
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
            title="Delete Article"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center select-none text-left">
        <h3 className="font-heading text-base font-bold text-text-primary">Blog Articles Registry</h3>
        <Button onClick={() => setShowEditor(true)} size="sm" className="font-bold" rightIcon={<Plus className="w-4 h-4" />}>
          Create Blog
        </Button>
      </div>

        <div className="bg-white p-5 border border-border rounded-3xl shadow-sm text-left">
          {loading ? (
            <div className="p-8 text-center text-text-secondary text-sm">Loading articles...</div>
          ) : (
            <AdvancedTable
              data={blogs}
              columns={columns}
              rowKey={(row) => row.id}
              searchKeys={["title", "category", "status"]}
              searchPlaceholder="Search blogs database..."
            />
          )}
        </div>

      {/* Editor Modal */}
      <Modal
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        title="Create New Blog Article"
        size="lg"
      >
        <form onSubmit={handleCreateBlog} className="space-y-4 text-left text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="blog-title" className="text-xs font-bold text-text-secondary uppercase">Article Title</label>
              <input
                id="blog-title"
                type="text"
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                }}
                placeholder="e.g. Dosing schedules reviews"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="blog-slug" className="text-xs font-bold text-text-secondary uppercase">URL Slug</label>
              <input
                id="blog-slug"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. dosing-schedules-reviews"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="blog-cat" className="text-xs font-bold text-text-secondary uppercase">Category</label>
              <select
                id="blog-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
              >
                <option value="Research">Research</option>
                <option value="Medication">Medication</option>
                <option value="Therapy">Therapy</option>
                <option value="Lifestyle">Lifestyle</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="blog-status" className="text-xs font-bold text-text-secondary uppercase">Publishing Status</label>
              <select
                id="blog-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as "Draft" | "Published")}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
              >
                <option value="Draft">Draft / Private</option>
                <option value="Published">Published / Live</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="blog-short" className="text-xs font-bold text-text-secondary uppercase">Short Excerpt Description</label>
            <input
              id="blog-short"
              type="text"
              required
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="e.g. Summary details shown on grid cards..."
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="blog-editor" className="text-xs font-bold text-text-secondary uppercase font-mono">Article Content Body (HTML/Prose)</label>
            <textarea
              id="blog-editor"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing article..."
              className="w-full p-3 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
            />
          </div>

          {/* SEO Block */}
          <div className="border-t border-border-light pt-4 space-y-4">
            <span className="text-[10px] text-text-tertiary uppercase font-bold block select-none">Search Engine Optimization (SEO) Meta Tags</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="blog-seo-title" className="text-xs font-bold text-text-secondary uppercase">SEO Title</label>
                <input
                  id="blog-seo-title"
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Meta Title tag"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="blog-seo-desc" className="text-xs font-bold text-text-secondary uppercase">Meta Description</label>
                <input
                  id="blog-seo-desc"
                  type="text"
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  placeholder="Meta Description tag"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-border-light">
            <Button 
              type="button" 
              onClick={() => setShowEditor(false)} 
              variant="outline" 
              size="sm" 
              className="font-bold border-border text-text-primary hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="font-bold">
              Save Article
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
