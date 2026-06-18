import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase } from "@/lib/supabase";
import { fetchPortfolioData } from "@/services/portfolioService";
import { toast } from "sonner";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";

export default function AdminAbout() {
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: profile } = await supabase!.from("profiles").select("id").eq("is_active", true).limit(1).single();
      if (!profile) { setLoading(false); return; }
      setProfileId(profile.id);

      const { data } = await supabase!.from("about_paragraphs").select("body").eq("profile_id", profile.id).eq("is_visible", true).order("sort_order");
      if (data) setParagraphs(data.map((r: any) => r.body));
      else {
        const fallback = await fetchPortfolioData();
        setParagraphs(fallback.aboutMe.paragraphs);
      }
      setLoading(false);
    })();
  }, []);

  const add = () => setParagraphs([...paragraphs, ""]);
  const remove = (i: number) => setParagraphs(paragraphs.filter((_, idx) => idx !== i));
  const update = (i: number, val: string) => {
    const next = [...paragraphs];
    next[i] = val;
    setParagraphs(next);
  };

  const save = async () => {
    if (!profileId) return;
    setSaving(true);
    const filtered = paragraphs.filter((p) => p.trim());
    const rows = filtered.map((body, i) => ({ profile_id: profileId, body, sort_order: i + 1, is_visible: true }));
    await supabase!.from("about_paragraphs").delete().eq("profile_id", profileId);
    const { error } = await supabase!.from("about_paragraphs").insert(rows);
    if (error) toast.error(error.message);
    else toast.success("About tersimpan!");
    setSaving(false);
  };

  if (loading) return <AdminLayout><p>Loading...</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">About Paragraphs</h1>
          <p className="text-sm text-gray-500 mt-1">Paragraf yang tampil di section About</p>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 text-sm font-medium transition-colors">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan
        </button>
      </div>
      <div className="max-w-2xl space-y-3">
        {paragraphs.map((p, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex gap-3 items-start">
            <span className="text-xs font-medium text-gray-400 mt-3 w-6 shrink-0">#{i + 1}</span>
            <textarea value={p} onChange={(e) => update(i, e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none min-h-[80px]" rows={2} />
            <button onClick={() => remove(i)} className="text-red-500 hover:text-red-700 mt-2 shrink-0"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        <button onClick={add} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Tambah Paragraf
        </button>
      </div>
    </AdminLayout>
  );
}
