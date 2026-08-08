"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { createGalleryImage, deleteGalleryImage } from "../actions";

export default function GalleryTab({
  initialGallery,
}: {
  initialGallery: any[];
}) {
  const router = useRouter();
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);

  const handleUploadGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryFile) return;
    if (galleryFile.size > 5 * 1024 * 1024) {
      alert("⚠️ The photo exceeds 5MB.");
      return;
    }
    setIsGalleryUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", galleryFile);
      await createGalleryImage(formData);
      setGalleryFile(null);
      const fileInput = document.getElementById(
        "galleryInput",
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      router.refresh();
    } catch (error) {
      alert("Failed to upload photo.");
    } finally {
      setIsGalleryUploading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-zinc-200 pb-5">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Manage Gallery (Our Work)
          </h2>
          <p className="text-xs font-medium text-zinc-500 mt-1">
            Photos appear on the homepage in the order they are uploaded.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm max-w-xl">
          <h3 className="font-bold text-zinc-900 mb-2">Add New Photo</h3>
          <form
            onSubmit={handleUploadGallery}
            className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
          >
            <input
              id="galleryInput"
              type="file"
              required
              accept="image/*"
              onChange={(e) => setGalleryFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-950 file:text-white hover:file:bg-zinc-800 cursor-pointer"
            />
            <button
              type="submit"
              disabled={isGalleryUploading || !galleryFile}
              className="bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-sm px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 whitespace-nowrap w-full sm:w-auto justify-center"
            >
              {isGalleryUploading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )}{" "}
              {isGalleryUploading ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {initialGallery.map((img: any) => (
            <div
              key={img.id}
              className="relative aspect-[4/5] bg-white border border-zinc-200 rounded-xl p-2 group shadow-sm overflow-hidden"
            >
              <img
                src={img.url}
                alt="Gallery Work"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={async () => {
                  if (window.confirm("Delete photo?")) {
                    await deleteGalleryImage(img.id);
                    router.refresh();
                  }
                }}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg text-white"
              >
                <div className="bg-red-600 p-2.5 rounded-full hover:scale-110 transition-transform">
                  <Trash2 size={20} />
                </div>
              </button>
            </div>
          ))}
          {initialGallery.length === 0 && (
            <div className="col-span-full py-12 text-center text-zinc-400 font-medium border-2 border-dashed border-zinc-200 rounded-2xl">
              📸 No custom photos. The site displays default screenshots.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
