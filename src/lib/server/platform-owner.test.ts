import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isConfiguredPlatformOwner,
  normalizeIdentity,
  parseOwnerList,
  PLATFORM_OWNER_EMAILS,
  resolvePlatformOwnerGrant,
} from "./platform-owner.server.ts";

describe("platform owner allowlist", () => {
  it("parses comma, semicolon, and whitespace lists", () => {
    assert.deepEqual(parseOwnerList("Ada@X.com, bo@y.com"), ["ada@x.com", "bo@y.com"]);
    assert.deepEqual(parseOwnerList("ada@x.com; bo@y.com\ncy@z.com"), [
      "ada@x.com",
      "bo@y.com",
      "cy@z.com",
    ]);
    assert.deepEqual(parseOwnerList("  "), []);
    assert.deepEqual(parseOwnerList(undefined), []);
  });

  it("normalizes identity case and trim", () => {
    assert.equal(normalizeIdentity("  Owner@DigiAfrika.africa "), "owner@digiafrika.africa");
    assert.equal(normalizeIdentity(null), "");
  });

  it("grants admin only to the configured owner email", () => {
    assert.deepEqual(PLATFORM_OWNER_EMAILS, ["juliusmatthew44@gmail.com"]);
    assert.equal(isConfiguredPlatformOwner("anyone", "juliusmatthew44@gmail.com"), true);
    assert.equal(isConfiguredPlatformOwner("anyone", "JuliusMatthew44@Gmail.com"), true);
    assert.equal(isConfiguredPlatformOwner("anyone", "anyone@example.com"), false);
    assert.equal(isConfiguredPlatformOwner("anyone", null), false);
  });

  it("does not grant admin to affiliates, vendors, or first signup", () => {
    assert.equal(resolvePlatformOwnerGrant({ userId: "first-user", email: "first@example.com" }), false);
    assert.equal(resolvePlatformOwnerGrant({ userId: "aff-1", email: "affiliate@example.com" }), false);
    assert.equal(resolvePlatformOwnerGrant({ userId: "vendor-1", email: "vendor@example.com" }), false);
    assert.equal(resolvePlatformOwnerGrant({ userId: "other-google", email: "other@gmail.com" }), false);
  });

  it("grants admin when the Google sign-in email is the owner", () => {
    assert.equal(
      resolvePlatformOwnerGrant({ userId: "google-sub", email: "juliusmatthew44@gmail.com" }),
      true,
    );
  });
});
