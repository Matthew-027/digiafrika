import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function newId(prefix: string) {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const tail = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${prefix}_${tail}`;
}

export function trackingCode() {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  let out = "da";
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return out;
}

export function referralCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  let out = "AF";
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return out;
}
