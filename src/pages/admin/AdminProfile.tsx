import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { ImageUpload } from "@/components/ImageUpload";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

export default function AdminProfile() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase!
      .from("profiles")
      .select("*")
      .eq("is_active", true)
      .limit(1)
      .single()
      .then(({ data }) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  const save = async () => {
    if (!data) return;
    setSaving(true);
    const { error } = await supabase!
      .from("profiles")
      .update({
        name: data.name,
        title: data.title,
        description: data.description,
        photo_base64: data.photo_base64,
        email: data.email,
        phone: data.phone,
        location: data.location,
      })
      .eq("id", data.id);
    if (error) toast.error(error.message);
    else toast.success("Profile tersimpan!");
    setSaving(false);
  };

  if (loading) return <AdminLayout><p>Loading...</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Informasi utama yang tampil di hero section</p>
      </div>
      <div className="max-w-2xl bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Nama Lengkap</label>
            <input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Title / Role</label>
            <input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Deskripsi</label>
          <textarea value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none" rows={3} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
            <input value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Phone</label>
            <input value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Lokasi</label>
          <input value={data.location} onChange={(e) => setData({ ...data, location: e.target.value })}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none" />
        </div>
        <ImageUpload label="Foto Profil" currentImage={data.photo_base64} onImageChange={(b64) => setData({ ...data, photo_base64: b64 })} />
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 text-sm font-medium transition-colors">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan
        </button>
      </div>
    </AdminLayout>
  );
}
