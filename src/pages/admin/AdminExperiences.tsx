import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { ImageUpload } from "@/components/ImageUpload";
import { supabase } from "@/lib/supabase";
import { fetchExperiencesData } from "@/services/portfolioService";
import { toast } from "sonner";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";

type Item = {
  id?: string; title: string; organization: string; period_label: string;
  description: string; image_base64: string; image_alt: string; sort_order: number; is_current: boolean;
};

export default function AdminExperiences() {
  const [items, setItems] = useState<Item[]>([]);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: profile } = await supabase!.from("profiles").select("id").eq("is_active", true).limit(1).single();
      if (!profile) { setLoading(false); return; }
      setProfileId(profile.id);
      const { data } = await supabase!.from("experiences").select("*").eq("profile_id", profile.id).eq("is_visible", true).order("sort_order");
      if (data) setItems(data);
      else {
        const fb = await fetchExperiencesData();
        setItems(fb.map((e, i) => ({
          title: e.title, organization: e.organization, period_label: e.period, description: e.description,
          image_base64: e.image, image_alt: e.title, sort_order: i + 1, is_current: false,
        })));
      }
      setLoading(false);
    })();
  }, []);

  const add = () => setItems([...items, { title: "", organization: "", period_label: "", description: "", image_base64: "", image_alt: "", sort_order: items.length + 1, is_current: false }]);
  const remove = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof Item, val: any) => {
    const next = [...items]; (next[i] as any)[field] = val; setItems(next);
  };

  const save = async () => {
    if (!profileId) return;
    setSaving(true);
    await supabase!.from("experiences").delete().eq("profile_id", profileId);
    const { error } = await supabase!.from("experiences").insert(items.map((item, i) => ({
      profile_id: profileId, title: item.title, organization: item.organization, period_label: item.period_label,
      description: item.description, image_base64: item.image_base64 || null, image_alt: item.image_alt || null,
      sort_order: i + 1, is_current: item.is_current, is_visible: true,
    })));
    if (error) toast.error(error.message); else toast.success("Experiences tersimpan!");
    setSaving(false);
  };

  if (loading) return <AdminLayout><p>Loading...</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Experiences</h1>
          <p className="text-sm text-gray-500 mt-1">Riwayat pengalaman kerja</p>
        </div>
        <div className="flex gap-2">
          <button onClick={add} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> Tambah
          </button>
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 text-sm font-medium transition-colors">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Experience #{i + 1}</span>
              <button onClick={() => remove(i)} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"><Trash2 className="w-3 h-3" /> Hapus</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Title</label><input placeholder="e.g. Backend Developer" value={item.title} onChange={(e) => update(i, "title", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none" /></div>
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Organization</label><input placeholder="e.g. PT Example" value={item.organization} onChange={(e) => update(i, "organization", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none" /></div>
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Period</label><input placeholder="e.g. Jan 2025 - Present" value={item.period_label} onChange={(e) => update(i, "period_label", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none" /></div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={item.is_current} onChange={(e) => update(i, "is_current", e.target.checked)} className="rounded" />
                    <span>Current position</span>
                  </label>
                </div>
              </div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Description</label><textarea value={item.description} onChange={(e) => update(i, "description", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none" rows={2} /></div>
              <ImageUpload label="Logo / Image" currentImage={item.image_base64} onImageChange={(b64) => update(i, "image_base64", b64)} />
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
