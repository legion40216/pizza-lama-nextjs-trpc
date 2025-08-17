"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import { ImagePlus, Trash, Loader2 } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

import { Button } from "@/components/ui/button";

interface CategoryImageUploadProps {
  disabled?: boolean;
  onChange: (url: string) => void;
  onRemove: (url: string) => void;
  value?: string[];
  limitValue?: number;
}

export default function CategoryImageUpload({
  disabled = false,
  onChange,
  onRemove,
  value = [],
  limitValue = 1,
}: CategoryImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>(value);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPreviews(value);
  }, [value]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const files = Array.from(input.files ?? []);

    if (!files.length) return;
    input.value = "";

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
    setIsLoading(true);

    try {
      for (const file of files) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from("category-image")
          .upload(fileName, file);

        if (error) throw error;

        const { data: publicUrlData } = supabase.storage
          .from("category-image")
          .getPublicUrl(data.path);

        if (publicUrlData.publicUrl) {
          onChange(publicUrlData.publicUrl);
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (url: string) => {
    URL.revokeObjectURL(url);
    const updatedPreviews = previews.filter((preview) => preview !== url);
    setPreviews(updatedPreviews);
    setIsLoading(true);

    try {
      const fileName = url.split("/").pop() ?? "";
      const { error } = await supabase.storage
        .from("category-image")
        .remove([fileName]);

      if (error) throw error;

      onRemove(url);
    } catch (error) {
      console.error("Error removing image from storage:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isLimitReached = previews.length >= limitValue;

  return (
    <div className="space-y-4">
      {previews.length > 0 && (
        <div className="flex border-dashed 
        border-2 flex-wrap gap-4"
        >
        {previews.map((preview, index) => (
        <div
          key={index}
          className="relative w-full aspect-square rounded-md 
          overflow-hidden"
        >
          <Image
            fill
            className="object-cover"
            alt="Preview"
            src={preview}
          />
          <Button
            type="button"
            onClick={() => handleRemove(preview)}
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 z-10"
            disabled={isLoading || disabled}
          >
            <Trash className="size-4" />
          </Button>
        </div>
        ))}
        </div>
      )}

      {!isLimitReached && (
      <div>
        <div className="w-full aspect-square">
          <Button
            type="button"
            onClick={() => document.getElementById("file-input")?.click()}
            disabled={isLoading || disabled}
            variant="secondary"
            className={cn(
              "w-full h-full p-0 flex flex-col items-center justify-center gap-2",
              "transition border-dashed border-2 overflow-hidden",
              {
                "bg-gray-400 cursor-not-allowed": isLoading || disabled,
              }
            )}
          >
            {isLoading || disabled? (
              <Loader2 className="size-8 animate-spin" />
            ) : (
              <ImagePlus className="size-8" />
            )}

            <span className="text-sm py-2">
              {isLoading || disabled ? "Uploading..." : "Upload Image"}
            </span>
          </Button>
        </div>

        <input
          type="file"
          id="file-input"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
          accept="image/*"
        />
      </div>
      )}
    </div>
  );
}
