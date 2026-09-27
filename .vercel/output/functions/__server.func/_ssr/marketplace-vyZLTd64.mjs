import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as MarketplaceBrowser } from "./marketplace-browser-D1nHuowX.mjs";
import { t as MarketingShell } from "./marketing-shell-Ch1FMIoW.mjs";
import { i as Route$18 } from "./router-9kbAl_o0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/marketplace-vyZLTd64.js
var import_jsx_runtime = require_jsx_runtime();
function Marketplace() {
	const search = Route$18.useSearch();
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketingShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold uppercase tracking-wider text-forest",
				children: "Marketplace"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl font-semibold",
				children: "Approved offers from verified vendors"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-muted",
				children: "Browse live products Affiliates can promote. Draft, pending, rejected, and suspended offers never appear here."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketplaceBrowser, {
					value: search,
					onChange: (next) => void navigate({
						to: "/marketplace",
						search: next
					}),
					tone: "public"
				})
			})
		]
	}) });
}
//#endregion
export { Marketplace as component };
