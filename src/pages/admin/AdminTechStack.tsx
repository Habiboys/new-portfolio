import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase } from "@/lib/supabase";
import { fetchPortfolioData } from "@/services/portfolioService";
import { toast } from "sonner";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";

export default function AdminTechStack() {
  const [items, setItems] = useState<string[]>([]);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: profile } = await supabase!.from("profiles").select("id").eq("is_active", true).limit(1).single();
      if (!profile) { setLoading(false); return; }
      setProfileId(profile.id);
      const { data } = await supabase!.from("tech_stack").select("icon_slug").eq("profile_id", profile.id).eq("is_visible", true).order("sort_order");
      if (data) setItems(data.map((r: any) => r.icon_slug));
      else { const fb = await fetchPortfolioData(); setItems(fb.techStack); }
      setLoading(false);
    })();
  }, []);

  const add = () => setItems([...items, ""]);
  const remove = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const update = (i: number, val: string) => {
    const next = [...items]; next[i] = val; setItems(next);
  };

  const save = async () => {
    if (!profileId) return;
    setSaving(true);
    const filtered = items.filter((s) => s.trim());
    const rows = filtered.map((slug, i) => ({ profile_id: profileId, name: slug, icon_slug: slug, sort_order: i + 1, is_visible: true }));
    await supabase!.from("tech_stack").delete().eq("profile_id", profileId);
    const { error } = await supabase!.from("tech_stack").insert(rows);
    if (error) toast.error(error.message); else toast.success("Tech stack tersimpan!");
    setSaving(false);
  };

  if (loading) return <AdminLayout><p>Loading...</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tech Stack</h1>
          <p className="text-sm text-gray-500 mt-1">Icon slug dari skillicons.dev: <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">react</code>, <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">typescript</code>, <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">docker</code></p>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 text-sm font-medium transition-colors">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan
        </button>
      </div>
      <div className="max-w-xl space-y-2">
        {items.map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 flex gap-3 items-center">
            <span className="text-xs font-medium text-gray-400 w-6 shrink-0">#{i + 1}</span>
            <input value={s} onChange={(e) => update(i, e.target.value)} placeholder="contoh: react"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none" />
            <img src={`https://skillicons.dev/icons?i=${s}&theme=light`} alt={s} className="w-7 h-7 shrink-0"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <button onClick={() => remove(i)} className="text-red-500 hover:text-red-700 shrink-0"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        <button onClick={add} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Tambah Tech
        </button>
      </div>
    </AdminLayout>
  );
}
