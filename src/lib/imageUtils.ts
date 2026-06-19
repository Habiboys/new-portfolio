import { getStoragePublicUrl, normalizeImageStorage, toStorageReference } from "@/lib/storage";

function isInvalidDataUrl(value: string): boolean {
  if (!value.startsWith("data:")) return false;
  if (value.includes("PASTE_BASE64") || value.includes("PASTE_")) return true;

  const base64Part = value.split(";base64,")[1];
  if (!base64Part || base64Part.length < 32) return true;

  return false;
}

export function resolveImage(value: string | null | undefined): string {
  if (!value) return "";

  const trimmed = value.trim();
  if (!trimmed || trimmed.includes("PASTE_BASE64") || trimmed.includes("PASTE_")) {
    return "";
  }

  if (trimmed.startsWith("data:")) {
    return isInvalidDataUrl(trimmed) ? "" : trimmed;
  }

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }

  if (trimmed.startsWith("storage:")) {
    return getStoragePublicUrl(trimmed.slice("storage:".length));
  }

  return trimmed;
}

export function normalizeImageStorageValue(value: string | null | undefined): string {
  if (!value) return "";
  return normalizeImageStorage(value.trim());
}

export { toStorageReference };
