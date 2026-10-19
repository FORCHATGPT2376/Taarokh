/** Visual QA: npx tsx scripts/shot.mts <path> <width> <out.png> [full] */
import { chromium } from "playwright";
const [path = "/", w = "1440", out = "shot.png", full = "full"] = process.argv.slice(2);
const width = Number(w);
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await b.newPage({ viewport: { width, height: width < 768 ? 844 : 900 }, deviceScaleFactor: 1 });
const errors: string[] = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(`http://localhost:${process.env.PORT ?? 3000}${path}`, { waitUntil: "networkidle" });
if (full === "full") {
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 500) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
}
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
await page.screenshot({ path: out, fullPage: full === "full" });
console.log(JSON.stringify({ overflow, errors: errors.slice(0, 8) }));
await b.close();
