/**
 * QA sweep: every route × widths → horizontal overflow, console errors,
 * failed requests, broken images and visible <h1> count.
 *   PORT=3001 WIDTHS=320,390,1440 npx tsx scripts/qa.mts
 */
import { chromium } from "playwright";

const base = `http://localhost:${process.env.PORT ?? 3001}`;
const routes = [
  "/", "/shop", "/collections", "/collections/sanganer", "/collections/jharokha",
  "/products/sanganer-indigo", "/products/jharokha-noir", "/our-story", "/the-craft",
  "/journal", "/journal/the-art-of-sanganeri-printing", "/journal/category/style",
  "/size-guide", "/contact", "/cart", "/checkout", "/search?q=indigo", "/faq", "/care",
  "/shipping", "/returns", "/privacy", "/terms", "/does-not-exist",
];
const widths = (process.env.WIDTHS ?? "320,375,390,430,768,1024,1440,1920").split(",").map(Number);

const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
let problems = 0;
for (const w of widths) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
  for (const r of routes) {
    const page = await ctx.newPage();
    const errs: string[] = [];
    const bad: string[] = [];
    page.on("console", (m) => m.type() === "error" && !m.text().includes("404") && errs.push(m.text().slice(0, 160)));
    page.on("pageerror", (e) => errs.push(String(e).slice(0, 160)));
    page.on("response", (res) => res.status() >= 400 && !res.url().includes("does-not-exist") && bad.push(`${res.status()} ${res.url().replace(base, "")}`));
    await page.goto(base + r, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((res) => setTimeout(res, 40));
      }
    });
    await page.waitForTimeout(400);
    const info = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      h1: [...document.querySelectorAll("h1")].filter((h) => (h as HTMLElement).offsetParent !== null).length,
      brokenImgs: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.src).map((i) => i.src).slice(0, 3),
      wide: [...document.querySelectorAll("body *")]
        .filter((e) => {
          const rc = e.getBoundingClientRect();
          return rc.right > window.innerWidth + 1 && getComputedStyle(e).position !== "fixed";
        })
        .slice(0, 3)
        .map((e) => e.tagName + "." + String((e as HTMLElement).className ?? "").slice(0, 60)),
    }));
    if (info.overflow > 0 || info.h1 !== 1 || info.brokenImgs.length || errs.length || bad.length) {
      problems++;
      console.log(w, r, JSON.stringify({ ...info, errs, bad: bad.slice(0, 4) }));
    }
    await page.close();
  }
  await ctx.close();
}
console.log("problems:", problems);
await b.close();
