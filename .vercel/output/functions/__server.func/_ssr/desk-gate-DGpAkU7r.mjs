import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as signOut } from "./client-B40BzJxt.mjs";
import { n as DESK_LABEL, t as DESK_HOME } from "./roles-DLM0LukR.mjs";
import { t as Button } from "./button-D1wOC8H9.mjs";
import { n as useDash } from "./dash-context-B75R4djK.mjs";
import { s as ShieldOff } from "../_libs/lucide-react.mjs";
import { s as assertDeskAccess } from "./router-9kbAl_o0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/desk-gate-DGpAkU7r.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AccessDenied({ profile, expected }) {
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const who = profile.email || profile.displayName;
	const home = DESK_HOME[profile.deskRole];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg py-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid size-14 place-items-center rounded-2xl bg-secondary text-gold",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldOff, { className: "size-7" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-5 font-display text-3xl font-semibold tracking-tight",
				children: "Access denied"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm leading-6 text-muted-foreground",
				children: [
					"You are signed in as ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-foreground",
						children: who
					}),
					" on the",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-foreground",
						children: DESK_LABEL[profile.deskRole]
					}),
					".",
					expected ? ` The ${DESK_LABEL[expected]} is limited to ${expected} accounts.` : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: home,
						children: DESK_LABEL[profile.deskRole]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					disabled: signingOut,
					onClick: () => {
						setSigningOut(true);
						signOut().catch(() => setSigningOut(false));
					},
					children: signingOut ? "Signing out…" : "Sign out"
				})]
			})
		]
	});
}
function DeskGate({ desk, children }) {
	const { data } = useDash();
	const clientOk = data.profile.deskRole === desk;
	const [allowed, setAllowed] = (0, import_react.useState)(clientOk ? null : false);
	(0, import_react.useEffect)(() => {
		if (data.profile.deskRole !== desk) {
			setAllowed(false);
			return;
		}
		let cancelled = false;
		assertDeskAccess({ data: { desk } }).then(() => {
			if (!cancelled) setAllowed(true);
		}).catch(() => {
			if (!cancelled) setAllowed(false);
		});
		return () => {
			cancelled = true;
		};
	}, [
		desk,
		data.profile.deskRole,
		data.profile.userId
	]);
	if (allowed === false) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessDenied, {
		profile: data.profile,
		expected: desk
	});
	if (allowed !== true) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-secondary" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
//#endregion
export { DeskGate as t };
