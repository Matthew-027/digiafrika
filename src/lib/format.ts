export function formatNgn(amount: number) {
  return formatMoney(amount, "NGN");
}

export function formatMoney(amount: number, currency = "NGN") {
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString("en")}`;
  }
}

export function formatCompact(amount: number) {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(1)}k`;
  return formatNgn(amount);
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-NG").format(n);
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 72);
}

export function trackingUrl(code: string) {
  if (typeof window === "undefined") return `/t/${code}`;
  return `${window.location.origin}/t/${code}`;
}

export function referralUrl(code: string) {
  if (typeof window === "undefined") return `/login?join=1&ref=${code}`;
  return `${window.location.origin}/login?join=1&ref=${code}`;
}

export function payoutMethodLabel(method: string) {
  if (method === "paystack") return "Paystack";
  if (method === "flutterwave") return "Flutterwave";
  if (method === "mpesa") return "M-Pesa";
  if (method === "bank_ng") return "Bank transfer";
  return method;
}
