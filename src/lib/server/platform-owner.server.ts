import type { Sql } from "../db.ts";
import { env } from "../env.server.ts";
import { normalizeProductRole } from "../roles.ts";

export const ACCESS_DENIED = "Access denied";

/**
 * DigiAfrika platform owners — server-only allowlist.
 *
 * This is not a password, not shown in the UI, and is never read from the
 * client. Add the operator's sign-in email (or user id) here, or set
 * DIGIAFRIKA_OWNER_EMAILS / DIGIAFRIKA_OWNER_USER_IDS in the deployment
 * environment. Signup order does not grant admin.
 */
export const PLATFORM_OWNER_EMAILS: string[] = [
  "juliusmatthew44@gmail.com",
];

export const PLATFORM_OWNER_USER_IDS: string[] = [];

type ProfileAdminRow = {
  user_id: string;
  email: string | null;
  is_admin: boolean;
  roles: string;
};

export function parseOwnerList(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/[,;\s]+/)
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function normalizeIdentity(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

export function configuredOwnerEmails(): string[] {
  return [
    ...PLATFORM_OWNER_EMAILS.map(normalizeIdentity),
    ...parseOwnerList(env("DIGIAFRIKA_OWNER_EMAILS")),
    ...parseOwnerList(env("DIGIAFRIKA_OWNER_EMAIL")),
  ].filter(Boolean);
}

export function configuredOwnerUserIds(): string[] {
  return [...PLATFORM_OWNER_USER_IDS.map(normalizeIdentity), ...parseOwnerList(env("DIGIAFRIKA_OWNER_USER_IDS"))];
}

export function isConfiguredPlatformOwner(
  userId: string,
  email: string | null | undefined,
): boolean {
  const ids = configuredOwnerUserIds();
  if (ids.includes(normalizeIdentity(userId))) return true;
  const normalizedEmail = normalizeIdentity(email);
  return Boolean(normalizedEmail) && configuredOwnerEmails().includes(normalizedEmail);
}

export function resolvePlatformOwnerGrant(input: {
  userId: string;
  email: string | null | undefined;
}): boolean {
  return isConfiguredPlatformOwner(input.userId, input.email);
}

export async function syncPlatformOwnerFlag<T extends ProfileAdminRow>(sql: Sql, row: T): Promise<T> {
  let current = row;
  if (!current.email) {
    try {
      const [authUser] = await sql<{ email: string | null }>`
        select email from "user" where id = ${current.user_id} limit 1`;
      if (authUser?.email) {
        await sql`update profiles set email = ${authUser.email} where user_id = ${current.user_id}`;
        current = { ...current, email: authUser.email };
      }
    } catch {
      /* auth identity table may be unavailable during isolated tests */
    }
  }
  const shouldBeAdmin = resolvePlatformOwnerGrant({
    userId: current.user_id,
    email: current.email,
  });
  const roles = normalizeProductRole(current.roles);
  if (Boolean(current.is_admin) === shouldBeAdmin && current.roles === roles) {
    return { ...current, is_admin: shouldBeAdmin, roles };
  }
  await sql`
    update profiles
    set is_admin = ${shouldBeAdmin}, roles = ${roles}
    where user_id = ${current.user_id}`;
  return { ...current, is_admin: shouldBeAdmin, roles };
}

export async function assertPlatformAdmin<T extends ProfileAdminRow>(sql: Sql, userId: string): Promise<T> {
  const [row] = await sql<T>`select * from profiles where user_id = ${userId} limit 1`;
  if (!row) throw new Error(ACCESS_DENIED);
  const synced = await syncPlatformOwnerFlag(sql, row);
  if (!synced.is_admin) throw new Error(ACCESS_DENIED);
  return synced;
}
