import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

mkdirSync("/workspace/screenshots", { recursive: true });
const origin = "http://127.0.0.1:8080";
const stamp = Date.now();
const password = "TestPass9!";
const store = `Market Store ${stamp}`;
const product = `Market Kit ${stamp}`;
const result = { errors: [], checks: {} };

const browser = await chromium.launch({ args: ["--no-sandbox"] });

async function completeOnboarding(page, role) {
  try {
    await page.getByText(/choose your desk/i).waitFor({ timeout: 8000 });
  } catch {
    return;
  }
  if (role === "vendor") {
    await page.getByRole("button", { name: /i want to sell products/i }).click();
    await page.getByRole("button", { name: /enter vendor desk/i }).click();
  } else {
    await page.getByRole("button", { name: /i want to promote products/i }).click();
    await page.getByRole("button", { name: /enter affiliate desk/i }).click();
  }
}

async function signup(page, { name, email, role }) {
  await page.goto(`${origin}/login`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /join free/i }).click();
  await page.locator("#name").waitFor();
  await page.locator("#name").fill(name);
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: /create account/i }).click();
  try {
    await completeOnboarding(page, role);
    await page.waitForURL(/\/dashboard/, { timeout: 20000 });
  } catch {
    await page.goto(`${origin}/login`, { waitUntil: "domcontentloaded" });
    await page.locator("#email").fill(email);
    await page.locator("#password").fill(password);
    await page.getByRole("button", { name: /sign in/i }).click();
    await completeOnboarding(page, role);
    await page.waitForURL(/\/dashboard/, { timeout: 25000 }).catch(() => {});
  }
}

async function fillProduct(page, name) {
  await page.getByRole("button", { name: "New product" }).first().click();
  await page.getByLabel("Product name").fill(name);
  await page.getByLabel("Short description").fill("A practical kit for first-time digital vendors.");
  await page.getByLabel("Full description").fill(
    "Modules covering offer design, WhatsApp sales, and a 14-day launch calendar for African sellers.",
  );
  await page.getByLabel("Price").fill("20");
}

try {
  const adminCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const admin = await adminCtx.newPage();
  admin.setDefaultTimeout(25000);
  await signup(admin, { name: "Julius Matthew", email: "juliusmatthew44@gmail.com", role: "affiliate" });
  await admin.goto(`${origin}/dashboard/admin`);
  await admin.getByRole("heading", { name: /admin dashboard/i }).waitFor();

  const vendorCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const vendor = await vendorCtx.newPage();
  vendor.setDefaultTimeout(25000);
  await signup(vendor, { name: "Vera Vendor", email: `mkt.vera.${stamp}@digiafrika.test`, role: "vendor" });
  await vendor.getByLabel(/business \/ store name/i).fill(store);
  await vendor.getByLabel(/business description/i).fill(
    "We sell practical digital playbooks for African operators across commerce and finance.",
  );
  await vendor.getByRole("button", { name: /submit application/i }).click();
  await vendor.getByText(/currently under review/i).waitFor();

  await admin.goto(`${origin}/dashboard/admin`);
  await admin.getByRole("tab", { name: /vendors/i }).click();
  await admin.getByRole("button", { name: "Pending review" }).click();
  await admin.getByRole("row", { name: new RegExp(store) }).getByRole("button", { name: /^approve$/i }).click();
  await vendor.goto(`${origin}/dashboard/vendor`);
  await vendor.getByText(/has been approved/i).waitFor();

  await vendor.goto(`${origin}/dashboard/campaigns`);
  await fillProduct(vendor, product);
  await vendor.getByRole("button", { name: /save draft/i }).click();
  await vendor.getByText(/^draft$/i).first().waitFor();

  await vendor.goto(`${origin}/marketplace`);
  await vendor.waitForTimeout(900);
  result.checks.draftHidden = !(await vendor.locator("body").innerText()).includes(product);
  await vendor.screenshot({ path: "/workspace/screenshots/market-draft-hidden.png", fullPage: true });

  const slugGuess = product.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  await vendor.goto(`${origin}/offers/${slugGuess}`);
  await vendor.waitForTimeout(700);
  result.checks.draftSlugDenied = /not available|not found/i.test(await vendor.locator("body").innerText());

  await vendor.goto(`${origin}/dashboard/campaigns`);
  await vendor.getByRole("button", { name: /^edit$/i }).first().click();
  await vendor.getByRole("button", { name: /submit for review/i }).click();
  await vendor.getByText(/pending review/i).waitFor();
  await vendor.goto(`${origin}/marketplace`);
  await vendor.waitForTimeout(800);
  result.checks.pendingHidden = !(await vendor.locator("body").innerText()).includes(product);

  await admin.goto(`${origin}/dashboard/admin`);
  await admin.getByRole("tab", { name: /products/i }).click();
  await admin.getByRole("button", { name: "Pending review" }).click();
  await admin.getByRole("row", { name: new RegExp(product) }).getByRole("button", { name: /^approve$/i }).click();
  await admin.waitForTimeout(800);

  await vendor.goto(`${origin}/marketplace`);
  await vendor.getByText(product).waitFor({ timeout: 15000 });
  result.checks.approvedVisible = true;
  await vendor.screenshot({ path: "/workspace/screenshots/market-approved.png", fullPage: true });

  await vendor.getByPlaceholder(/search name/i).fill(product);
  await vendor.getByPlaceholder(/search name/i).press("Enter");
  await vendor.getByText(product).waitFor();
  result.checks.searchName = true;

  await vendor.goto(`${origin}/marketplace?q=WhatsApp`);
  await vendor.waitForTimeout(900);
  result.checks.searchDescription = (await vendor.locator("body").innerText()).includes(product);

  await vendor.goto(`${origin}/marketplace?category=Commerce`);
  await vendor.waitForTimeout(900);
  result.checks.searchCategory = (await vendor.locator("body").innerText()).includes(product);

  await vendor.click(`text=${product}`);
  await vendor.getByRole("heading", { name: product }).waitFor();
  await vendor.getByText(/vendors list products from the vendor desk/i).waitFor({ timeout: 10000 });
  result.checks.details = /affiliate terms|commission/i.test(await vendor.locator("body").innerText());
  result.checks.noPrivateVendor = !/gmail|phone|bv n|review note/i.test(await vendor.locator("body").innerText());
  result.checks.vendorNoAffiliateAction = /vendor desk/i.test(await vendor.locator("body").innerText());
  await vendor.screenshot({ path: "/workspace/screenshots/market-details-vendor.png", fullPage: true });

  await vendor.goto(`${origin}/dashboard/offers`);
  await vendor.waitForTimeout(700);
  result.checks.vendorDeskDenied = /access denied/i.test(await vendor.locator("body").innerText());

  await admin.goto(`${origin}/dashboard/admin`);
  await admin.getByRole("tab", { name: /products/i }).click();
  await admin.getByRole("button", { name: "Approved" }).click();
  await admin.getByRole("row", { name: new RegExp(product) }).getByRole("button", { name: /^suspend$/i }).click();
  await admin.waitForTimeout(800);
  await vendor.goto(`${origin}/marketplace`);
  await vendor.waitForTimeout(900);
  result.checks.suspendedHidden = !(await vendor.locator("body").innerText()).includes(product);

  await admin.goto(`${origin}/dashboard/admin`);
  await admin.getByRole("tab", { name: /products/i }).click();
  await admin.getByRole("button", { name: "Suspended" }).click();
  await admin.getByRole("row", { name: new RegExp(product) }).getByRole("button", { name: /^approve$/i }).click();
  await admin.waitForTimeout(700);
  await admin.getByRole("tab", { name: /vendors/i }).click();
  await admin.getByRole("button", { name: "Approved" }).click();
  await admin.getByRole("row", { name: new RegExp(store) }).getByRole("button", { name: /^suspend$/i }).click();
  await admin.waitForTimeout(800);
  await vendor.goto(`${origin}/marketplace`);
  await vendor.waitForTimeout(900);
  result.checks.suspendedVendorHidden = !(await vendor.locator("body").innerText()).includes(product);
  await vendor.screenshot({ path: "/workspace/screenshots/market-vendor-suspended.png", fullPage: true });

  const affCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const aff = await affCtx.newPage();
  aff.setDefaultTimeout(25000);
  await signup(aff, { name: "Amina Affiliate", email: `mkt.aff.${stamp}@digiafrika.test`, role: "affiliate" });
  await aff.goto(`${origin}/dashboard/offers`);
  await aff.getByRole("heading", { name: /offers to promote/i }).waitFor();
  result.checks.affiliateMarketplace = true;
  await aff.screenshot({ path: "/workspace/screenshots/market-affiliate-desk.png", fullPage: true });
  await aff.goto(`${origin}/dashboard/admin`);
  await aff.waitForTimeout(700);
  result.checks.affiliateAdminDenied = /access denied/i.test(await aff.locator("body").innerText());
} catch (err) {
  result.errors.push(String(err));
} finally {
  await browser.close();
}

console.log(JSON.stringify(result, null, 2));
