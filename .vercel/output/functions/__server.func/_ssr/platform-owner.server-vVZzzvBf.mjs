import { i as normalizeProductRole } from "./roles-DLM0LukR.mjs";
import { t as env } from "./env.server-wS9zOhV6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/platform-owner.server-vVZzzvBf.js
var ACCESS_DENIED = "Access denied";
/**
* DigiAfrika platform owners — server-only allowlist.
*
* This is not a password, not shown in the UI, and is never read from the
* client. Add the operator's sign-in email (or user id) here, or set
* DIGIAFRIKA_OWNER_EMAILS / DIGIAFRIKA_OWNER_USER_IDS in the deployment
* environment. Signup order does not grant admin.
*/
var PLATFORM_OWNER_EMAILS = ["juliusmatthew44@gmail.com"];
var PLATFORM_OWNER_USER_IDS = [];
function parseOwnerList(raw) {
	if (!raw) return [];
	return raw.split(/[,;\s]+/).map((value) => value.trim().toLowerCase()).filter(Boolean);
}
function normalizeIdentity(value) {
	return (value ?? "").trim().toLowerCase();
}
function configuredOwnerEmails() {
	return [
		...PLATFORM_OWNER_EMAILS.map(normalizeIdentity),
		...parseOwnerList(env("DIGIAFRIKA_OWNER_EMAILS")),
		...parseOwnerList(env("DIGIAFRIKA_OWNER_EMAIL"))
	].filter(Boolean);
}
function configuredOwnerUserIds() {
	return [...PLATFORM_OWNER_USER_IDS.map(normalizeIdentity), ...parseOwnerList(env("DIGIAFRIKA_OWNER_USER_IDS"))];
}
function isConfiguredPlatformOwner(userId, email) {
	if (configuredOwnerUserIds().includes(normalizeIdentity(userId))) return true;
	const normalizedEmail = normalizeIdentity(email);
	return Boolean(normalizedEmail) && configuredOwnerEmails().includes(normalizedEmail);
}
function resolvePlatformOwnerGrant(input) {
	return isConfiguredPlatformOwner(input.userId, input.email);
}
async function syncPlatformOwnerFlag(sql, row) {
	let current = row;
	if (!current.email) try {
		const [authUser] = await sql`
        select email from "user" where id = ${current.user_id} limit 1`;
		if (authUser?.email) {
			await sql`update profiles set email = ${authUser.email} where user_id = ${current.user_id}`;
			current = {
				...current,
				email: authUser.email
			};
		}
	} catch {}
	const shouldBeAdmin = resolvePlatformOwnerGrant({
		userId: current.user_id,
		email: current.email
	});
	const roles = normalizeProductRole(current.roles);
	if (Boolean(current.is_admin) === shouldBeAdmin && current.roles === roles) return {
		...current,
		is_admin: shouldBeAdmin,
		roles
	};
	await sql`
    update profiles
    set is_admin = ${shouldBeAdmin}, roles = ${roles}
    where user_id = ${current.user_id}`;
	return {
		...current,
		is_admin: shouldBeAdmin,
		roles
	};
}
async function assertPlatformAdmin(sql, userId) {
	const [row] = await sql`select * from profiles where user_id = ${userId} limit 1`;
	if (!row) throw new Error(ACCESS_DENIED);
	const synced = await syncPlatformOwnerFlag(sql, row);
	if (!synced.is_admin) throw new Error(ACCESS_DENIED);
	return synced;
}
//#endregion
export { assertPlatformAdmin, syncPlatformOwnerFlag };
