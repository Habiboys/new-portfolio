import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { ImageUpload } from "@/components/ImageUpload";
import { supabase } from "@/lib/supabase";
import { fetchProjectsData } from "@/services/portfolioService";
import { toast } from "sonner";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";

type Project = {
  id?: string; title: string; slug: string; description: string; detailed_description: string;
  preview_image_base64: string; preview_image_alt: string; live_demo_url: string; source_code_url: string;
  sort_order: number; is_featured: boolean; features: string[]; images: string[]; tech: string[];
};

export default function AdminProjects() {
  const [items, setItems] = useState<Project[]>([]);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: profile } = await supabase!.from("profiles").select("id").eq("is_active", true).limit(1).single();
      if (!profile) { setLoading(false); return; }
      setProfileId(profile.id);

      const { data: projects } = await supabase!.from("projects").select("id, title, slug, description, detailed_description, preview_image_base64, preview_image_alt, live_demo_url, source_code_url, sort_order, is_featured").eq("profile_id", profile.id).eq("is_visible", true).order("sort_order");

      if (projects && projects.length > 0) {
        const ids = projects.map((p) => p.id);
        const [{ data: features }, { data: images }, { data: tech }] = await Promise.all([
          supabase!.from("project_features").select("project_id, feature").in("project_id", ids).order("sort_order"),
          supabase!.from("project_images").select("project_id, image_base64").in("project_id", ids).order("sort_order"),
          supabase!.from("project_technologies").select("project_id, technology_name").in("project_id", ids).order("sort_order"),
        ]);
        setItems(projects.map((p) => ({
          id: p.id, title: p.title, slug: p.slug, description: p.description,
          detailed_description: p.detailed_description ?? "", preview_image_base64: p.preview_image_base64 ?? "",
          preview_image_alt: p.preview_image_alt ?? "", live_demo_url: p.live_demo_url ?? "", source_code_url: p.source_code_url ?? "",
          sort_order: p.sort_order, is_featured: p.is_featured,
          features: (features ?? []).filter((f) => f.project_id === p.id).map((f) => f.feature),
          images: (images ?? []).filter((img) => img.project_id === p.id).map((img) => img.image_base64),
          tech: (tech ?? []).filter((t) => t.project_id === p.id).map((t) => t.technology_name),
        })));
      } else {
        const fb = await fetchProjectsData();
        setItems(fb.map((p, i) => ({
          title: p.title, slug: p.slug ?? p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description: p.description, detailed_description: p.detailedDescription,
          preview_image_base64: p.previewImage, preview_image_alt: p.title,
          live_demo_url: p.liveDemo, source_code_url: p.sourceCode, sort_order: i + 1, is_featured: true,
          features: p.features, images: p.images, tech: p.tech,
        })));
      }
      setLoading(false);
    })();
  }, []);

  const add = () => setItems([...items, { title: "", slug: "", description: "", detailed_description: "", preview_image_base64: "", preview_image_alt: "", live_demo_url: "", source_code_url: "", sort_order: items.length + 1, is_featured: true, features: [], images: [], tech: [] }]);
  const remove = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof Project, val: any) => {
    const next = [...items]; (next[i] as any)[field] = val; setItems(next);
  };

  const save = async () => {
    if (!profileId) return;
    setSaving(true);
    await supabase!.from("project_images").delete().in("project_id", items.filter((p) => p.id).map((p) => p.id!));
    await supabase!.from("project_features").delete().in("project_id", items.filter((p) => p.id).map((p) => p.id!));
    await supabase!.from("project_technologies").delete().in("project_id", items.filter((p) => p.id).map((p) => p.id!));
    await supabase!.from("projects").delete().eq("profile_id", profileId);

    for (let i = 0; i < items.length; i++) {
      const p = items[i];
      const { data: inserted } = await supabase!.from("projects").insert({
        profile_id: profileId, title: p.title, slug: p.slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: p.description, detailed_description: p.detailed_description,
        preview_image_base64: p.preview_image_base64 || null, preview_image_alt: p.preview_image_alt || null,
        live_demo_url: p.live_demo_url || null, source_code_url: p.source_code_url || null,
        sort_order: i + 1, is_featured: p.is_featured, is_visible: true,
      }).select("id").single();
      if (!inserted) continue;
      if (p.tech.length) await supabase!.from("project_technologies").insert(p.tech.map((t, ti) => ({ project_id: inserted.id, technology_name: t, sort_order: ti + 1 })));
      if (p.features.length) await supabase!.from("project_features").insert(p.features.map((f, fi) => ({ project_id: inserted.id, feature: f, sort_order: fi + 1 })));
      if (p.images.length) await supabase!.from("project_images").insert(p.images.map((img, ii) => ({ project_id: inserted.id, image_base64: img, sort_order: ii + 1 })));
    }
    toast.success("Projects tersimpan!");
    setSaving(false);
  };

  if (loading) return <AdminLayout><p>Loading...</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola project portfolio</p>
        </div>
        <div className="flex gap-2">
          <button onClick={add} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"><Plus className="w-4 h-4" /> Tambah</button>
          <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 text-sm font-medium">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan</button>
        </div>
      </div>
      <div className="space-y-6">
        {items.map((p, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Project #{i + 1}</span>
              <button onClick={() => remove(i)} className="flex items-center gap-1 text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded"><Trash2 className="w-3 h-3" /> Hapus</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-gray-500 mb-1 block">Title</label><input value={p.title} onChange={(e) => update(i, "title", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900" /></div>
                <div><label className="text-xs font-medium text-gray-500 mb-1 block">Slug</label><input value={p.slug} onChange={(e) => update(i, "slug", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900" /></div>
                <div><label className="text-xs font-medium text-gray-500 mb-1 block">Live Demo URL</label><input value={p.live_demo_url} onChange={(e) => update(i, "live_demo_url", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900" /></div>
                <div><label className="text-xs font-medium text-gray-500 mb-1 block">Source Code URL</label><input value={p.source_code_url} onChange={(e) => update(i, "source_code_url", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900" /></div>
              </div>
              <div><label className="text-xs font-medium text-gray-500 mb-1 block">Description</label><input value={p.description} onChange={(e) => update(i, "description", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900" /></div>
              <div><label className="text-xs font-medium text-gray-500 mb-1 block">Detailed Description</label><textarea value={p.detailed_description} onChange={(e) => update(i, "detailed_description", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900" rows={3} /></div>
              <ImageUpload label="Preview Image" currentImage={p.preview_image_base64} onImageChange={(b64) => update(i, "preview_image_base64", b64)} />
              <div><label className="text-xs font-medium text-gray-500 mb-1 block">Technologies (pisahkan koma)</label><input value={p.tech.join(", ")} onChange={(e) => update(i, "tech", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900" /></div>
              <div><label className="text-xs font-medium text-gray-500 mb-1 block">Features (1 per baris)</label><textarea value={p.features.join("\n")} onChange={(e) => update(i, "features", e.target.value.split("\n").filter(Boolean))} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900" rows={3} /></div>
              <div><label className="text-xs font-medium text-gray-500 mb-2 block">Screenshots</label>{p.images.map((img, ii) => (<div key={ii} className="flex gap-2 items-center mb-2"><img src={img} alt="" className="w-16 h-12 object-cover rounded border" /><button onClick={() => update(i, "images", p.images.filter((_, idx) => idx !== ii))} className="text-red-500 text-xs hover:text-red-700">Hapus</button></div>))}
                <ImageUpload label="" currentImage={null} onImageChange={(b64) => update(i, "images", [...p.images, b64])} />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={p.is_featured} onChange={(e) => update(i, "is_featured", e.target.checked)} className="rounded" /> Featured</label>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
