"use client";

import React, { useState, useEffect } from "react";
import { LayoutGrid, Eye, FileEdit } from "lucide-react";
import { api } from "@/lib/api";
import { AdvancedTable, TableColumn } from "@/components/enterprise/AdvancedTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

interface StaticPageItem {
  id: string;
  name: string;
  slug: string;
  status: "Published" | "Draft";
  lastEdited: string;
  htmlContent: string;
}

export default function StaticPagesCMSPage() {
  const { show } = useToast();
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPages() {
      try {
        const res = await api.get('/api/v1/cms/pages');
        if (res.success && res.data) {
          const mapped = res.data.map((p: any) => ({
            id: p.id,
            name: p.title,
            slug: p.slug,
            status: p.status,
            lastEdited: new Date(p.updatedAt).toLocaleDateString(),
            htmlContent: p.content
          }));
          setPages(mapped);
        }
      } catch (err) {
        console.error("Failed to load CMS pages", err);
      } finally {
        setLoading(false);
      }
    }
    loadPages();
  }, []);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const activePage = pages.find(p => p.id === selectedPageId);

  const handleOpenEdit = (page: StaticPageItem) => {
    setSelectedPageId(page.id);
    setEditingContent(page.htmlContent);
  };

  const handleSavePageContent = () => {
    if (!selectedPageId) return;
    setPages(pages.map(p => 
      p.id === selectedPageId 
        ? { ...p, htmlContent: editingContent, lastEdited: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) } 
        : p
    ));
    setSelectedPageId(null);
    show("Static page contents updated successfully in CMS.", "success");
  };

  const columns: TableColumn<StaticPageItem>[] = [
    {
      key: "name",
      label: "Page Name",
      sortable: true,
      render: (row) => <span className="font-bold text-text-primary text-xs">{row.name}</span>,
    },
    {
      key: "slug",
      label: "Route Path",
      sortable: true,
      render: (row) => <span className="text-xs text-text-secondary font-mono">/{row.slug}</span>,
    },
    {
      key: "lastEdited",
      label: "Last Edited",
      sortable: true,
      render: (row) => <span className="text-xs text-text-secondary font-medium">{row.lastEdited}</span>,
    },
    {
      key: "status",
      label: "Publishing Status",
      sortable: true,
      render: (row) => <Badge variant="success" size="sm">{row.status}</Badge>,
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (row) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleOpenEdit(row)}
            className="px-3 py-1.5 border border-border hover:border-primary text-text-primary hover:text-primary rounded-xl text-xs font-bold transition-all focus:outline-none bg-white"
          >
            Edit Page
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="p-1">
          {loading ? (
            <div className="p-8 text-center text-text-secondary text-sm">Loading pages...</div>
          ) : (
            <AdvancedTable
              data={pages}
              columns={columns}
              rowKey={(row) => row.id}
              searchKeys={["name", "slug", "status"]}
              searchPlaceholder="Search website pages..."
            />
          )}
        </div>
      </div>

      {/* Editor Modal */}
      <Modal
        isOpen={!!selectedPageId}
        onClose={() => setSelectedPageId(null)}
        title={activePage ? `Edit Static Page — ${activePage.name}` : "Edit Page"}
        size="lg"
      >
        {activePage && (
          <div className="space-y-4 text-left text-xs">
            <div className="space-y-1.5">
              <label htmlFor="static-html-input" className="text-xs font-bold text-text-secondary uppercase flex items-center gap-1.5">
                <FileEdit className="w-3.5 h-3.5 text-primary shrink-0" />
                Raw HTML / Rich Text Editor
              </label>
              <textarea
                id="static-html-input"
                rows={8}
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                className="w-full p-3 font-mono rounded-xl border border-border bg-background text-text-primary text-xs focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-border-light select-none">
              <Button 
                onClick={() => setSelectedPageId(null)} 
                variant="outline" 
                size="sm" 
                className="font-bold border-border text-text-primary hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button onClick={handleSavePageContent} size="sm" className="font-bold">
                Save & Publish
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
