import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as DESK_HOME } from "./roles-DLM0LukR.mjs";
import { n as useDash } from "./dash-context-B75R4djK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.index-BPbmuY_N.js
var import_jsx_runtime = require_jsx_runtime();
function Overview() {
	const { data } = useDash();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: DESK_HOME[data.profile.deskRole] });
}
//#endregion
export { Overview as component };
