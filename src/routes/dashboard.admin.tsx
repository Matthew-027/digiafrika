import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DeskGate } from "@/components/dashboard/desk-gate";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDash } from "@/lib/dash-context";
import { formatDate, formatMoney, formatNgn, payoutMethodLabel } from "@/lib/format";
import {
  adminSettlePayout,
  getAdminDesk,
  reviewProduct,
  reviewVendorApplication,
  savePlatformSettings,
} from "@/lib/server/platform";
import { PRODUCT_STATUS_COPY, PRODUCT_TYPE_LABEL, type ProductStatus } from "@/lib/product";
import type { Campaign, Payout, Settings, VendorApplication } from "@/lib/types";
import { VENDOR_STATUS_COPY, type VendorStatus } from "@/lib/vendor";

export const Route = createFileRoute("/dashboard/admin")({ component: AdminRoute });

function AdminRoute() {
  return (
    <DeskGate desk="admin">
      <AdminDesk />
    </DeskGate>
  );
}

type Desk = {
  users: Array<{ userId: string; displayName: string; roles: string; country: string; createdAt: string }>;
  campaigns: Campaign[];
  payouts: Payout[];
  vendorApplications: VendorApplication[];
  settings: Settings;
};

function AdminDesk() {
  const { data } = useDash();
  const [desk, setDesk] = useState<Desk | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAdminDesk()
      .then((next) => {
        if (cancelled) return;
        setDesk(next);
        setError(null);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Access denied");
      });
    return () => {
      cancelled = true;
    };
  }, [data.profile.userId]);

  if (error) {
    return (
      <div>
        <PageHeader kicker="Operator" title="Admin Dashboard" />
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }
  if (!desk) {
    return (
      <div>
        <div className="h-40 animate-pulse rounded-xl bg-secondary" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        kicker="Operator"
        title="Admin Dashboard"
        description="Vendor applications, product review, members, settlement queue, and platform knobs."
      />
      <Tabs defaultValue="vendors">
        <TabsList className="flex h-auto flex-wrap">
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="users">Members</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="vendors" className="mt-4">
          <VendorApplications rows={desk.vendorApplications} onDone={() => void getAdminDesk().then(setDesk)} />
        </TabsContent>
        <TabsContent value="products" className="mt-4">
          <ProductReview rows={desk.campaigns} onDone={() => void getAdminDesk().then(setDesk)} />
        </TabsContent>
        <TabsContent value="payouts" className="mt-4">
          <PayoutQueue rows={desk.payouts} onDone={() => void getAdminDesk().then(setDesk)} />
        </TabsContent>
        <TabsContent value="users" className="mt-4">
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="min-w-[640px] w-full text-sm">
              <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Roles</th>
                  <th className="px-4 py-3">Country</th>
                  <th className="px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {desk.users.map((u) => (
                  <tr key={u.userId} className="border-t border-border">
                    <td className="px-4 py-3">{u.displayName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.roles}</td>
                    <td className="px-4 py-3">{u.country}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="settings" className="mt-4">
          <SettingsForm initial={desk.settings} onDone={() => void getAdminDesk().then(setDesk)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function VendorApplications({
  rows,
  onDone,
}: {
  rows: VendorApplication[];
  onDone: () => void;
}) {
  const [filter, setFilter] = useState<"all" | VendorStatus>("all");
  const [busy, setBusy] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const visible = rows.filter((row) => (filter === "all" ? true : row.status === filter));

  async function act(userId: string, action: "approve" | "reject" | "suspend") {
    setBusy(`${userId}-${action}`);
    try {
      await reviewVendorApplication({
        data: { userId, action, reason: reason.trim() || undefined },
      });
      toast.success(
        action === "approve" ? "Vendor approved" : action === "reject" ? "Vendor rejected" : "Vendor suspended",
      );
      setReason("");
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Access denied");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["all", "pending_review", "approved", "rejected", "suspended"] as const).map((key) => (
            <Button key={key} size="sm" variant={filter === key ? "gold" : "outline"} onClick={() => setFilter(key)}>
              {key === "all" ? "All" : VENDOR_STATUS_COPY[key].label}
            </Button>
          ))}
        </div>
        <div className="w-full sm:max-w-xs">
          <Label htmlFor="reviewReason">Reject / suspend reason (optional)</Label>
          <Input
            id="reviewReason"
            className="mt-1"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Shown to the vendor"
          />
        </div>
      </div>
      {visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">No vendor applications in this filter.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="min-w-[880px] w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Store</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.userId} className="border-t border-border">
                  <td className="px-4 py-3">
                    <p className="font-medium">{row.displayName}</p>
                    <p className="text-xs text-muted-foreground">{row.email || row.userId}</p>
                  </td>
                  <td className="px-4 py-3">{row.storeName || "—"}</td>
                  <td className="px-4 py-3">{row.country}</td>
                  <td className="px-4 py-3">{row.category || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {row.submittedAt ? formatDate(row.submittedAt) : "Not submitted"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      tone={
                        row.status === "approved"
                          ? "ok"
                          : row.status === "pending_review"
                            ? "gold"
                            : row.status === "rejected" || row.status === "suspended"
                              ? "warn"
                              : "muted"
                      }
                    >
                      {VENDOR_STATUS_COPY[row.status].label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {row.status === "pending_review" || row.status === "suspended" ? (
                        <Button
                          size="sm"
                          disabled={busy === `${row.userId}-approve`}
                          onClick={() => void act(row.userId, "approve")}
                        >
                          Approve
                        </Button>
                      ) : null}
                      {row.status === "pending_review" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busy === `${row.userId}-reject`}
                          onClick={() => void act(row.userId, "reject")}
                        >
                          Reject
                        </Button>
                      ) : null}
                      {row.status === "approved" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busy === `${row.userId}-suspend`}
                          onClick={() => void act(row.userId, "suspend")}
                        >
                          Suspend
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PayoutQueue({ rows, onDone }: { rows: Payout[]; onDone: () => void }) {
  const [busy, setBusy] = useState<string | null>(null);

  async function settle(id: string, status: "paid" | "rejected") {
    setBusy(id);
    try {
      await adminSettlePayout({ data: { id, status } });
      toast.success(status === "paid" ? "Marked paid" : "Payout returned");
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Access denied");
    } finally {
      setBusy(null);
    }
  }

  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">No payout requests in the queue.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="min-w-[720px] w-full text-sm">
        <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Rail</th>
            <th className="px-4 py-3">Destination</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">When</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id} className="border-t border-border">
              <td className="px-4 py-3 tabular font-medium">{formatNgn(Number(p.amountNgn))}</td>
              <td className="px-4 py-3">{payoutMethodLabel(p.method)}</td>
              <td className="max-w-[220px] truncate px-4 py-3 text-muted-foreground">{p.details}</td>
              <td className="px-4 py-3">
                <Badge tone={p.status === "paid" ? "ok" : p.status === "rejected" ? "warn" : "muted"}>
                  {p.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{formatDate(p.createdAt)}</td>
              <td className="px-4 py-3">
                {p.status === "processing" || p.status === "requested" ? (
                  <div className="flex gap-2">
                    <Button size="sm" disabled={busy === p.id} onClick={() => void settle(p.id, "paid")}>
                      Pay
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy === p.id}
                      onClick={() => void settle(p.id, "rejected")}
                    >
                      Reject
                    </Button>
                  </div>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductReview({ rows, onDone }: { rows: Campaign[]; onDone: () => void }) {
  const [filter, setFilter] = useState<"all" | ProductStatus>("all");
  const [busy, setBusy] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const visible = rows.filter((row) => !row.isDemo && (filter === "all" ? true : row.status === filter));

  async function act(id: string, action: "approve" | "reject" | "suspend") {
    setBusy(`${id}-${action}`);
    try {
      await reviewProduct({ data: { id, action, reason: reason.trim() || undefined } });
      toast.success(action === "approve" ? "Product approved" : action === "reject" ? "Product rejected" : "Product suspended");
      setReason("");
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Access denied");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["all", "pending_review", "approved", "rejected", "suspended", "draft"] as const).map((key) => (
            <Button key={key} size="sm" variant={filter === key ? "gold" : "outline"} onClick={() => setFilter(key)}>
              {key === "all" ? "All" : PRODUCT_STATUS_COPY[key].label}
            </Button>
          ))}
        </div>
        <div className="w-full sm:max-w-xs">
          <Label htmlFor="productReason">Reject / suspend reason (optional)</Label>
          <Input
            id="productReason"
            className="mt-1"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Shown to the vendor"
          />
        </div>
      </div>
      {visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">No products in this filter.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="min-w-[960px] w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Commission</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{row.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.vendorName}</td>
                  <td className="px-4 py-3">{PRODUCT_TYPE_LABEL[row.productType]}</td>
                  <td className="px-4 py-3 tabular">{formatMoney(row.priceAmount, row.currency)}</td>
                  <td className="px-4 py-3 tabular">
                    {row.commissionType === "fixed"
                      ? formatMoney(row.commissionValue, row.currency)
                      : `${row.commissionValue}%`}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {row.submittedAt ? formatDate(row.submittedAt) : "Not submitted"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      tone={
                        row.status === "approved"
                          ? "ok"
                          : row.status === "pending_review"
                            ? "gold"
                            : row.status === "rejected" || row.status === "suspended"
                              ? "warn"
                              : "muted"
                      }
                    >
                      {PRODUCT_STATUS_COPY[row.status].label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {row.status === "pending_review" || row.status === "suspended" ? (
                        <Button size="sm" disabled={busy === `${row.id}-approve`} onClick={() => void act(row.id, "approve")}>
                          Approve
                        </Button>
                      ) : null}
                      {row.status === "pending_review" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busy === `${row.id}-reject`}
                          onClick={() => void act(row.id, "reject")}
                        >
                          Reject
                        </Button>
                      ) : null}
                      {row.status === "approved" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busy === `${row.id}-suspend`}
                          onClick={() => void act(row.id, "suspend")}
                        >
                          Suspend
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SettingsForm({ initial, onDone }: { initial: Settings; onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    minPayoutNgn: String(initial.minPayoutNgn),
    cookieDays: String(initial.cookieDays),
    referralPct: String(initial.referralPct),
    platformFeePct: String(initial.platformFeePct),
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await savePlatformSettings({
        data: {
          minPayoutNgn: Number(form.minPayoutNgn),
          cookieDays: Number(form.cookieDays),
          referralPct: Number(form.referralPct),
          platformFeePct: Number(form.platformFeePct),
        },
      });
      toast.success("Platform settings saved");
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Access denied");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="max-w-xl space-y-4 rounded-xl border border-border bg-card p-5" onSubmit={(e) => void onSubmit(e)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="minPayout">Minimum payout (NGN)</Label>
          <Input
            id="minPayout"
            type="number"
            min={0}
            value={form.minPayoutNgn}
            onChange={(e) => setForm({ ...form, minPayoutNgn: e.target.value })}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cookieDays">Default cookie (days)</Label>
          <Input
            id="cookieDays"
            type="number"
            min={1}
            max={90}
            value={form.cookieDays}
            onChange={(e) => setForm({ ...form, cookieDays: e.target.value })}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="referralPct">Referral override (%)</Label>
          <Input
            id="referralPct"
            type="number"
            min={0}
            max={50}
            value={form.referralPct}
            onChange={(e) => setForm({ ...form, referralPct: e.target.value })}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="platformFee">Platform fee (%)</Label>
          <Input
            id="platformFee"
            type="number"
            min={0}
            max={40}
            value={form.platformFeePct}
            onChange={(e) => setForm({ ...form, platformFeePct: e.target.value })}
            required
          />
        </div>
      </div>
      <Button type="submit" disabled={busy}>
        {busy ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
