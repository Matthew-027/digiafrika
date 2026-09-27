import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyVendorReview,
  vendorCanEdit,
  vendorCanPublish,
  vendorCanSubmit,
} from "./vendor.ts";

describe("vendor verification", () => {
  it("does not treat role selection as approval", () => {
    assert.equal(vendorCanPublish("incomplete"), false);
    assert.equal(vendorCanPublish("pending_review"), false);
    assert.equal(vendorCanPublish("rejected"), false);
    assert.equal(vendorCanPublish("suspended"), false);
    assert.equal(vendorCanPublish("approved"), true);
  });

  it("lets incomplete and rejected vendors edit and resubmit", () => {
    assert.equal(vendorCanEdit("incomplete"), true);
    assert.equal(vendorCanSubmit("incomplete"), true);
    assert.equal(vendorCanEdit("rejected"), true);
    assert.equal(vendorCanSubmit("rejected"), true);
    assert.equal(vendorCanSubmit("pending_review"), false);
    assert.equal(vendorCanSubmit("approved"), false);
  });

  it("blocks suspended vendors from editing or publishing", () => {
    assert.equal(vendorCanEdit("suspended"), false);
    assert.equal(vendorCanSubmit("suspended"), false);
    assert.equal(vendorCanPublish("suspended"), false);
  });

  it("applies admin review transitions only from legal statuses", () => {
    assert.equal(applyVendorReview("pending_review", "approve"), "approved");
    assert.equal(applyVendorReview("pending_review", "reject"), "rejected");
    assert.equal(applyVendorReview("approved", "suspend"), "suspended");
    assert.equal(applyVendorReview("suspended", "approve"), "approved");
    assert.throws(() => applyVendorReview("incomplete", "approve"));
    assert.throws(() => applyVendorReview("approved", "reject"));
    assert.throws(() => applyVendorReview("pending_review", "suspend"));
  });
});
