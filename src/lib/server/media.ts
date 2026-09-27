import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const MAX_BYTES = 400_000;
const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function decodeDataUrl(dataUrl: string): { mime: string; bytes: Buffer } {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=\s]+)$/.exec(dataUrl.trim());
  if (!match) throw new Error("Upload a JPEG, PNG, or WebP image");
  const mime = match[1].toLowerCase();
  const bytes = Buffer.from(match[2], "base64");
  return { mime, bytes };
}

/** Local-disk placeholder. Swap this for object storage later; do not put blobs in SQL rows. */
export async function storeProductImage(dataUrl: string, vendorUserId: string): Promise<string> {
  const { mime, bytes } = decodeDataUrl(dataUrl);
  const ext = TYPES[mime];
  if (!ext) throw new Error("Upload a JPEG, PNG, or WebP image");
  if (bytes.length < 32) throw new Error("That image file is empty");
  if (bytes.length > MAX_BYTES) throw new Error("Image must be under 400KB");
  const dir = join(process.cwd(), "public", "uploads", "products");
  await mkdir(dir, { recursive: true });
  const name = `${vendorUserId.replace(/[^a-zA-Z0-9_-]/g, "").slice(-10) || "vendor"}-${Date.now()}.${ext}`;
  try {
    await writeFile(join(dir, name), bytes);
  } catch {
    throw new Error("Image upload is unavailable here. Paste an HTTPS image URL instead.");
  }
  return `/uploads/products/${name}`;
}

export function isAllowedImageUrl(value: string): boolean {
  if (!value) return true;
  if (value.startsWith("/uploads/products/")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
