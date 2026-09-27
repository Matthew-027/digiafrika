import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as DESK_HOME } from "./roles-DLM0LukR.mjs";
import { n as cn } from "./utils-CmheKJRZ.mjs";
import { t as Button } from "./button-D1wOC8H9.mjs";
import { n as useCurrentUserState } from "./use-current-user-DG6UNzh9.mjs";
import { t as RedirectToSignIn } from "./gates-B9YfLDZP.mjs";
import { t as Logo } from "./logo-JHktN6y8.mjs";
import { n as Label, t as Input } from "./label-C70zC-P-.mjs";
import { t as Select } from "./select-D2moOl-H.mjs";
import { n as COUNTRIES } from "./types-BgG5KufT.mjs";
import { c as completeOnboarding, m as getMyProfile } from "./router-9kbAl_o0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-BIxU4Byd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CHOICES = [{
	id: "vendor",
	title: "I want to sell products",
	body: "Open a vendor desk. You will submit a store profile for Admin review before listing offers."
}, {
	id: "affiliate",
	title: "I want to promote products and earn commissions",
	body: "Open an affiliate desk. Track links and commissions. You will not get the vendor or admin desks."
}];
function Onboarding() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [displayName, setDisplayName] = (0, import_react.useState)("");
	const [country, setCountry] = (0, import_react.useState)("NG");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)("affiliate");
	const [referral, setReferral] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [checking, setChecking] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const stored = sessionStorage.getItem("da_ref");
		if (stored) setReferral(stored);
	}, []);
	(0, import_react.useEffect)(() => {
		if (isPending || !user) return;
		setDisplayName((prev) => prev || user.displayName || "");
		getMyProfile().then((profile) => {
			if (profile?.onboardedAt) {
				navigate({ to: DESK_HOME[profile.deskRole] });
				return;
			}
			if (profile?.displayName) setDisplayName(profile.displayName);
			if (profile?.country) setCountry(profile.country);
		}).finally(() => setChecking(false));
	}, [
		isPending,
		user,
		navigate
	]);
	if (isPending || checking) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-paper",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 w-48 animate-pulse rounded-xl bg-secondary" })
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		try {
			const profile = await completeOnboarding({ data: {
				displayName: displayName.trim(),
				country,
				role,
				phone: phone.trim() || void 0,
				referralCode: referral.trim() || void 0,
				email: user?.primaryEmail
			} });
			sessionStorage.removeItem("da_ref");
			await navigate({ to: DESK_HOME[profile.deskRole] });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not finish setup");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-dvh bg-paper px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-xs font-semibold uppercase tracking-wider text-forest",
					children: "Onboarding"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-3xl font-semibold",
					children: "Choose your desk"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Pick one account type. Admin is not available here — operator access is granted separately."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-8 space-y-5",
					onSubmit: (e) => void onSubmit(e),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "displayName",
								children: "Display name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "displayName",
								value: displayName,
								onChange: (e) => setDisplayName(e.target.value),
								minLength: 2,
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "country",
									children: "Country"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
									id: "country",
									value: country,
									onChange: (e) => setCountry(e.target.value),
									children: COUNTRIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: c.code,
										children: c.label
									}, c.code))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "phone",
									children: "Phone (optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "phone",
									value: phone,
									onChange: (e) => setPhone(e.target.value),
									placeholder: "+234…"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Account type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-2",
								children: CHOICES.map((choice) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setRole(choice.id),
									className: cn("rounded-xl border px-4 py-3 text-left", role === choice.id ? "border-forest bg-forest/10" : "border-border bg-cream"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: choice.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: choice.body
									})]
								}, choice.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "referral",
								children: "Referral code (optional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "referral",
								value: referral,
								onChange: (e) => setReferral(e.target.value.toUpperCase()),
								placeholder: "AF••••"
							})]
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-danger",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							disabled: busy,
							children: busy ? "Opening desk…" : role === "vendor" ? "Enter vendor desk" : "Enter affiliate desk"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { Onboarding as component };
