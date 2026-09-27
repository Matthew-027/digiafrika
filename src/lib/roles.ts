export type ProductRole = "affiliate" | "vendor";
export type DeskRole = "admin" | ProductRole;

export function productRoleOf(roles: string | string[] | null | undefined): ProductRole {
  const list = Array.isArray(roles) ? roles : String(roles ?? "").split(",");
  return list.map((role) => role.trim()).includes("vendor") ? "vendor" : "affiliate";
}

export function deskRoleOf(isAdmin: boolean, roles: string | string[] | null | undefined): DeskRole {
  if (isAdmin) return "admin";
  return productRoleOf(roles);
}

export function normalizeProductRole(roles: string | string[] | null | undefined): ProductRole {
  return productRoleOf(roles);
}

export const DESK_HOME = {
  admin: "/dashboard/admin",
  vendor: "/dashboard/vendor",
  affiliate: "/dashboard/affiliate",
} as const;

export const DESK_LABEL = {
  admin: "Admin Dashboard",
  vendor: "Vendor Dashboard",
  affiliate: "Affiliate Dashboard",
} as const;
