import { supabase } from "@/lib/supabase";

export const PORTFOLIO_MEDIA_BUCKET = "portfolio-media";

export type UploadResult = {
  ref: string;
  publicUrl: string;
};

export function getStoragePublicUrl(path: string): string {
  if (!supabase || !path) return path;
  const { data } = supabase.storage.from(PORTFOLIO_MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadPortfolioImage(
  file: File,
  folder = "uploads"
): Promise<UploadResult | null> {
  if (!supabase) return null;

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;

  const { error } = await supabase.storage.from(PORTFOLIO_MEDIA_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || `image/${ext}`,
  });

  if (error) {
    console.warn("[storage] upload failed:", error.message);
    return null;
  }

  return {
    ref: `storage:${path}`,
    publicUrl: getStoragePublicUrl(path),
  };
}

export function isStorageUrl(value: string): boolean {
  return value.startsWith("storage:");
}

export function toStorageReference(publicUrl: string): string | null {
  if (!publicUrl) return null;
  if (publicUrl.startsWith("storage:")) return publicUrl;

  const marker = `/storage/v1/object/public/${PORTFOLIO_MEDIA_BUCKET}/`;
  if (!publicUrl.includes(marker)) return null;

  const path = publicUrl.split(marker)[1]?.split("?")[0];
  return path ? `storage:${decodeURIComponent(path)}` : null;
}

export function normalizeImageStorage(value: string): string {
  if (!value) return "";
  const ref = toStorageReference(value);
  if (ref) return ref;
  if (value.startsWith("storage:")) return value;
  return value;
}
