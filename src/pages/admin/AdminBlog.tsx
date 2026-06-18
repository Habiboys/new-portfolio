import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { ImageUpload } from "@/components/ImageUpload";
import { RichTextEditor } from "@/components/RichTextEditor";
import { supabase } from "@/lib/supabase";
import { fetchBlogPostsData } from "@/services/portfolioService";
import { toast } from "sonner";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";

type Post = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_base64: string;
  image_alt: string;
  published_at: string;
  read_time: string;
  category_id: string | null;
  category_name: string;
  tags: string[];
  is_published: boolean;
};

export default function AdminBlog() {
  const [items, setItems] = useState<Post[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: cats } = await supabase!.from("blog_categories").select("id, name").order("name");
      if (cats) setCategories(cats);

      const { data: posts } = await supabase!
        .from("blog_posts")
        .select("id, title, slug, excerpt, content, image_base64, image_alt, published_at, read_time, category_id, is_published")
        .order("published_at", { ascending: false });

      if (posts && posts.length > 0) {
        const ids = posts.map((p) => p.id);
        const { data: tags } = await supabase!
          .from("blog_post_tags")
          .select("blog_post_id, tag_id")
          .in("blog_post_id", ids);

        const tagIds = [...new Set((tags ?? []).map((t) => t.tag_id))];
        const { data: tagData } = await supabase!
          .from("blog_tags")
          .select("id, name")
          .in("id", tagIds);

        const tagNameMap = Object.fromEntries((tagData ?? []).map((t) => [t.id, t.name]));
        const tagMap: Record<string, string[]> = {};
        for (const t of tags ?? []) {
          if (!tagMap[t.blog_post_id]) tagMap[t.blog_post_id] = [];
          const name = tagNameMap[t.tag_id];
          if (name) tagMap[t.blog_post_id].push(name);
        }

        setItems(posts.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt,
          content: p.content,
          image_base64: p.image_base64 ?? "",
          image_alt: p.image_alt ?? "",
          published_at: p.published_at ?? "",
          read_time: p.read_time ?? "",
          category_id: p.category_id,
          category_name: "",
          tags: tagMap[p.id] ?? [],
          is_published: p.is_published,
        })));
      } else {
        const fallback = await fetchBlogPostsData();
        setItems(fallback.map((p) => ({
          title: p.title,
          slug: p.slug ?? p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          excerpt: p.excerpt,
          content: p.content,
          image_base64: p.image,
          image_alt: p.title,
          published_at: p.date,
          read_time: p.readTime,
          category_id: categories.find((c) => c.name === p.category)?.id ?? null,
          category_name: p.category,
          tags: p.tags,
          is_published: true,
        })));
      }
      setLoading(false);
    })();
  }, []);

  const addItem = () =>
    setItems([...items, {
      title: "", slug: "", excerpt: "", content: "", image_base64: "", image_alt: "",
      published_at: new Date().toISOString().split("T")[0], read_time: "5 min read",
      category_id: null, category_name: "", tags: [], is_published: true,
    }]);

  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof Post, val: any) => {
    const next = [...items];
    (next[i] as any)[field] = val;
    setItems(next);
  };

  const save = async () => {
    setSaving(true);
    await supabase!.from("blog_post_tags").delete().in("blog_post_id", items.filter((p) => p.id).map((p) => p.id!));
    await supabase!.from("blog_posts").delete().in("id", items.filter((p) => p.id).map((p) => p.id!));

    for (let i = 0; i < items.length; i++) {
      const p = items[i];
      const { data: inserted } = await supabase!
        .from("blog_posts")
        .insert({
          title: p.title,
          slug: p.slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          excerpt: p.excerpt,
          content: p.content,
          image_base64: p.image_base64 || null,
          image_alt: p.image_alt || null,
          published_at: p.published_at || null,
          read_time: p.read_time,
          category_id: p.category_id || null,
          is_published: p.is_published,
          sort_order: i + 1,
        })
        .select("id")
        .single();

      if (!inserted) continue;

      if (p.tags.length > 0) {
        const { data: tagRows } = await supabase!.from("blog_tags").select("id, name");
        const tagMap = Object.fromEntries((tagRows ?? []).map((t) => [t.name, t.id]));
        const tagIds: string[] = [];
        for (const tagName of p.tags) {
          let tid = tagMap[tagName];
          if (!tid) {
            const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            const { data: newTag } = await supabase!.from("blog_tags").insert({ name: tagName, slug }).select("id").single();
            if (newTag) tid = newTag.id;
          }
          if (tid) tagIds.push(tid);
        }
        if (tagIds.length > 0) {
          await supabase!.from("blog_post_tags").insert(tagIds.map((tid) => ({ blog_post_id: inserted.id, tag_id: tid })));
        }
      }
    }

    toast.success("Blog posts saved!");
    setSaving(false);
  };

  if (loading) return <AdminLayout><p>Loading...</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-1">Rich editor siap -- tulis artikel dengan format</p>
        </div>
        <div className="flex gap-2">
          <button onClick={addItem} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> Tambah
          </button>
          <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 text-sm font-medium transition-colors">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {items.map((p, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Post #{i + 1}</span>
              <button onClick={() => removeItem(i)} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors">
                <Trash2 className="w-3 h-3" /> Hapus
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                  <input placeholder="Judul artikel" value={p.title} onChange={(e) => updateItem(i, "title", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Slug</label>
                  <input placeholder="auto-fill from title" value={p.slug} onChange={(e) => updateItem(i, "slug", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Read Time</label>
                  <input placeholder="e.g. 5 min read" value={p.read_time} onChange={(e) => updateItem(i, "read_time", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Published Date</label>
                  <input type="date" value={p.published_at} onChange={(e) => updateItem(i, "published_at", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                  <select value={p.category_id ?? ""} onChange={(e) => updateItem(i, "category_id", e.target.value || null)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none">
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                  <div className="flex items-center gap-3 h-10">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={p.is_published} onChange={(e) => updateItem(i, "is_published", e.target.checked)} className="rounded" />
                      <span className={p.is_published ? "text-green-600" : "text-gray-400"}>
                        {p.is_published ? "Published" : "Draft"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Excerpt</label>
                <input placeholder="Ringkasan singkat artikel" value={p.excerpt} onChange={(e) => updateItem(i, "excerpt", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Content</label>
                <RichTextEditor
                  content={p.content}
                  onChange={(html) => updateItem(i, "content", html)}
                  placeholder="Mulai menulis artikel..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Tags (pisahkan koma)</label>
                <input placeholder="React, JavaScript, Web Development" value={p.tags.join(", ")} onChange={(e) => updateItem(i, "tags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none" />
              </div>
              <ImageUpload label="Featured Image" currentImage={p.image_base64} onImageChange={(b64) => updateItem(i, "image_base64", b64)} />
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
