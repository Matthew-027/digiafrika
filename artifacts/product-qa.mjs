import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

mkdirSync("/workspace/screenshots", { recursive: true });
const origin = "http://127.0.0.1:8080";
const stamp = Date.now();
const password = "TestPass9!";
const storeA = `Vera Store ${stamp}`;
const storeB = `Kofi Lab ${stamp}`;
const productA = `Lagos Launch Kit ${stamp}`;
const productB = `Accra Copy Notes ${stamp}`;
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

async function openCreate(page) {
  await page.getByRole("button", { name: "New product" }).first().click();
}

try {
  const adminCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const admin = await adminCtx.newPage();
  admin.setDefaultTimeout(25000);
  await signup(admin, { name: "Julius Matthew", email: "juliusmatthew44@gmail.com", role: "affiliate" });
  await admin.goto(`${origin}/dashboard/admin`, { waitUntil: "domcontentloaded" });
  await admin.getByRole("heading", { name: /admin dashboard/i }).waitFor({ timeout: 25000 });
  result.checks.adminDesk = true;

  const vendorCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const vendor = await vendorCtx.newPage();
  vendor.setDefaultTimeout(20000);
  await signup(vendor, { name: "Vera Vendor", email: `vera.${stamp}@digiafrika.test`, role: "vendor" });
  await vendor.getByLabel(/business \/ store name/i).waitFor({ timeout: 25000 });
  await vendor.getByLabel(/business \/ store name/i).fill(storeA);
  await vendor.getByLabel(/business description/i).fill(
    "We sell practical digital playbooks for African operators across commerce and finance.",
  );
  await vendor.getByRole("button", { name: /submit application/i }).click();
  await vendor.getByText(/currently under review/i).waitFor({ timeout: 15000 });
  result.checks.vendorPending = true;

  await vendor.goto(`${origin}/dashboard/campaigns`);
  await vendor.getByText(/verification required/i).waitFor({ timeout: 15000 });
  result.checks.unapprovedBlocked = true;
  await vendor.screenshot({ path: "/workspace/screenshots/products-unapproved.png", fullPage: true });

  await admin.goto(`${origin}/dashboard/admin`);
  await admin.getByRole("tab", { name: /vendors/i }).click();
  await admin.getByRole("button", { name: "Pending review" }).click();
  await admin.getByText(storeA).waitFor({ timeout: 15000 });
  await admin.getByRole("row", { name: new RegExp(storeA) }).getByRole("button", { name: /^approve$/i }).click();
  await admin.waitForTimeout(800);

  await vendor.goto(`${origin}/dashboard/vendor`);
  await vendor.getByText(/has been approved/i).waitFor({ timeout: 15000 });
  result.checks.vendorApproved = true;

  await vendor.goto(`${origin}/dashboard/campaigns`);
  await openCreate(vendor);
  await vendor.getByLabel("Product name").fill(productA);
  await vendor.getByLabel("Short description").fill("A practical kit for first-time digital vendors.");
  await vendor.getByLabel("Full description").fill(
    "Modules covering offer design, WhatsApp sales, and a 14-day launch calendar for African sellers.",
  );
  await vendor.getByLabel("Price").fill("20");
  await vendor.getByRole("button", { name: /save draft/i }).click();
  await vendor.getByText(productA).waitFor({ timeout: 15000 });
  await vendor.getByText(/^draft$/i).first().waitFor({ timeout: 10000 });
  result.checks.draft = true;
  await vendor.screenshot({ path: "/workspace/screenshots/products-draft.png", fullPage: true });

  await vendor.getByRole("button", { name: /^edit$/i }).first().click();
  await vendor.getByLabel("Product name").fill(`${productA} Pro`);
  await vendor.getByRole("button", { name: /submit for review/i }).click();
  await vendor.getByText(/pending review/i).waitFor({ timeout: 15000 });
  result.checks.pendingReview = true;
  await vendor.screenshot({ path: "/workspace/screenshots/products-pending.png", fullPage: true });

  await vendor.goto(`${origin}/marketplace`);
  await vendor.waitForTimeout(800);
  result.checks.notPublicWhilePending = !(await vendor.locator("body").innerText()).includes(`${productA} Pro`);

  await admin.goto(`${origin}/dashboard/admin`);
  await admin.getByRole("tab", { name: /products/i }).click();
  await admin.getByRole("button", { name: "Pending review" }).click();
  await admin.getByText(`${productA} Pro`).waitFor({ timeout: 15000 });
  await admin.screenshot({ path: "/workspace/screenshots/products-admin-review.png", fullPage: true });
  await admin.getByRole("row", { name: new RegExp(`${productA} Pro`) }).getByRole("button", { name: /^approve$/i }).click();
  await admin.waitForTimeout(900);

  await vendor.goto(`${origin}/dashboard/campaigns`);
  await vendor.getByText(/^approved$/i).first().waitFor({ timeout: 15000 });
  result.checks.productApproved = true;

  await vendor.goto(`${origin}/marketplace`);
  await vendor.getByText(`${productA} Pro`).waitFor({ timeout: 15000 });
  result.checks.publicAfterApprove = true;
  await vendor.screenshot({ path: "/workspace/screenshots/products-marketplace-approved.png", fullPage: true });

  await vendor.goto(`${origin}/dashboard/campaigns`);
  await openCreate(vendor);
  await vendor.getByLabel("Product name").fill(productB);
  await vendor.getByLabel("Short description").fill("Swipe file of WhatsApp-first sales letters.");
  await vendor.getByLabel("Full description").fill(
    "Forty angles, voice-note closes, and broadcast cadences for Ghanaian and Nigerian sellers.",
  );
  await vendor.getByRole("button", { name: /submit for review/i }).click();
  await vendor.getByText(productB).waitFor({ timeout: 15000 });

  await admin.goto(`${origin}/dashboard/admin`);
  await admin.getByRole("tab", { name: /products/i }).click();
  await admin.getByRole("button", { name: "Pending review" }).click();
  await admin.getByText(productB).waitFor({ timeout: 15000 });
  await admin.locator("#productReason").fill("Need a clearer delivery URL.");
  await admin.getByRole("row", { name: new RegExp(productB) }).getByRole("button", { name: /^reject$/i }).click();
  await admin.waitForTimeout(900);

  await vendor.goto(`${origin}/dashboard/campaigns`);
  await vendor.getByText(/need a clearer delivery url/i).waitFor({ timeout: 15000 });
  result.checks.rejectedReason = true;
  await vendor.getByRole("button", { name: /^edit$/i }).first().click();
  await vendor.getByLabel("Product URL / delivery info (optional)").fill("https://example.com/accra-copy");
  await vendor.getByRole("button", { name: /resubmit for review/i }).click();
  await vendor.getByText(/pending review/i).waitFor({ timeout: 15000 });
  result.checks.resubmitted = true;

  await admin.goto(`${origin}/dashboard/admin`);
  await admin.getByRole("tab", { name: /products/i }).click();
  await admin.getByRole("button", { name: "Approved" }).click();
  await admin.getByRole("row", { name: new RegExp(`${productA} Pro`) }).getByRole("button", { name: /^suspend$/i }).click();
  await admin.waitForTimeout(800);

  await vendor.goto(`${origin}/marketplace`);
  await vendor.waitForTimeout(900);
  result.checks.suspendedHidden = !(await vendor.locator("body").innerText()).includes(`${productA} Pro`);
  await vendor.screenshot({ path: "/workspace/screenshots/products-marketplace-suspended.png", fullPage: true });

  const otherCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const other = await otherCtx.newPage();
  other.setDefaultTimeout(20000);
  await signup(other, { name: "Kofi Vendor", email: `kofi.${stamp}@digiafrika.test`, role: "vendor" });
  await other.getByLabel(/business \/ store name/i).waitFor({ timeout: 25000 });
  await other.getByLabel(/business \/ store name/i).fill(storeB);
  await other.getByLabel(/business description/i).fill(
    "Software tools for aggregators and last-mile agro dealers across West Africa.",
  );
  await other.getByRole("button", { name: /submit application/i }).click();
  await other.getByText(/currently under review/i).waitFor({ timeout: 15000 });
  await admin.goto(`${origin}/dashboard/admin`);
  await admin.getByRole("tab", { name: /vendors/i }).click();
  await admin.getByRole("button", { name: "Pending review" }).click();
  await admin.getByText(storeB).waitFor({ timeout: 15000 });
  await admin.getByRole("row", { name: new RegExp(storeB) }).getByRole("button", { name: /^approve$/i }).click();
  await other.goto(`${origin}/dashboard/campaigns`);
  await other.getByRole("button", { name: "New product" }).first().waitFor({ timeout: 15000 });
  const otherText = await other.locator("body").innerText();
  result.checks.otherCannotSeeVera = !otherText.includes(productA) && !otherText.includes(productB);
  await other.screenshot({ path: "/workspace/screenshots/products-vendor-b.png", fullPage: true });

  const affCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const aff = await affCtx.newPage();
  aff.setDefaultTimeout(20000);
  await signup(aff, { name: "Amina Affiliate", email: `amina.${stamp}@digiafrika.test`, role: "affiliate" });
  await aff.goto(`${origin}/dashboard/campaigns`);
  await aff.waitForTimeout(800);
  result.checks.affiliateDenied = /access denied/i.test(await aff.locator("body").innerText());
  await aff.screenshot({ path: "/workspace/screenshots/products-affiliate-denied.png", fullPage: true });
} catch (err) {
  result.errors.push(String(err));
} finally {
  await browser.close();
}

console.log(JSON.stringify(result, null, 2));
