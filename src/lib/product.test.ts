import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyProductReview,
  productCanEdit,
  productCanSubmit,
  productIsPublic,
  validateCommission,
} from "./product.ts";

describe("product lifecycle", () => {
  it("starts as draft and is not public until approved", () => {
    assert.equal(productIsPublic("draft"), false);
    assert.equal(productIsPublic("pending_review"), false);
    assert.equal(productIsPublic("rejected"), false);
    assert.equal(productIsPublic("suspended"), false);
    assert.equal(productIsPublic("approved"), true);
    assert.equal(productIsPublic("approved", true), false);
  });

  it("lets vendors edit and resubmit only drafts and rejected products", () => {
    assert.equal(productCanEdit("draft"), true);
    assert.equal(productCanSubmit("draft"), true);
    assert.equal(productCanEdit("rejected"), true);
    assert.equal(productCanSubmit("rejected"), true);
    assert.equal(productCanEdit("pending_review"), false);
    assert.equal(productCanSubmit("approved"), false);
    assert.equal(productCanEdit("suspended"), false);
  });

  it("does not let a vendor self-approve", () => {
    assert.throws(() => applyProductReview("draft", "approve"));
    assert.equal(applyProductReview("pending_review", "approve"), "approved");
    assert.equal(applyProductReview("pending_review", "reject"), "rejected");
    assert.equal(applyProductReview("approved", "suspend"), "suspended");
  });

  it("validates percent and fixed commissions", () => {
    assert.equal(validateCommission("percent", 50), null);
    assert.equal(validateCommission("percent", 101), "Percentage commission cannot be above 100%");
    assert.equal(validateCommission("fixed", -1), "Commission cannot be negative");
    assert.equal(validateCommission("fixed", 8), null);
  });
});
