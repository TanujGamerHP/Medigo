"use client";

import React, { useRef, useState } from "react";
import { Camera, Loader2, User } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoUploaded: (url: string) => void;
  size?: "sm" | "md" | "lg";
}

export function ProfilePhotoUpload({ currentPhotoUrl, onPhotoUploaded, size = "md" }: ProfilePhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { show } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      show("File size exceeds 10MB limit", "error");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      // We use fetch directly here instead of api wrapper because FormData needs specific handling
      const token = localStorage.getItem("auth_token");
      const res = await fetch("http://localhost:5000/api/v1/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.data?.url) {
        // Construct full URL if it's a relative path, or use it directly
        const fullUrl = data.data.url.startsWith("/") 
          ? `http://localhost:5000${data.data.url}` 
          : data.data.url;
          
        onPhotoUploaded(fullUrl);
        show("Profile photo updated", "success");
      } else {
        show(data.message || "Upload failed", "error");
      }
    } catch (err) {
      console.error(err);
      show("Network error during upload", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const dimensions = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  };

  return (
    <div className="relative group flex items-center justify-center">
      <input 
        type="file" 
        className="hidden" 
        accept=".jpg,.jpeg,.png,.webp" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      <div 
        className={`${dimensions[size]} rounded-full border-4 border-white shadow-md bg-slate-100 flex items-center justify-center overflow-hidden relative cursor-pointer`}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        {isUploading ? (
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        ) : currentPhotoUrl ? (
          <img src={currentPhotoUrl} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <User className="w-1/2 h-1/2 text-slate-400" />
        )}
        
        {!isUploading && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
