/**
 * Functional end-to-end checks against a running server.
 *   PORT=3001 npx tsx scripts/e2e.mts
 */
import { chromium, type Page } from "playwright";

const base = `http://localhost:${process.env.PORT ?? 3001}`;
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
let pass = 0;
let fail = 0;
async function t(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    pass++;
    console.log("✓", name);
  } catch (e) {
    fail++;
    console.log("✗", name, "—", String(e).split("\n")[0]);
  }
}
const expect = (c: unknown, msg: string) => {
  if (!c) throw new Error(msg);
};
const bagCount = (p: Page) => p.evaluate(() => JSON.parse(localStorage.getItem("taarokh.bag.v1") ?? "[]").reduce((n: number, l: { quantity: number }) => n + l.quantity, 0));

const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

await t("PDP: add without width shows required-width message", async () => {
  await page.goto(`${base}/products/sanganer-indigo`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Add to preview bag" }).click();
  await page.getByText("Choose your lug width before adding to bag.").waitFor({ timeout: 3000 });
});

await t("PDP: planned width (18 mm) cannot be selected", async () => {
  const r18 = page.getByRole("radio", { name: /^18 mm/ });
  expect((await r18.getAttribute("aria-disabled")) === "true", "18mm not aria-disabled");
  await r18.click({ force: true });
  expect((await r18.getAttribute("aria-checked")) === "false", "18mm got selected");
  await page.getByText(/is a planned width/i).waitFor({ timeout: 3000 });
});

await t("PDP: select 20 mm, add 2 → drawer opens with 2 items", async () => {
  await page.getByRole("radio", { name: /^20 mm/ }).click();
  await page.getByRole("button", { name: "Increase quantity" }).click();
  await page.getByRole("button", { name: "Add to preview bag" }).click();
  await page.getByRole("dialog", { name: /bag/i }).waitFor({ timeout: 3000 });
  expect((await bagCount(page)) === 2, `bag count ${await bagCount(page)}`);
});

await t("Bag: quantity capped at 5 per order", async () => {
  const dlg = page.getByRole("dialog", { name: /bag/i });
  for (let i = 0; i < 6; i++) {
    const btn = dlg.getByRole("button", { name: "Increase quantity" });
    if (await btn.isDisabled()) break;
    await btn.click();
  }
  expect((await bagCount(page)) === 5, `count ${await bagCount(page)}`);
  expect(await dlg.getByRole("button", { name: "Increase quantity" }).isDisabled(), "increase not disabled at max");
});

await t("Bag: preview mode shows no checkout, honest notice", async () => {
  const dlg = page.getByRole("dialog", { name: /bag/i });
  await dlg.getByText("Orders are not open yet", { exact: false }).waitFor({ timeout: 2000 });
  expect((await dlg.getByRole("button", { name: /secure checkout/i }).count()) === 0, "checkout button present in preview");
});

await t("Bag: Escape closes the drawer", async () => {
  await page.keyboard.press("Escape");
  await page.getByRole("dialog", { name: /bag/i }).waitFor({ state: "detached", timeout: 3000 });
});

await t("Bag persists across reload and navigation", async () => {
  await page.goto(`${base}/journal`, { waitUntil: "networkidle" });
  await page.reload({ waitUntil: "networkidle" });
  const label = await page.getByRole("button", { name: /Open bag/ }).getAttribute("aria-label");
  expect(label?.includes("5 items"), `label ${label}`);
});

await t("Bag: tampered localStorage is sanitised", async () => {
  await page.evaluate(() => localStorage.setItem("taarokh.bag.v1", JSON.stringify([{ variantId: "TAR-SAN-IND-20", quantity: 999 }, { variantId: "TAR-SAN-IND-18", quantity: 1 }, { variantId: "nope", quantity: 1 }])));
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  expect((await bagCount(page)) === 5, `count ${await bagCount(page)}`);
});

await t("Bag: remove item → empty state", async () => {
  await page.getByRole("button", { name: /Open bag/ }).click();
  await page.getByRole("button", { name: /Remove/ }).first().click();
  await page.getByText("Your collection starts here.").waitFor({ timeout: 3000 });
  await page.keyboard.press("Escape");
});

await t("Checkout API refuses in preview mode (no fake success)", async () => {
  const res = await page.request.post(`${base}/api/checkout`, { data: { lines: [{ variantId: "TAR-SAN-IND-20", quantity: 1 }] } });
  expect(res.status() === 503, `status ${res.status()}`);
});

await t("Checkout API rejects malformed payload", async () => {
  const res = await page.request.post(`${base}/api/checkout`, { data: { lines: "x" } });
  expect(res.status() === 400, `status ${res.status()}`);
});

await t("Shop: collection filter + empty state + clear", async () => {
  await page.goto(`${base}/shop`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /^Filter/ }).click();
  const dlg = page.getByRole("dialog", { name: "Filters" });
  await dlg.getByRole("button", { name: "Bagru", exact: true }).click();
  await page.waitForTimeout(400);
  expect(page.url().includes("collection=bagru"), "url not updated");
  await dlg.getByRole("button", { name: /Show 2 straps/ }).click();
  await page.waitForTimeout(1200);
  expect((await page.locator("main article:visible").count()) === 2, `cards ${await page.locator("main article:visible").count()}`);
  await page.goto(`${base}/shop?availability=available`, { waitUntil: "networkidle" });
  await page.getByText("No straps match these filters.").waitFor({ timeout: 3000 });
  await page.getByRole("button", { name: "Clear filters" }).click();
  await page.waitForTimeout(500);
  expect((await page.locator("main article:visible").count()) === 7, "clear failed");
});

await t("Shop: sort by price high→low puts ₹1,499 first", async () => {
  await page.goto(`${base}/shop?sort=price-desc`, { waitUntil: "networkidle" });
  const first = await page.locator("main article h3").first().innerText();
  expect(first.includes("Jharokha") || first.includes("Courtyard"), `first ${first}`);
});

await t("Gallery: thumbnail switches image, lightbox opens & closes", async () => {
  await page.goto(`${base}/products/bagru-earth`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Show image 3 of 4" }).click();
  await page.getByText("03 / 04").waitFor({ timeout: 2000 });
  await page.locator(".cursor-zoom-in").click();
  await page.getByRole("dialog", { name: /enlarged image/ }).waitFor({ timeout: 2000 });
  await page.keyboard.press("Escape");
  await page.getByRole("dialog", { name: /enlarged image/ }).waitFor({ state: "detached", timeout: 2000 });
});

await t("Newsletter: invalid email → inline error", async () => {
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  const form = page.locator("#newsletter");
  await form.getByLabel("Email address").fill("not-an-email");
  await form.getByRole("button", { name: "Subscribe" }).click();
  await form.getByText("Please enter a valid email address.").waitFor({ timeout: 2000 });
});

await t("Newsletter: no provider → honest 'nothing was saved', never success", async () => {
  const form = page.locator("#newsletter");
  await form.getByLabel("Email address").fill("reader@example.com");
  await form.getByRole("checkbox").check();
  await form.getByRole("button", { name: "Subscribe" }).click();
  await form.getByText(/nothing was saved/i).waitFor({ timeout: 4000 });
  expect((await form.getByText("You’re on the list.").count()) === 0, "false success shown");
});

await t("Contact: validation errors shown and focus moves", async () => {
  await page.goto(`${base}/contact`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Send message" }).click();
  await page.getByText("Please enter your name.").waitFor({ timeout: 2000 });
  await page.getByText("Please choose a topic.").waitFor({ timeout: 2000 });
});

await t("Contact: valid submission without inbox → honest not-sent message", async () => {
  await page.getByLabel("Name", { exact: true }).fill("Asha Test");
  await page.getByLabel("Email", { exact: true }).fill("asha@example.com");
  await page.getByText("Size & fit help").click();
  await page.getByLabel("Message", { exact: true }).fill("What width is my watch? It measures 20 mm I think.");
  await page.locator("main form").getByRole("checkbox").check();
  await page.waitForTimeout(2600);
  await page.getByRole("button", { name: "Send message" }).click();
  await page.getByText(/was not sent/i).waitFor({ timeout: 4000 });
});

await t("Size assistant: 20 → supported; 19 → not in range", async () => {
  await page.goto(`${base}/size-guide`, { waitUntil: "networkidle" });
  const lug = page.getByLabel("Your measurement between the lugs");
  await lug.fill("20");
  await lug.press("Enter");
  await page.getByText("20 mm — this is a width we design for.").waitFor({ timeout: 2000 });
  await lug.fill("19");
  await lug.press("Enter");
  await page.getByText(/19 mm — not currently in our range/).waitFor({ timeout: 2000 });
});

await t("Search overlay finds 'Bagru' and navigates", async () => {
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await page.getByLabel("Search straps, journal and guides").fill("bagru earth");
  await page.getByRole("dialog", { name: "Search" }).getByRole("link", { name: /Bagru Earth/ }).first().click();
  await page.waitForURL(/bagru-earth/, { timeout: 5000 });
});

await t("Strap selector updates preview and requires width", async () => {
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  const sec = page.locator("section", { has: page.getByText("Try it on.") });
  await sec.getByRole("button", { name: "Jharokha Noir" }).click();
  await sec.getByText("Noir Arcade").first().waitFor({ timeout: 2000 });
  await sec.getByRole("button", { name: "Add to bag" }).click();
  await sec.getByText("Choose your lug width before adding to bag.").waitFor({ timeout: 2000 });
  await sec.getByRole("button", { name: /^20 mm/ }).click();
  await sec.getByRole("button", { name: "Add to bag" }).click();
  await page.getByRole("dialog", { name: /bag/i }).waitFor({ timeout: 3000 });
  await page.keyboard.press("Escape");
});

const m = await b.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
const mp = await m.newPage();
await t("Mobile menu opens, navigates, closes", async () => {
  await mp.goto(`${base}/`, { waitUntil: "networkidle" });
  await mp.getByRole("button", { name: "Open menu" }).click();
  await mp.getByRole("dialog", { name: "Menu" }).getByRole("link", { name: /The Craft/ }).click();
  await mp.waitForURL(/the-craft/, { timeout: 5000 });
  await mp.getByRole("dialog", { name: "Menu" }).waitFor({ state: "detached", timeout: 3000 });
});

await t("Keyboard: skip link is first focusable", async () => {
  await page.goto(`${base}/shop`, { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const txt = await page.evaluate(() => document.activeElement?.textContent);
  expect(txt?.includes("Skip to content"), `focused ${txt}`);
});

await t("robots.txt, sitemap.xml and 404 respond correctly", async () => {
  expect((await page.request.get(`${base}/robots.txt`)).ok(), "robots");
  const sm = await page.request.get(`${base}/sitemap.xml`);
  expect(sm.ok() && (await sm.text()).includes("/products/sanganer-indigo"), "sitemap");
  expect((await page.request.get(`${base}/nope`)).status() === 404, "404");
});

console.log(`\n${pass} passed, ${fail} failed`);
await b.close();
process.exit(fail ? 1 : 0);
