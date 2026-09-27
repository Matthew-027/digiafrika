import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { deskRoleOf, normalizeProductRole, productRoleOf } from "./roles.ts";

describe("account desks", () => {
  it("treats admin as its own desk, not vendor or affiliate", () => {
    assert.equal(deskRoleOf(true, "affiliate"), "admin");
    assert.equal(deskRoleOf(true, "vendor"), "admin");
    assert.equal(deskRoleOf(true, "affiliate,vendor,admin"), "admin");
  });

  it("maps a product role for non-admins", () => {
    assert.equal(deskRoleOf(false, "affiliate"), "affiliate");
    assert.equal(deskRoleOf(false, "vendor"), "vendor");
    assert.equal(deskRoleOf(false, "affiliate,vendor"), "vendor");
  });

  it("stores a single product role, never admin", () => {
    assert.equal(normalizeProductRole("vendor"), "vendor");
    assert.equal(normalizeProductRole(["affiliate"]), "affiliate");
    assert.equal(normalizeProductRole("admin"), "affiliate");
    assert.equal(normalizeProductRole(["admin", "vendor"]), "vendor");
  });
});
