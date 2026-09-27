import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as cn } from "./utils-CmheKJRZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-BflTX_CK.js
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, tone = "default", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide", tone === "default" && "bg-forest/10 text-forest", tone === "gold" && "bg-gold/20 text-ink", tone === "ok" && "bg-leaf/15 text-forest", tone === "warn" && "bg-gold/30 text-ink", tone === "muted" && "bg-secondary text-muted-foreground", className),
		...props
	});
}
//#endregion
export { Badge as t };
