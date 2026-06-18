import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";

type Link = { id?: string; platform: string; url: string; icon: string; sort_order: number };

export default function AdminSocial() {
  const [links, setLinks] = useState<Link[]>([]);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionDesc, setSectionDesc] = useState("");

  useEffect(() => {
    (async () => {
      const { data: profile } = await supabase!.from("profiles").select("id").eq("is_active", true).limit(1).single();
      if (!profile) { setLoading(false); return; }
      setProfileId(profile.id);

      const { data: section } = await supabase!.from("contact_sections").select("title, description").eq("profile_id", profile.id).eq("is_active", true).limit(1).single();
      if (section) { setSectionTitle(section.title); setSectionDesc(section.description); }

      const { data } = await supabase!.from("social_links").select("*").eq("profile_id", profile.id).eq("is_visible", true).order("sort_order");
      if (data) setLinks(data);
      else setLinks([{ platform: "LinkedIn", url: "https://linkedin.com", icon: "linkedin", sort_order: 1 }, { platform: "GitHub", url: "https://github.com", icon: "github", sort_order: 2 }, { platform: "Instagram", url: "https://instagram.com", icon: "instagram", sort_order: 3 }]);
      setLoading(false);
    })();
  }, []);

  const add = () => setLinks([...links, { platform: "", url: "", icon: "", sort_order: links.length + 1 }]);
  const remove = (i: number) => setLinks(links.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof Link, val: any) => {
    const next = [...links]; (next[i] as any)[field] = val; setLinks(next);
  };

  const save = async () => {
    if (!profileId) return;
    setSaving(true);
    await supabase!.from("contact_sections").delete().eq("profile_id", profileId);
    await supabase!.from("contact_sections").insert({ profile_id: profileId, title: sectionTitle || "Let's Connect", description: sectionDesc || "Get in touch", is_active: true });
    await supabase!.from("social_links").delete().eq("profile_id", profileId);
    const { error } = await supabase!.from("social_links").insert(links.filter((l) => l.platform).map((l, i) => ({ profile_id: profileId, platform: l.platform, url: l.url, icon: l.icon || l.platform.toLowerCase(), sort_order: i + 1, is_visible: true })));
    if (error) toast.error(error.message); else toast.success("Social links tersimpan!");
    setSaving(false);
  };

  if (loading) return <AdminLayout><p>Loading...</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact & Social Links</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola section contact dan link media sosial</p>
        </div>
        <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 text-sm font-medium">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan
        </button>
      </div>
      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Contact Section</h2>
          <div><label className="text-xs font-medium text-gray-500 mb-1 block">Title</label><input value={sectionTitle} onChange={(e) => setSectionTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900" /></div>
          <div><label className="text-xs font-medium text-gray-500 mb-1 block">Description</label><textarea value={sectionDesc} onChange={(e) => setSectionDesc(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900" rows={2} /></div>
        </div>
        {links.map((l, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Link #{i + 1}</span>
              <button onClick={() => remove(i)} className="flex items-center gap-1 text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded"><Trash2 className="w-3 h-3" /> Hapus</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className="text-xs font-medium text-gray-500 mb-1 block">Platform</label><input value={l.platform} onChange={(e) => update(i, "platform", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900" placeholder="LinkedIn" /></div>
                <div><label className="text-xs font-medium text-gray-500 mb-1 block">URL</label><input value={l.url} onChange={(e) => update(i, "url", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900" /></div>
                <div><label className="text-xs font-medium text-gray-500 mb-1 block">Icon</label><input value={l.icon} onChange={(e) => update(i, "icon", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900" placeholder="linkedin / github / instagram" /></div>
              </div>
            </div>
          </div>
        ))}
        <button onClick={add} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"><Plus className="w-4 h-4" /> Tambah Link</button>
      </div>
    </AdminLayout>
  );
}
