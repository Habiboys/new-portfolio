import { resolveImage } from "@/lib/imageUtils";
import { uploadPortfolioImage, getStoragePublicUrl } from "@/lib/storage";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { X, Loader2 } from "lucide-react"; // Ambil icon X dari lucide

type Props = {
  currentImages?: string[]; 
  onImagesChange: (images: string[]) => void; 
  label?: string;
  useStorage?: boolean;
  storageFolder?: string;
};

export function ImageUpload({
  currentImages = [], 
  onImagesChange,
  label,
  useStorage = true,
  storageFolder = "uploads",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  
  const previewImages = currentImages.map((img) => {
    if (img && img.startsWith("storage:")) {
      const path = img.replace("storage:", "");
      return getStoragePublicUrl(path);
    }
    return resolveImage(img) || img; 
  });

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);

    try {
      const uploadedImages: string[] = [];

      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} bukan gambar`);
          continue;
        }

        if (useStorage) {
          const result = await uploadPortfolioImage(file, storageFolder);
          if (result) {
            // Kita simpan format "storage:path" ke database sesuai standarmu
            uploadedImages.push(result.ref); 
            continue;
          }
        }

        // Fallback base64
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        uploadedImages.push(base64);
      }

      // Menggabungkan gambar lama dengan yang baru diupload
      onImagesChange([...currentImages, ...uploadedImages]);

      if (uploadedImages.length > 0) {
        toast.success(`${uploadedImages.length} gambar berhasil ditambahkan`);
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  // Fungsi untuk menghapus salah satu gambar dari array
  const handleRemove = (indexToRemove: number) => {
    const filtered = currentImages.filter((_, idx) => idx !== indexToRemove);
    onImagesChange(filtered);
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-xs font-medium text-gray-500">{label}</label>
      )}

      <div className="flex gap-2 flex-wrap items-center">
        {/* Render Preview dengan Tombol Hapus */}
        {previewImages.map((img, index) => (
          <div key={index} className="relative w-20 h-20 border rounded group overflow-hidden bg-gray-50">
            <img
              src={img}
              alt={`preview-${index}`}
              className="w-full h-full object-cover"
            />
            {/* Tombol Hapus melayang di pojok kanan atas gambar */}
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-80 hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Kotak Tombol Upload (Style Kotak Putus-putus) */}
        <label className={`w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed rounded cursor-pointer hover:bg-gray-50 transition-colors ${uploading ? 'pointer-events-none opacity-50' : ''}`}>
          {uploading ? (
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          ) : (
            <span className="text-xl text-gray-400">+</span>
          )}
          <span className="text-[10px] text-gray-400 mt-1">{uploading ? 'Uploading' : 'Tambah'}</span>
          <input
            type="file"
            ref={inputRef}
            multiple
            accept="image/*"
            onChange={handleFile}
            disabled={uploading}
            className="hidden" // Sembunyikan input bawaan browser yang berantakan
          />
        </label>
      </div>

      {useStorage && (
        <p className="text-[10px] text-gray-400">
          Otomatis diupload ke storage. Jika gagal, otomatis tersimpan sebagai fallback base64.
        </p>
      )}
    </div>
  );
}