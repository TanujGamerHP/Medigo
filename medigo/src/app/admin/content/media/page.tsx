"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Upload, Search, Trash2, Eye } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface MediaItem {
  id: string;
  name: string;
  type: string;
  size: string;
}

export default function MediaCMSPage() {
  const { show } = useToast();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleUpload = () => {
    show("Select file from local system dialog (simulation)...", "info");
    setTimeout(() => {
      const mockFile: MediaItem = {
        id: `${media.length + 1}`,
        name: "uploaded_clinical_file.jpg",
        type: "JPG",
        size: "250 KB"
      };
      setMedia([mockFile, ...media]);
      show("File uploaded successfully to media library.", "success");
    }, 1000);
  };

  const handleDelete = (id: string) => {
    setMedia(media.filter(m => m.id !== id));
    show("Media file deleted.", "warning");
  };

  const filteredMedia = media.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="search"
            placeholder="Search media library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <Button onClick={handleUpload} size="sm" className="font-bold" rightIcon={<Upload className="w-4 h-4" />}>
          Upload Media
        </Button>
      </div>

      {/* Media Grid */}
      {filteredMedia.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMedia.map((m) => (
            <Card key={m.id} padding="sm" className="hover flex flex-col justify-between min-h-[140px]">
              <div className="flex items-center gap-2 pb-2 border-b border-border-light">
                <ImageIcon className="w-5 h-5 text-primary shrink-0" />
                <span className="font-mono text-[10px] text-text-primary block truncate font-bold" title={m.name}>
                  {m.name}
                </span>
              </div>

              <div className="py-3 text-[10px] text-text-secondary font-medium leading-relaxed">
                <p>Type: <span className="font-bold text-text-primary">{m.type}</span></p>
                <p>Size: <span className="font-bold text-text-primary font-mono">{m.size}</span></p>
              </div>

              <div className="flex gap-2 justify-end border-t border-border-light pt-2 mt-1 select-none">
                <button 
                  onClick={() => show(`Opening preview file for ${m.name}...`, "info")}
                  className="p-1.5 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-slate-50 transition-colors"
                  title="Preview File"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => handleDelete(m.id)}
                  className="p-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
                  title="Delete File"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-6 space-y-3 bg-white border border-border rounded-3xl">
          <ImageIcon className="w-12 h-12 text-text-tertiary" />
          <h4 className="font-heading font-bold text-base text-text-primary">No media assets found</h4>
          <p className="text-xs text-text-secondary max-w-xs mx-auto leading-relaxed">
            Upload JPG, WEBP, or PDF files to link inside your CMS blogs and banners.
          </p>
        </div>
      )}
    </div>
  );
}
