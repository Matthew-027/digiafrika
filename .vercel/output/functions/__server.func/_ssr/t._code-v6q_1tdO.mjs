import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-D1wOC8H9.mjs";
import { t as Logo } from "./logo-JHktN6y8.mjs";
import { v as ExternalLink } from "../_libs/lucide-react.mjs";
import { n as Route$1 } from "./router-9kbAl_o0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/t._code-v6q_1tdO.js
var import_jsx_runtime = require_jsx_runtime();
function TrackHop() {
	const hop = Route$1.useLoaderData();
	if (!hop.ok) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-paper px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-6 font-display text-2xl font-semibold",
					children: "Unknown tracking link"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "This code is not attached to a live enrollment."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/marketplace",
						children: "Back to marketplace"
					})
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-dvh bg-forest-deep text-cream",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4 py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { className: "text-cream" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-xs uppercase tracking-[0.2em] text-gold",
					children: "Sandbox hop"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-3xl font-semibold leading-tight",
					children: hop.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-cream/70",
					children: [
						"Click recorded for ",
						hop.vendor,
						". Cookie window ",
						hop.cookieDays,
						" days. Production pixels redirect immediately; this preview stays on DigiAfrika so you can inspect the ledger."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 break-all rounded-[12px] border border-cream/15 bg-ink/40 px-3 py-3 font-mono text-xs",
					children: hop.url
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col gap-2 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "gold",
						className: "flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: hop.url,
							target: "_blank",
							rel: "noreferrer",
							children: ["Open vendor page ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						className: "flex-1 border-cream/30 text-cream hover:bg-cream/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/marketplace",
							children: "Stay on DigiAfrika"
						})
					})]
				})
			]
		})
	});
}
//#endregion
export { TrackHop as component };
