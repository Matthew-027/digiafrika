import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { DeskGate } from "@/components/dashboard/desk-gate";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDash } from "@/lib/dash-context";
import { formatDate, formatMoney, formatNumber } from "@/lib/format";
import { PRODUCT_STATUS_COPY } from "@/lib/product";
import { saveVendorProfile, submitVendorApplication } from "@/lib/server/platform";
import { CATEGORIES, COUNTRIES, type VendorProfile } from "@/lib/types";
import {
  VENDOR_STATUS_COPY,
  vendorCanEdit,
  vendorCanPublish,
  vendorCanSubmit,
} from "@/lib/vendor";

export const Route = createFileRoute("/dashboard/vendor")({ component: VendorRoute });

function VendorRoute() {
  return (
    <DeskGate desk="vendor">
      <VendorHome />
    </DeskGate>
  );
}

function statusTone(status: VendorProfile["status"]) {
  if (status === "approved") return "ok" as const;
  if (status === "rejected" || status === "suspended") return "warn" as const;
  if (status === "pending_review") return "gold" as const;
  return "muted" as const;
}

function VendorHome() {
  const { data } = useDash();
  const vendor = data.vendorProfile;
  const products = data.vendorCampaigns;
  const approvedCount = products.filter((c) => c.status === "approved").length;
  const pendingCount = products.filter((c) => c.status === "pending_review").length;
  const approved = vendor ? vendorCanPublish(vendor.status) : false;

  return (
    <div>
      <PageHeader
        kicker="Vendor"
        title="Vendor Dashboard"
        description="Verification first. Create products only after Admin approves this store."
      />
      {vendor ? <StatusCard vendor={vendor} /> : null}
      {vendor ? <VendorApplicationForm vendor={vendor} /> : null}
      {approved ? (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <StatCard label="Approved products" value={formatNumber(approvedCount)} hint={`${products.length} total`} />
            <StatCard label="Pending review" value={formatNumber(pendingCount)} hint="Waiting on Admin" />
            <StatCard
              label="Drafts"
              value={formatNumber(products.filter((c) => c.status === "draft").length)}
              hint="Not submitted"
            />
          </div>
          <div className="mt-8 flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">Your products</h2>
            <Button asChild size="sm" variant="gold">
              <Link to="/dashboard/campaigns">Manage products</Link>
            </Button>
          </div>
          {products.length === 0 ? (
            <div className="mt-3">
              <EmptyState
                title="No products yet"
                body="Create a draft, then submit it for Admin review before it can appear in the marketplace."
                action={
                  <Button asChild variant="gold">
                    <Link to="/dashboard/campaigns">Create product</Link>
                  </Button>
                }
              />
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {products.slice(0, 6).map((c) => (
                <li key={c.id} className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
                  <div>
                    <p className="font-medium">{c.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatMoney(c.priceAmount, c.currency)} ·{" "}
                      {c.commissionType === "fixed"
                        ? `${formatMoney(c.commissionValue, c.currency)} commission`
                        : `${c.commissionValue}% commission`}
                    </p>
                  </div>
                  <Badge
                    tone={
                      c.status === "approved" ? "ok" : c.status === "pending_review" ? "gold" : c.status === "rejected" ? "warn" : "muted"
                    }
                  >
                    {PRODUCT_STATUS_COPY[c.status].label}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          Product tools stay closed until this application is approved.{" "}
          <Link to="/dashboard/campaigns" className="text-gold hover:underline">
            Products page
          </Link>
        </p>
      )}
    </div>
  );
}

function StatusCard({ vendor }: { vendor: VendorProfile }) {
  const copy = VENDOR_STATUS_COPY[vendor.status];
  return (
    <div className="mb-6 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={statusTone(vendor.status)}>{copy.label}</Badge>
        {vendor.submittedAt ? (
          <span className="text-xs text-muted-foreground">Submitted {formatDate(vendor.submittedAt)}</span>
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-6">{copy.message}</p>
      {vendor.status === "rejected" && vendor.reviewNote ? (
        <p className="mt-2 rounded-[10px] border border-border bg-secondary px-3 py-2 text-sm">
          Reason: {vendor.reviewNote}
        </p>
      ) : null}
      {vendor.status === "suspended" && vendor.reviewNote ? (
        <p className="mt-2 rounded-[10px] border border-border bg-secondary px-3 py-2 text-sm">
          Reason: {vendor.reviewNote}
        </p>
      ) : null}
      {vendor.storeName ? (
        <p className="mt-3 text-sm text-muted-foreground">
          {vendor.storeName}
          {vendor.category ? ` · ${vendor.category}` : ""}
          {vendor.country ? ` · ${vendor.country}` : ""}
        </p>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">Next action: fill in your store profile below.</p>
      )}
    </div>
  );
}

function VendorApplicationForm({ vendor }: { vendor: VendorProfile }) {
  const { data, reload } = useDash();
  const editable = vendorCanEdit(vendor.status);
  const canSubmit = vendorCanSubmit(vendor.status);
  const [busy, setBusy] = useState<"save" | "submit" | null>(null);
  const [form, setForm] = useState({
    storeName: vendor.storeName,
    description: vendor.description,
    country: vendor.country || data.profile.country,
    contactEmail: vendor.contactEmail || data.profile.email || "",
    contactPhone: vendor.contactPhone || data.profile.phone || "",
    category: vendor.category || "Commerce",
    websiteUrl: vendor.websiteUrl || "",
  });

  const payload = {
    storeName: form.storeName.trim(),
    description: form.description.trim(),
    country: form.country,
    contactEmail: form.contactEmail.trim(),
    contactPhone: form.contactPhone.trim() || undefined,
    category: form.category,
    websiteUrl: form.websiteUrl.trim(),
  };

  async function save() {
    setBusy("save");
    try {
      await saveVendorProfile({ data: payload });
      toast.success("Store profile saved");
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(null);
    }
  }

  async function submit() {
    setBusy("submit");
    try {
      await submitVendorApplication({ data: payload });
      toast.success("Application submitted for review");
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit");
    } finally {
      setBusy(null);
    }
  }

  return (
    <form
      className="rounded-xl border border-border bg-card p-5"
      onSubmit={(e) => {
        e.preventDefault();
        void (canSubmit ? submit() : save());
      }}
    >
      <h2 className="font-display text-lg font-semibold">Store profile</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        No bank details, BVN, or payment credentials. Admin reviews this before you can list offers.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="storeName">Business / store name</Label>
          <Input
            id="storeName"
            value={form.storeName}
            disabled={!editable}
            onChange={(e) => setForm({ ...form, storeName: e.target.value })}
            required
            minLength={2}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="description">Business description</Label>
          <Textarea
            id="description"
            value={form.description}
            disabled={!editable}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            minLength={20}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="country">Country</Label>
          <Select
            id="country"
            value={form.country}
            disabled={!editable}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="category">Business category</Label>
          <Select
            id="category"
            value={form.category}
            disabled={!editable}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contactEmail">Contact email</Label>
          <Input
            id="contactEmail"
            type="email"
            value={form.contactEmail}
            disabled={!editable}
            onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contactPhone">Contact phone</Label>
          <Input
            id="contactPhone"
            value={form.contactPhone}
            disabled={!editable}
            onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="websiteUrl">Website or social link (optional)</Label>
          <Input
            id="websiteUrl"
            type="url"
            placeholder="https://"
            value={form.websiteUrl}
            disabled={!editable}
            onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
          />
        </div>
      </div>
      {editable ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="outline" disabled={Boolean(busy)} onClick={() => void save()}>
            {busy === "save" ? "Saving…" : "Save draft"}
          </Button>
          {canSubmit ? (
            <Button type="submit" variant="gold" disabled={Boolean(busy)}>
              {busy === "submit" ? "Submitting…" : vendor.status === "rejected" ? "Resubmit for review" : "Submit application"}
            </Button>
          ) : null}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">This store cannot be edited while suspended.</p>
      )}
    </form>
  );
}
