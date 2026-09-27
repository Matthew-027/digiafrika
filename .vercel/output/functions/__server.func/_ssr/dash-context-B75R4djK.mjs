import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useCurrentUserState } from "./use-current-user-DG6UNzh9.mjs";
import { t as RedirectToSignIn } from "./gates-B9YfLDZP.mjs";
import { f as getDashboard } from "./router-9kbAl_o0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dash-context-B75R4djK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DashCtx = (0, import_react.createContext)(null);
function useDash() {
	const ctx = (0, import_react.useContext)(DashCtx);
	if (!ctx) throw new Error("useDash must be used in the dashboard");
	return ctx;
}
function DashboardGate({ children }) {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const reload = (0, import_react.useCallback)(async () => {
		const next = await getDashboard();
		if (next.profile) setData(next);
	}, []);
	(0, import_react.useEffect)(() => {
		if (isPending || !user) return;
		let cancelled = false;
		getDashboard().then((next) => {
			if (cancelled) return;
			if (!next.profile) {
				navigate({ to: "/onboarding" });
				return;
			}
			setData(next);
		}).catch((err) => {
			if (!cancelled) setError(err.message);
		});
		return () => {
			cancelled = true;
		};
	}, [
		isPending,
		user,
		navigate
	]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "dash-shell grid min-h-dvh place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 w-48 animate-pulse rounded-xl bg-secondary" })
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "dash-shell grid min-h-dvh place-items-center p-6 text-sm",
		children: error
	});
	if (!data?.profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "dash-shell grid min-h-dvh place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 w-48 animate-pulse rounded-xl bg-secondary" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashCtx.Provider, {
		value: {
			data,
			reload
		},
		children
	});
}
//#endregion
export { useDash as n, DashboardGate as t };
