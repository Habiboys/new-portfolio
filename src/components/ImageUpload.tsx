import React, { useRef } from "react";

type Props = {
  currentImage?: string | null;
  onImageChange: (base64: string) => void;
  label?: string;
};

export function ImageUpload({ currentImage, onImageChange, label }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onImageChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="flex items-center gap-4">
        {currentImage && (
          <img
            src={currentImage}
            alt="preview"
            className="w-20 h-20 object-cover rounded border"
          />
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm transition-colors"
        >
          {currentImage ? "Ganti Gambar" : "Pilih Gambar"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      </div>
    </div>
  );
}
