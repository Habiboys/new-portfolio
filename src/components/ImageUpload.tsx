import { resolveImage } from "@/lib/imageUtils";
import { uploadPortfolioImage } from "@/lib/storage";
import { useRef, useState } from "react";
import { toast } from "sonner";

type Props = {
  currentImage?: string | null;
  onImageChange: (value: string) => void;
  label?: string;
  useStorage?: boolean;
  storageFolder?: string;
};

export function ImageUpload({
  currentImage,
  onImageChange,
  label,
  useStorage = true,
  storageFolder = "uploads",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const previewSrc = resolveImage(currentImage);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar.");
      return;
    }

    setUploading(true);
    try {
      if (useStorage) {
        const result = await uploadPortfolioImage(file, storageFolder);
        if (result) {
          onImageChange(result.ref);
          toast.success("Gambar diunggah ke Storage.");
          return;
        }
        toast.warning("Storage gagal — menyimpan sebagai base64. Pastikan bucket portfolio-media sudah public.");
      }

      const reader = new FileReader();
      reader.onload = () => {
        onImageChange(reader.result as string);
        toast.success("Gambar disimpan (base64).");
      };
      reader.onerror = () => toast.error("Gagal membaca file gambar.");
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="flex items-center gap-4">
        {previewSrc ? (
          <img
            src={previewSrc}
            alt="preview"
            className="w-20 h-20 object-cover rounded border"
            onError={() => toast.error("Preview gagal — cek bucket Storage public atau upload ulang.")}
          />
        ) : currentImage?.includes("PASTE_") ? (
          <div className="w-20 h-20 rounded border border-dashed border-amber-300 bg-amber-50 flex items-center justify-center text-[10px] text-amber-700 text-center px-1">
            Placeholder — upload gambar
          </div>
        ) : null}
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm transition-colors disabled:opacity-50"
        >
          {uploading ? "Mengunggah..." : previewSrc || currentImage ? "Ganti Gambar" : "Pilih Gambar"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      </div>
      {useStorage && (
        <p className="text-xs text-gray-500">
          Upload ke Supabase Storage (<code>portfolio-media</code>). Jika gagal, otomatis fallback base64.
        </p>
      )}
    </div>
  );
}
