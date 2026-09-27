import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DeskGate } from "@/components/dashboard/desk-gate";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDash } from "@/lib/dash-context";
import { formatDate, formatMoney } from "@/lib/format";
import {
  COMMISSION_TYPES,
  CURRENCIES,
  PRODUCT_STATUS_COPY,
  PRODUCT_TYPE_LABEL,
  PRODUCT_TYPES,
  productCanEdit,
  productCanSubmit,
  productIsPublic,
  type CommissionType,
  type CurrencyCode,
  type ProductStatus,
  type ProductType,
} from "@/lib/product";
import { createProduct, saveProduct, submitProduct, uploadProductImage } from "@/lib/server/platform";
import { CATEGORIES, type Campaign } from "@/lib/types";
import { vendorCanPublish } from "@/lib/vendor";

export const Route = createFileRoute("/dashboard/campaigns")({ component: CampaignsRoute });

function CampaignsRoute() {
  return (
    <DeskGate desk="vendor">
      <ProductsPage />
    </DeskGate>
  );
}

function statusTone(status: ProductStatus) {
  if (status === "approved") return "ok" as const;
  if (status === "pending_review") return "gold" as const;
  if (status === "rejected" || status === "suspended") return "warn" as const;
  return "muted" as const;
}

function commissionLabel(product: Campaign) {
  if (product.commissionType === "fixed") return formatMoney(product.commissionValue, product.currency);
  return `${product.commissionValue}%`;
}

function ProductsPage() {
  const { data, reload } = useDash();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const approved = data.vendorProfile ? vendorCanPublish(data.vendorProfile.status) : false;

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(product: Campaign) {
    setEditing(product);
    setOpen(true);
  }

  if (!approved) {
    return (
      <div>
        <PageHeader
          kicker="Vendors"
          title="Products"
          description="Only an approved Vendor account can create offers."
        />
        <EmptyState
          title="Vendor verification required"
          body={
            data.vendorProfile?.status === "suspended"
              ? "Your Vendor account is currently suspended."
              : data.vendorProfile?.status === "pending_review"
                ? "Your Vendor application is currently under review."
                : data.vendorProfile?.status === "rejected"
                  ? "Your Vendor application was rejected. Update your store profile and resubmit."
                  : "Complete and submit your store profile before you can create products."
          }
          action={
            <Button asChild variant="gold">
              <Link to="/dashboard/vendor">Open vendor application</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        kicker="Vendors"
        title="Products"
        description="Create drafts, submit them for Admin review, and track approval. Affiliates will only see approved offers."
        action={
          <Button variant="gold" onClick={openCreate}>
            New product
          </Button>
        }
      />
      {data.vendorCampaigns.length === 0 ? (
        <EmptyState
          title="No products yet"
          body="Save a draft with name, price, currency, and commission. Submit it when you are ready for review."
          action={
            <Button variant="gold" onClick={openCreate}>
              Create product
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {data.vendorCampaigns.map((c) => (
            <article key={c.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-3">
                  {c.imageUrl ? (
                    <img src={c.imageUrl} alt="" className="h-16 w-16 shrink-0 rounded-[10px] object-cover" />
                  ) : (
                    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[10px] bg-secondary text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-lg font-semibold">{c.title}</h2>
                      <Badge tone={statusTone(c.status)}>{PRODUCT_STATUS_COPY[c.status].label}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{c.tagline}</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {PRODUCT_TYPE_LABEL[c.productType]} · {formatMoney(c.priceAmount, c.currency)} ·{" "}
                      {commissionLabel(c)} commission
                    </p>
                    {c.status === "rejected" && c.reviewNote ? (
                      <p className="mt-2 text-sm">Reason: {c.reviewNote}</p>
                    ) : null}
                    {c.submittedAt ? (
                      <p className="mt-1 text-xs text-muted-foreground">Submitted {formatDate(c.submittedAt)}</p>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {productIsPublic(c.status, c.isDemo) ? (
                    <Button asChild size="sm" variant="outline">
                      <Link to="/offers/$slug" params={{ slug: c.slug }}>
                        Public page
                      </Link>
                    </Button>
                  ) : null}
                  {productCanEdit(c.status) ? (
                    <Button size="sm" variant="outline" onClick={() => openEdit(c)}>
                      Edit
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => openEdit(c)}>
                      View
                    </Button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      <ProductDialog
        open={open}
        product={editing}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setEditing(null);
        }}
        onSaved={() => void reload()}
      />
    </div>
  );
}

type ProductFormState = {
  title: string;
  tagline: string;
  category: string;
  productType: ProductType;
  description: string;
  priceAmount: string;
  currency: CurrencyCode;
  commissionType: CommissionType;
  commissionValue: string;
  imageUrl: string;
  landingUrl: string;
};

function emptyForm(): ProductFormState {
  return {
    title: "",
    tagline: "",
    category: "Commerce",
    productType: "digital",
    description: "",
    priceAmount: "20",
    currency: "USD",
    commissionType: "percent",
    commissionValue: "50",
    imageUrl: "",
    landingUrl: "",
  };
}

function fromProduct(product: Campaign): ProductFormState {
  return {
    title: product.title,
    tagline: product.tagline,
    category: product.category,
    productType: product.productType,
    description: product.description,
    priceAmount: String(product.priceAmount),
    currency: product.currency,
    commissionType: product.commissionType,
    commissionValue: String(product.commissionValue),
    imageUrl: product.imageUrl || "",
    landingUrl: product.landingUrl || "",
  };
}

function ProductDialog({
  open,
  product,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  product: Campaign | null;
  onOpenChange: (v: boolean) => void;
  onSaved: () => void;
}) {
  const [busy, setBusy] = useState<"save" | "submit" | "image" | null>(null);
  const [form, setForm] = useState(emptyForm);
  const editable = product ? productCanEdit(product.status) : true;
  const canSubmit = !product || productCanSubmit(product.status);

  useEffect(() => {
    if (open) setForm(product ? fromProduct(product) : emptyForm());
  }, [open, product]);

  const payload = {
    title: form.title.trim(),
    tagline: form.tagline.trim(),
    category: form.category,
    productType: form.productType,
    description: form.description.trim(),
    priceAmount: Number(form.priceAmount),
    currency: form.currency,
    commissionType: form.commissionType,
    commissionValue: Number(form.commissionValue),
    commissionMode: "one_time" as const,
    imageUrl: form.imageUrl.trim(),
    landingUrl: form.landingUrl.trim(),
  };

  async function saveDraft() {
    setBusy("save");
    try {
      if (product) await saveProduct({ data: { id: product.id, ...payload } });
      else await createProduct({ data: payload });
      toast.success(product ? "Draft updated" : "Draft saved");
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save product");
    } finally {
      setBusy(null);
    }
  }

  async function submit() {
    if (!product) {
      setBusy("submit");
      try {
        const created = await createProduct({ data: payload });
        await submitProduct({ data: { id: created.id, ...payload } });
        toast.success("Product submitted for review");
        onOpenChange(false);
        onSaved();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not submit product");
      } finally {
        setBusy(null);
      }
      return;
    }
    setBusy("submit");
    try {
      await submitProduct({ data: { id: product.id, ...payload } });
      toast.success("Product submitted for review");
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit product");
    } finally {
      setBusy(null);
    }
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy("image");
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Could not read image"));
        reader.readAsDataURL(file);
      });
      const res = await uploadProductImage({ data: { dataUrl } });
      setForm((prev) => ({ ...prev, imageUrl: res.url }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not upload image");
    } finally {
      setBusy(null);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (v) setForm(product ? fromProduct(product) : emptyForm());
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto bg-card text-card-foreground">
        <DialogTitle>{product ? product.title : "New product"}</DialogTitle>
        <DialogDescription>
          {product ? PRODUCT_STATUS_COPY[product.status].message : "Saved as a draft. Admin review comes after you submit."}
        </DialogDescription>
        <form
          className="mt-4 grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            void (product && canSubmit ? submit() : saveDraft());
          }}
        >
          <Field
            id="productName"
            label="Product name"
            value={form.title}
            onChange={(v) => setForm({ ...form, title: v })}
            required
            disabled={!editable}
          />
          <Field
            id="productTagline"
            label="Short description"
            value={form.tagline}
            onChange={(v) => setForm({ ...form, tagline: v })}
            required
            disabled={!editable}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="productCategory">Category</Label>
              <Select
                id="productCategory"
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
              <Label htmlFor="productType">Product type</Label>
              <Select
                id="productType"
                value={form.productType}
                disabled={!editable}
                onChange={(e) => setForm({ ...form, productType: e.target.value as ProductType })}
              >
                {PRODUCT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {PRODUCT_TYPE_LABEL[t]}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="productDescription">Full description</Label>
            <Textarea
              id="productDescription"
              value={form.description}
              disabled={!editable}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              minLength={20}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              id="productPrice"
              label="Price"
              type="number"
              value={form.priceAmount}
              onChange={(v) => setForm({ ...form, priceAmount: v })}
              required
              disabled={!editable}
            />
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <Select
                value={form.currency}
                disabled={!editable}
                onChange={(e) => setForm({ ...form, currency: e.target.value as CurrencyCode })}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Commission type</Label>
              <Select
                value={form.commissionType}
                disabled={!editable}
                onChange={(e) => setForm({ ...form, commissionType: e.target.value as typeof form.commissionType })}
              >
                {COMMISSION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t === "percent" ? "Percentage" : "Fixed amount"}
                  </option>
                ))}
              </Select>
            </div>
            <Field
              id="productCommission"
              label={form.commissionType === "percent" ? "Commission %" : "Commission amount"}
              type="number"
              value={form.commissionValue}
              onChange={(v) => setForm({ ...form, commissionValue: v })}
              required
              disabled={!editable}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Product image</Label>
            {form.imageUrl ? (
              <img src={form.imageUrl} alt="" className="h-24 w-24 rounded-[10px] object-cover" />
            ) : null}
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={!editable || busy === "image"}
              onChange={(e) => void onFile(e.target.files?.[0])}
            />
            <Field
              id="productImageUrl"
              label="Or image URL"
              value={form.imageUrl}
              onChange={(v) => setForm({ ...form, imageUrl: v })}
              disabled={!editable}
            />
          </div>
          <Field
            id="productUrl"
            label="Product URL / delivery info (optional)"
            value={form.landingUrl}
            onChange={(v) => setForm({ ...form, landingUrl: v })}
            disabled={!editable}
          />
          {product?.status === "rejected" && product.reviewNote ? (
            <p className="rounded-[10px] border border-border bg-secondary px-3 py-2 text-sm">
              Rejection reason: {product.reviewNote}
            </p>
          ) : null}
          {editable ? (
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" disabled={Boolean(busy)} onClick={() => void saveDraft()}>
                {busy === "save" ? "Saving…" : "Save draft"}
              </Button>
              <Button type="button" variant="gold" disabled={Boolean(busy)} onClick={() => void submit()}>
                {busy === "submit"
                  ? "Submitting…"
                  : product?.status === "rejected"
                    ? "Resubmit for review"
                    : "Submit for review"}
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{PRODUCT_STATUS_COPY[product!.status].message}</p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  required,
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} disabled={disabled} />
    </div>
  );
}
