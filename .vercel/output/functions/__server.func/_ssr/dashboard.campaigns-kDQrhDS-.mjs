import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as DialogOverlay, i as DialogDescription$1, n as DialogClose, o as DialogPortal, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as cn } from "./utils-CmheKJRZ.mjs";
import { t as Button } from "./button-D1wOC8H9.mjs";
import { n as useDash } from "./dash-context-B75R4djK.mjs";
import { r as formatMoney, t as formatDate } from "./format-DUFBhTUp.mjs";
import { t as X } from "../_libs/lucide-react.mjs";
import { i as vendorCanPublish } from "./vendor-BTHRHLIA.mjs";
import { a as PRODUCT_TYPE_LABEL, d as productCanSubmit, f as productIsPublic, i as PRODUCT_TYPES, n as CURRENCIES, r as PRODUCT_STATUS_COPY, t as COMMISSION_TYPES, u as productCanEdit } from "./product-CDkg8sUW.mjs";
import { t as DeskGate } from "./desk-gate-DGpAkU7r.mjs";
import { t as PageHeader } from "./page-header-q1jyUXqN.mjs";
import { t as Badge } from "./badge-BflTX_CK.mjs";
import { n as Label, t as Input } from "./label-C70zC-P-.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as EmptyState } from "./empty-state-Dvl4RVDR.mjs";
import { t as Select } from "./select-D2moOl-H.mjs";
import { t as Textarea } from "./textarea-BnDEs-G6.mjs";
import { t as CATEGORIES } from "./types-BgG5KufT.mjs";
import { E as submitProduct, O as uploadProductImage, l as createProduct, w as saveProduct } from "./router-9kbAl_o0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.campaigns-kDQrhDS-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-ink/45" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed left-1/2 top-1/2 z-50 w-[min(32rem,calc(100vw-1.5rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-cream p-5 shadow-[var(--shadow-soft)]", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-[10px] hover:bg-secondary",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-lg font-semibold", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("text-sm text-muted-foreground", className),
		...props
	});
}
function CampaignsRoute() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskGate, {
		desk: "vendor",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductsPage, {})
	});
}
function statusTone(status) {
	if (status === "approved") return "ok";
	if (status === "pending_review") return "gold";
	if (status === "rejected" || status === "suspended") return "warn";
	return "muted";
}
function commissionLabel(product) {
	if (product.commissionType === "fixed") return formatMoney(product.commissionValue, product.currency);
	return `${product.commissionValue}%`;
}
function ProductsPage() {
	const { data, reload } = useDash();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const approved = data.vendorProfile ? vendorCanPublish(data.vendorProfile.status) : false;
	function openCreate() {
		setEditing(null);
		setOpen(true);
	}
	function openEdit(product) {
		setEditing(product);
		setOpen(true);
	}
	if (!approved) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		kicker: "Vendors",
		title: "Products",
		description: "Only an approved Vendor account can create offers."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "Vendor verification required",
		body: data.vendorProfile?.status === "suspended" ? "Your Vendor account is currently suspended." : data.vendorProfile?.status === "pending_review" ? "Your Vendor application is currently under review." : data.vendorProfile?.status === "rejected" ? "Your Vendor application was rejected. Update your store profile and resubmit." : "Complete and submit your store profile before you can create products.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			variant: "gold",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/dashboard/vendor",
				children: "Open vendor application"
			})
		})
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Vendors",
			title: "Products",
			description: "Create drafts, submit them for Admin review, and track approval. Affiliates will only see approved offers.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "gold",
				onClick: openCreate,
				children: "New product"
			})
		}),
		data.vendorCampaigns.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No products yet",
			body: "Save a draft with name, price, currency, and commission. Submit it when you are ready for review.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "gold",
				onClick: openCreate,
				children: "Create product"
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: data.vendorCampaigns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
				className: "rounded-xl border border-border bg-card p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 md:flex-row md:items-start md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3",
						children: [c.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: c.imageUrl,
							alt: "",
							className: "h-16 w-16 shrink-0 rounded-[10px] object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-16 w-16 shrink-0 place-items-center rounded-[10px] bg-secondary text-xs text-muted-foreground",
							children: "No image"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-lg font-semibold",
									children: c.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: statusTone(c.status),
									children: PRODUCT_STATUS_COPY[c.status].label
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: c.tagline
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: [
									PRODUCT_TYPE_LABEL[c.productType],
									" · ",
									formatMoney(c.priceAmount, c.currency),
									" ·",
									" ",
									commissionLabel(c),
									" commission"
								]
							}),
							c.status === "rejected" && c.reviewNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm",
								children: ["Reason: ", c.reviewNote]
							}) : null,
							c.submittedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: ["Submitted ", formatDate(c.submittedAt)]
							}) : null
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [productIsPublic(c.status, c.isDemo) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/offers/$slug",
								params: { slug: c.slug },
								children: "Public page"
							})
						}) : null, productCanEdit(c.status) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => openEdit(c),
							children: "Edit"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => openEdit(c),
							children: "View"
						})]
					})]
				})
			}, c.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductDialog, {
			open,
			product: editing,
			onOpenChange: (v) => {
				setOpen(v);
				if (!v) setEditing(null);
			},
			onSaved: () => void reload()
		})
	] });
}
function emptyForm() {
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
		landingUrl: ""
	};
}
function fromProduct(product) {
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
		landingUrl: product.landingUrl || ""
	};
}
function ProductDialog({ open, product, onOpenChange, onSaved }) {
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(emptyForm);
	const editable = product ? productCanEdit(product.status) : true;
	const canSubmit = !product || productCanSubmit(product.status);
	(0, import_react.useEffect)(() => {
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
		commissionMode: "one_time",
		imageUrl: form.imageUrl.trim(),
		landingUrl: form.landingUrl.trim()
	};
	async function saveDraft() {
		setBusy("save");
		try {
			if (product) await saveProduct({ data: {
				id: product.id,
				...payload
			} });
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
				await submitProduct({ data: {
					id: created.id,
					...payload
				} });
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
			await submitProduct({ data: {
				id: product.id,
				...payload
			} });
			toast.success("Product submitted for review");
			onOpenChange(false);
			onSaved();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not submit product");
		} finally {
			setBusy(null);
		}
	}
	async function onFile(file) {
		if (!file) return;
		setBusy("image");
		try {
			const dataUrl = await new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(String(reader.result));
				reader.onerror = () => reject(/* @__PURE__ */ new Error("Could not read image"));
				reader.readAsDataURL(file);
			});
			const res = await uploadProductImage({ data: { dataUrl } });
			setForm((prev) => ({
				...prev,
				imageUrl: res.url
			}));
			toast.success("Image uploaded");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not upload image");
		} finally {
			setBusy(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => {
			if (v) setForm(product ? fromProduct(product) : emptyForm());
			onOpenChange(v);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90dvh] overflow-y-auto bg-card text-card-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: product ? product.title : "New product" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: product ? PRODUCT_STATUS_COPY[product.status].message : "Saved as a draft. Admin review comes after you submit." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 grid gap-3",
					onSubmit: (e) => {
						e.preventDefault();
						product && canSubmit ? submit() : saveDraft();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							id: "productName",
							label: "Product name",
							value: form.title,
							onChange: (v) => setForm({
								...form,
								title: v
							}),
							required: true,
							disabled: !editable
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							id: "productTagline",
							label: "Short description",
							value: form.tagline,
							onChange: (v) => setForm({
								...form,
								tagline: v
							}),
							required: true,
							disabled: !editable
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "productCategory",
									children: "Category"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
									id: "productCategory",
									value: form.category,
									disabled: !editable,
									onChange: (e) => setForm({
										...form,
										category: e.target.value
									}),
									children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: c,
										children: c
									}, c))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "productType",
									children: "Product type"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
									id: "productType",
									value: form.productType,
									disabled: !editable,
									onChange: (e) => setForm({
										...form,
										productType: e.target.value
									}),
									children: PRODUCT_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: t,
										children: PRODUCT_TYPE_LABEL[t]
									}, t))
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "productDescription",
								children: "Full description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "productDescription",
								value: form.description,
								disabled: !editable,
								onChange: (e) => setForm({
									...form,
									description: e.target.value
								}),
								required: true,
								minLength: 20
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								id: "productPrice",
								label: "Price",
								type: "number",
								value: form.priceAmount,
								onChange: (v) => setForm({
									...form,
									priceAmount: v
								}),
								required: true,
								disabled: !editable
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Currency" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
									value: form.currency,
									disabled: !editable,
									onChange: (e) => setForm({
										...form,
										currency: e.target.value
									}),
									children: CURRENCIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: c,
										children: c
									}, c))
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Commission type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
									value: form.commissionType,
									disabled: !editable,
									onChange: (e) => setForm({
										...form,
										commissionType: e.target.value
									}),
									children: COMMISSION_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: t,
										children: t === "percent" ? "Percentage" : "Fixed amount"
									}, t))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								id: "productCommission",
								label: form.commissionType === "percent" ? "Commission %" : "Commission amount",
								type: "number",
								value: form.commissionValue,
								onChange: (v) => setForm({
									...form,
									commissionValue: v
								}),
								required: true,
								disabled: !editable
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Product image" }),
								form.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: form.imageUrl,
									alt: "",
									className: "h-24 w-24 rounded-[10px] object-cover"
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "file",
									accept: "image/jpeg,image/png,image/webp",
									disabled: !editable || busy === "image",
									onChange: (e) => void onFile(e.target.files?.[0])
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									id: "productImageUrl",
									label: "Or image URL",
									value: form.imageUrl,
									onChange: (v) => setForm({
										...form,
										imageUrl: v
									}),
									disabled: !editable
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							id: "productUrl",
							label: "Product URL / delivery info (optional)",
							value: form.landingUrl,
							onChange: (v) => setForm({
								...form,
								landingUrl: v
							}),
							disabled: !editable
						}),
						product?.status === "rejected" && product.reviewNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "rounded-[10px] border border-border bg-secondary px-3 py-2 text-sm",
							children: ["Rejection reason: ", product.reviewNote]
						}) : null,
						editable ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								disabled: Boolean(busy),
								onClick: () => void saveDraft(),
								children: busy === "save" ? "Saving…" : "Save draft"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "gold",
								disabled: Boolean(busy),
								onClick: () => void submit(),
								children: busy === "submit" ? "Submitting…" : product?.status === "rejected" ? "Resubmit for review" : "Submit for review"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: PRODUCT_STATUS_COPY[product.status].message
						})
					]
				})
			]
		})
	});
}
function Field({ id, label, value, onChange, type = "text", required, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			htmlFor: id,
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			id,
			type,
			value,
			onChange: (e) => onChange(e.target.value),
			required,
			disabled
		})]
	});
}
//#endregion
export { CampaignsRoute as component };
