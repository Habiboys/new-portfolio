import { AdminLayout } from "@/components/AdminLayout";
import { ImageUpload } from "@/components/ImageUpload";
import { supabase } from "@/lib/supabase";
import { normalizeImageStorageValue } from "@/lib/imageUtils";
import { fetchGalleryData } from "@/services/portfolioService";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Item = {
  id?: string;
  title: string;
  description: string;
  image_base64: string;
  image_alt: string;
  sort_order: number;
};

function normalizeGalleryRow(row: {
  id?: string;
  title?: string | null;
  description?: string | null;
  image_base64?: string | null;
  image_alt?: string | null;
  sort_order?: number | null;
}): Item {
  return {
    id: row.id,
    title: row.title ?? "",
    description: row.description ?? "",
    image_base64: row.image_base64 ?? "",
    image_alt: row.image_alt ?? row.title ?? "",
    sort_order: row.sort_order ?? 0,
  };
}

export default function AdminGallery() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase!
        .from("gallery_items")
        .select("id, title, description, image_base64, image_alt, sort_order")
        .eq("is_visible", true)
        .order("sort_order");

      if (data) {
        setItems(data.map(normalizeGalleryRow));
      } else {
        const fb = await fetchGalleryData();
        setItems(
          fb.map((g, i) => ({
            title: g.title,
            description: g.description ?? "",
            image_base64: g.thumbnail,
            image_alt: g.imageAlt ?? g.title,
            sort_order: i + 1,
          }))
        );
      }
      setLoading(false);
    })();
  }, []);

  const add = () =>
    setItems([
      ...items,
      {
        title: "",
        description: "",
        image_base64: "",
        image_alt: "",
        sort_order: items.length + 1,
      },
    ]);

  const remove = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  const update = <K extends keyof Item>(i: number, field: K, val: Item[K]) => {
    const next = [...items];
    next[i] = { ...next[i], [field]: val };
    setItems(next);
  };

  const save = async () => {
    setSaving(true);
    await supabase!
      .from("gallery_items")
      .delete()
      .in(
        "id",
        items.filter((g) => g.id).map((g) => g.id!)
      );

    const { error } = await supabase!.from("gallery_items").insert(
      items.map((g, i) => ({
        title: g.title,
        description: g.description || null,
        image_base64: normalizeImageStorageValue(g.image_base64),
        image_alt: g.image_alt || g.title || null,
        sort_order: i + 1,
        is_visible: true,
      }))
    );

    if (error) toast.error(error.message);
    else toast.success("Gallery tersimpan!");
    setSaving(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <p>Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Data ini dipakai di <strong>Masonry Gallery</strong> beranda:{" "}
            <strong>Title</strong> = label overlay foto,{" "}
            <strong>Image</strong> = foto, <strong>Alt text</strong> = aksesibilitas
            (fallback mobile). Urutan mengikuti nomor item.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={add}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 text-sm font-medium"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{" "}
            Simpan
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((g, i) => (
          <div
            key={g.id ?? i}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item #{i + 1}
              </span>
              <button
                onClick={() => remove(i)}
                className="flex items-center gap-1 text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded"
              >
                <Trash2 className="w-3 h-3" /> Hapus
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Title (label gallery)
                  </label>
                  <input
                    value={g.title}
                    onChange={(e) => update(i, "title", e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Judul yang tampil di bawah foto"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Alt text
                  </label>
                  <input
                    value={g.image_alt}
                    onChange={(e) => update(i, "image_alt", e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Deskripsi singkat gambar untuk screen reader"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">
                  Description (opsional)
                </label>
                <input
                  value={g.description}
                  onChange={(e) => update(i, "description", e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="Catatan internal / belum ditampilkan di gallery"
                />
              </div>
              <ImageUpload
                label="Image"
                currentImage={g.image_base64}
                onImageChange={(b64) => update(i, "image_base64", b64)}
              />
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
