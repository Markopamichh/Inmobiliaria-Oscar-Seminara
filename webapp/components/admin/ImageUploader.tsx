"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Spinner } from "@/components/ui/Spinner";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    const supabase = createClient();
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      if (file.size > 10 * 1024 * 1024) {
        setError(`"${file.name}" supera los 10 MB.`);
        continue;
      }
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("propiedades-imagenes")
        .upload(path, file, { cacheControl: "3600" });

      if (uploadError) {
        setError("Error al subir imagen. Intentá de nuevo.");
        continue;
      }

      const { data } = supabase.storage
        .from("propiedades-imagenes")
        .getPublicUrl(path);
      newUrls.push(data.publicUrl);
    }

    onChange([...images, ...newUrls]);
    setUploading(false);
  }

  function removeImage(url: string) {
    onChange(images.filter((img) => img !== url));
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Upload area */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full border-2 border-dashed border-stone-300 rounded-xl p-8 text-center hover:border-accent hover:bg-stone-50 transition-colors"
        disabled={uploading}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Spinner />
            <p className="text-sm text-stone-500">Subiendo…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              className="text-stone-400"
            >
              <path
                d="M16 20V12M12 16l4-4 4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="4"
                y="4"
                width="24"
                height="24"
                rx="4"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            <p className="text-sm text-stone-500">
              Hacé click para subir imágenes
            </p>
            <p className="text-xs text-stone-400">JPG, PNG, WebP — máx. 10 MB</p>
          </div>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="text-xs text-red-600">{error}</p>}

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url, i) => (
            <div key={url} className="relative group aspect-video rounded-lg overflow-hidden bg-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Imagen ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium"
              >
                Eliminar
              </button>
              {i === 0 && (
                <span className="absolute top-1 left-1 bg-accent text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
