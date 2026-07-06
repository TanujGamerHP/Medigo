"use client";

import React, { useState } from "react";
import { FolderOpen, Plus, Trash2 } from "lucide-react";
import { AdvancedTable, TableColumn } from "@/components/enterprise/AdvancedTable";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  articleCount: number;
  status: "Active" | "Inactive";
}

const mockCategories: CategoryItem[] = [];

export default function CategoriesCMSPage() {
  const { show } = useToast();
  const [categories, setCategories] = useState<CategoryItem[]>(mockCategories);
  const [newCatName, setNewCatName] = useState("");

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;

    const slug = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (categories.some(c => c.slug === slug)) {
      show("Category slug already exists.", "error");
      return;
    }

    const newCat: CategoryItem = {
      id: `${categories.length + 1}`,
      name: newCatName,
      slug,
      articleCount: 0,
      status: "Active"
    };

    setCategories([...categories, newCat]);
    setNewCatName("");
    show("Blog category created successfully.", "success");
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    show("Category deleted from CMS.", "warning");
  };

  const columns: TableColumn<CategoryItem>[] = [
    {
      key: "name",
      label: "Category Name",
      sortable: true,
      render: (row) => <span className="font-bold text-text-primary text-xs">{row.name}</span>,
    },
    {
      key: "slug",
      label: "URL Slug",
      sortable: true,
      render: (row) => <span className="text-xs text-text-secondary font-mono">/{row.slug}</span>,
    },
    {
      key: "articleCount",
      label: "Article Count",
      sortable: true,
      render: (row) => <span className="text-xs text-text-secondary font-semibold font-mono">{row.articleCount} articles</span>,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => <Badge variant="success" size="sm">{row.status}</Badge>,
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (row) => (
        <button
          onClick={() => handleDeleteCategory(row.id)}
          className="p-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
          title="Delete Category"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        {/* Left Column: Categories list */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white p-5 border border-border rounded-3xl shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-border mb-5 select-none">
              <FolderOpen className="w-5 h-5 text-primary-600" />
              <h3 className="font-heading text-sm font-bold text-text-primary">
                Blog Categories list
              </h3>
            </div>

            <AdvancedTable
              data={categories}
              columns={columns}
              rowKey={(row) => row.id}
              searchKeys={["name", "slug"]}
              searchPlaceholder="Search categories..."
            />
          </div>
        </div>

        {/* Right Column: Create form */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-border/50 shadow-sm space-y-4">
          <h3 className="font-heading text-sm font-bold text-text-primary pb-2 border-b border-border-light">
            Create Blog Category
          </h3>

          <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label htmlFor="cat-name-input" className="text-xs font-bold text-text-secondary uppercase">Category Name</label>
              <input
                id="cat-name-input"
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Clinical Trials"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <Button type="submit" size="sm" className="w-full font-bold">
              Add Category
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
