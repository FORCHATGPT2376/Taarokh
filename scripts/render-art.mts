/**
 * Renders TAAROKH concept imagery to /public/images and writes
 * src/data/image-manifest.json (dimensions + blur placeholders).
 *
 *   npx tsx scripts/render-art.mts            # everything
 *   npx tsx scripts/render-art.mts hero       # only scenes whose path contains "hero"
 */
import { chromium } from "playwright";
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import { allScenes } from "./art/scenes";
import { svgDoc } from "./art/surfaces";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "public/images");
const manifestPath = path.join(root, "src/data/image-manifest.json");
const filter = process.argv[2];
const scenes = allScenes().filter((s) => !filter || s.out.includes(filter));

const exe = process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const browser = await chromium.launch({ executablePath: exe });
let manifest: Record<string, { width: number; height: number; blur: string }> = {};
try {
  manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
} catch {}

async function render(s: (typeof scenes)[number]) {
  const page = await browser.newPage({ viewport: { width: s.W, height: s.H } });
  await page.setContent(svgDoc(s.W, s.H, s.body), { waitUntil: "load" });
  const png = await page.screenshot({ type: "png" });
  await page.close();
  const file = path.join(outDir, `${s.out}.jpg`);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await sharp(png).jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: "4:4:4" }).toFile(file);
  const blur = await sharp(png).resize(16).webp({ quality: 40 }).toBuffer();
  manifest[`/images/${s.out}.jpg`] = { width: s.W, height: s.H, blur: `data:image/webp;base64,${blur.toString("base64")}` };
  console.log("rendered", s.out);
}

const queue = [...scenes];
await Promise.all(
  Array.from({ length: 3 }, async () => {
    while (queue.length) await render(queue.shift()!);
  }),
);
await browser.close();
const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
await fs.mkdir(path.dirname(manifestPath), { recursive: true });
await fs.writeFile(manifestPath, JSON.stringify(sorted, null, 2) + "\n");
console.log(`done: ${scenes.length} scenes`);
