"use client";

import React, { useState } from "react";
import { Images, Plus, Trash2, Upload, Calendar } from "lucide-react";
import { AdvancedTable, TableColumn } from "@/components/enterprise/AdvancedTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  status: "Active" | "Scheduled" | "Expired";
  schedule: string;
}

export default function AdminBannersPage() {
  const { show } = useToast();
  const [banners, setBanners] = useState<BannerItem[]>([]);

  const handleDelete = (id: string) => {
    setBanners(banners.filter(b => b.id !== id));
    show("Marketing banner deleted from CMS.", "warning");
  };

  const columns: TableColumn<BannerItem>[] = [
    {
      key: "title",
      label: "Banner Title / Subtitle",
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-bold text-text-primary block text-sm">{row.title}</span>
          <span className="text-[10px] text-text-secondary block mt-0.5">{row.subtitle}</span>
        </div>
      ),
    },
    {
      key: "schedule",
      label: "Active Schedule",
      sortable: true,
      render: (row) => <span className="text-xs text-text-secondary font-medium">{row.schedule}</span>,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => {
        const variantMap = {
          Active: "success" as const,
          Scheduled: "info" as const,
          Expired: "neutral" as const
        };
        return <Badge variant={variantMap[row.status]} size="sm">{row.status}</Badge>;
      },
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (row) => (
        <button
          onClick={() => handleDelete(row.id)}
          className="p-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
          title="Delete Banner"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Banners List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white p-5 border border-border rounded-3xl shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-border mb-5 select-none">
              <Images className="w-5 h-5 text-primary-600" />
              <h3 className="font-heading text-sm font-bold text-text-primary">
                Platform Hero Banners
              </h3>
            </div>

            <AdvancedTable
              data={banners}
              columns={columns}
              rowKey={(row) => row.id}
              searchKeys={["title", "subtitle"]}
              searchPlaceholder="Search banners..."
            />
          </div>
        </div>

        {/* Right Column: Upload mock */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-border/50 shadow-sm space-y-4 text-xs font-semibold text-text-secondary">
          <h3 className="font-heading text-sm font-bold text-text-primary pb-2 border-b border-border-light">
            Upload Banner Graphics
          </h3>

          <div 
            onClick={() => show("Simulating drag & drop upload for banner files...", "info")}
            className="border-2 border-dashed border-border-light hover:border-primary/50 p-6 rounded-2xl flex flex-col items-center justify-center gap-2 bg-slate-50 cursor-pointer transition-all"
          >
            <Upload className="w-8 h-8 text-text-tertiary" />
            <span className="text-[10px] text-text-secondary block">Drag JPG/WEBP banner file here</span>
          </div>
        </div>
      </div>
    </div>
  );
}
