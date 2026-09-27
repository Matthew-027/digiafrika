import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  commissionPayout,
  normalizeMarketplaceQuery,
  productIsMarketplaceLive,
} from "./marketplace.ts";

describe("marketplace visibility", () => {
  it("shows only approved products from approved vendors", () => {
    assert.equal(productIsMarketplaceLive("approved", false, "approved"), true);
    assert.equal(productIsMarketplaceLive("draft", false, "approved"), false);
    assert.equal(productIsMarketplaceLive("pending_review", false, "approved"), false);
    assert.equal(productIsMarketplaceLive("rejected", false, "approved"), false);
    assert.equal(productIsMarketplaceLive("suspended", false, "approved"), false);
    assert.equal(productIsMarketplaceLive("approved", true, "approved"), false);
    assert.equal(productIsMarketplaceLive("approved", false, "suspended"), false);
    assert.equal(productIsMarketplaceLive("approved", false, "pending_review"), false);
    assert.equal(productIsMarketplaceLive("approved", false, null), false);
  });

  it("computes percent and fixed payouts from listed price", () => {
    assert.equal(commissionPayout({ priceAmount: 20, commissionType: "percent", commissionValue: 50 }), 10);
    assert.equal(commissionPayout({ priceAmount: 20, commissionType: "fixed", commissionValue: 8 }), 8);
  });

  it("normalizes search, pagination, and inverted price range", () => {
    const query = normalizeMarketplaceQuery({
      q: "  naira  ",
      category: "All",
      minPrice: 50,
      maxPrice: 10,
      page: 0,
      pageSize: 500,
      sort: "newest",
    });
    assert.equal(query.q, "naira");
    assert.equal(query.category, undefined);
    assert.equal(query.maxPrice, undefined);
    assert.equal(query.page, 1);
    assert.equal(query.pageSize, 50);
  });
});
