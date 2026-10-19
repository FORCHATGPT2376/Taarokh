/**
 * Scene compositions for TAAROKH concept imagery.
 * Each scene returns { W, H, body } and is rendered to /public/images by
 * scripts/render-art.mts. All visuals are original procedural artwork.
 */
import { colorways, type Colorway } from "../../src/lib/art/palette";
import { assembledWatch, mix, printPattern, sharedDefs, strap, watchDefs, watchHead } from "../../src/lib/art/svg";
import { grain, jaaliShadow, lighting, surface, type Surface } from "./surfaces";

export interface Scene {
  out: string; // path under public/images, without extension
  W: number;
  H: number;
  body: string;
}

const defs = (p: string, c: Colorway, printScale = 1) =>
  `<defs>${sharedDefs(p)}${watchDefs(p)}${printPattern(c, p + "print", printScale)}</defs>`;

/** depth of field: blur the scene progressively along a gradient */
function dof(W: number, H: number, id: string, inner: string, x1 = 0, y1 = 0, x2 = 1, y2 = 1, amount = 10, focus = 0.45): string {
  return `<defs>
    <linearGradient id="${id}g" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
      <stop offset="0" stop-color="#fff"/><stop offset="${focus - 0.2}" stop-color="#fff" stop-opacity="0.0"/><stop offset="${focus + 0.2}" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/>
    </linearGradient>
    <mask id="${id}m" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="url(#${id}g)"/></mask>
    <filter id="${id}f" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="${amount}"/></filter>
  </defs>
  <g id="${id}s">${inner}</g>
  <use href="#${id}s" filter="url(#${id}f)" mask="url(#${id}m)"/>`;
}

const dialFor: Record<string, { dial: string; dark?: boolean }> = {
  indigo: { dial: "#EDE9E0" },
  ivory: { dial: "#22324A", dark: true },
  rose: { dial: "#EFE6D6" },
  earth: { dial: "#E8DDC6" },
  midnight: { dial: "#E9E7E2" },
  noir: { dial: "#161616", dark: true },
  courtyard: { dial: "#26364F", dark: true },
};

const surfaceFor: Record<string, Surface> = {
  indigo: "linen",
  ivory: "sandstone",
  rose: "linen",
  earth: "sandstone",
  midnight: "slate",
  noir: "slate",
  courtyard: "linen",
};

/* ---------------------------------------------------------------- */

export function heroDesktop(): Scene {
  const W = 2400;
  const H = 1400;
  const c = colorways.indigo;
  const p = "h";
  return {
    out: "hero/hero-desktop",
    W,
    H,
    body: `${defs(p, c)}
    ${surface("sandstone", W, H, "s", 21)}
    <g transform="translate(1610 720) rotate(-31) scale(1.18)">${assembledWatch({ c, p, dial: "#EDE9E0" })}</g>
    ${jaaliShadow(W, H, "j", 0.7, 400, "skewX(-30) rotate(-12)", { cx: 0.66, cy: 0.5, r: 0.55 })}
    ${lighting(W, H, "l", 0.66, 0.45, 0.6)}
    <linearGradient id="dk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0d0a08" stop-opacity="0.82"/><stop offset="0.42" stop-color="#0d0a08" stop-opacity="0.35"/><stop offset="0.7" stop-color="#0d0a08" stop-opacity="0"/></linearGradient>
    <rect width="${W}" height="${H}" fill="url(#dk)"/>
    ${grain(W, H, "g", 0.09)}`,
  };
}

export function heroMobile(): Scene {
  const W = 1200;
  const H = 1900;
  const c = colorways.indigo;
  const p = "h";
  return {
    out: "hero/hero-mobile",
    W,
    H,
    body: `${defs(p, c)}
    ${surface("sandstone", W, H, "s", 21)}
    <g transform="translate(640 1180) rotate(-18) scale(1.05)">${assembledWatch({ c, p, dial: "#EDE9E0" })}</g>
    ${jaaliShadow(W, H, "j", 0.7, 330, "skewX(-28) rotate(-10)", { cx: 0.55, cy: 0.62, r: 0.6 })}
    ${lighting(W, H, "l", 0.55, 0.62, 0.6)}
    <linearGradient id="dk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d0a08" stop-opacity="0.85"/><stop offset="0.45" stop-color="#0d0a08" stop-opacity="0.3"/><stop offset="0.7" stop-color="#0d0a08" stop-opacity="0"/></linearGradient>
    <rect width="${W}" height="${H}" fill="url(#dk)"/>
    ${grain(W, H, "g", 0.09)}`,
  };
}

/* ---------------------------------------------------------------- */
/* Product imagery                                                    */
/* ---------------------------------------------------------------- */

export function productFront(handle: string, cid: string): Scene {
  const W = 1600;
  const H = 1600;
  const c = colorways[cid];
  const p = "f";
  return {
    out: `products/${handle}/01-front`,
    W,
    H,
    body: `${defs(p, c)}
    ${surface("studio", W, H, "s")}
    <g transform="translate(640 170) rotate(-3) scale(1.06)">${strap({ c, p, kind: "long" })}</g>
    <g transform="translate(985 205) rotate(2.5) scale(1.06)">${strap({ c, p, kind: "short" })}</g>
    ${lighting(W, H, "l", 0.3, 0.2, 0.55, "#FFF4E2")}
    ${grain(W, H, "g", 0.05)}`,
  };
}

export function productOnWatch(handle: string, cid: string): Scene {
  const W = 1600;
  const H = 1600;
  const c = colorways[cid];
  const p = "w";
  const d = dialFor[cid];
  const sf = surfaceFor[cid];
  const dark = sf === "slate";
  return {
    out: `products/${handle}/02-on-watch`,
    W,
    H,
    body: `${defs(p, c)}
    ${surface(sf, W, H, "s", 5)}
    <g transform="translate(800 800) rotate(-24) scale(1.32)">${assembledWatch({ c, p, dial: d.dial, dialDark: d.dark })}</g>
    ${dark ? jaaliShadow(W, H, "j", 0.35, 210) : ""}
    ${lighting(W, H, "l", 0.3, 0.22, dark ? 1.1 : 0.8)}
    ${grain(W, H, "g", 0.07)}`,
  };
}

export function productDetail(handle: string, cid: string): Scene {
  const W = 1600;
  const H = 1600;
  const c = colorways[cid];
  const p = "d";
  const sf = surfaceFor[cid];
  const inner = `${surface(sf, W, H, "s", 8)}
    <g transform="translate(560 -260) rotate(-32) scale(4.2)">${strap({ c, p, kind: "long" })}</g>`;
  return {
    out: `products/${handle}/03-detail`,
    W,
    H,
    body: `${defs(p, c)}
    ${dof(W, H, "z", inner, 0, 0, 1, 1, 16, 0.5)}
    ${lighting(W, H, "l", 0.25, 0.2, 0.9)}
    ${grain(W, H, "g", 0.07)}`,
  };
}

export function productBuckle(handle: string, cid: string): Scene {
  const W = 1600;
  const H = 1600;
  const c = colorways[cid];
  const p = "b";
  const sf = surfaceFor[cid];
  const inner = `${surface(sf, W, H, "s", 12)}
    <g transform="translate(1752 -1557) rotate(22) scale(3.1)">${strap({ c, p, kind: "short" })}</g>`;
  return {
    out: `products/${handle}/04-buckle`,
    W,
    H,
    body: `${defs(p, c)}
    ${dof(W, H, "z", inner, 1, 0, 0, 1, 14, 0.55)}
    ${lighting(W, H, "l", 0.3, 0.25, 0.9)}
    ${grain(W, H, "g", 0.07)}`,
  };
}

/* ---------------------------------------------------------------- */
/* Editorial                                                          */
/* ---------------------------------------------------------------- */

export function textileMacro(out: string, cid: string, W = 1600, H = 2000, scale = 7, rot = -18): Scene {
  const c = colorways[cid];
  const p = "t";
  const inner = `${surface("linen", W, H, "s", 3)}
    <g transform="translate(${W * 0.5} ${-H * 0.15}) rotate(${rot}) scale(${scale})">${strap({ c, p, kind: "long" })}</g>`;
  return {
    out,
    W,
    H,
    body: `${defs(p, c)}
    ${dof(W, H, "z", inner, 0, 0, 0.3, 1, 18, 0.5)}
    ${lighting(W, H, "l", 0.2, 0.15, 0.9)}
    ${grain(W, H, "g", 0.07)}`,
  };
}

export function collectionImage(out: string, ids: string[], sf: Surface, dark = false): Scene {
  const W = 1600;
  const H = 2000;
  const p = "c";
  const pats = ids.map((id, i) => printPattern(colorways[id], `${p}${i}print`, 1)).join("");
  const straps = ids
    .map((id, i) => {
      const c = colorways[id];
      const q = `${p}${i}`;
      const x = 500 + i * 330;
      return `<defs>${sharedDefs(q)}</defs><g transform="translate(${x} ${-120 + i * 70}) rotate(${-14 + i * 1.5}) scale(1.55)">${strap({ c, p: q, kind: "long" })}</g>`;
    })
    .join("");
  return {
    out,
    W,
    H,
    body: `<defs>${pats}</defs>
    ${surface(sf, W, H, "s", 14)}
    ${straps}
    ${dark ? jaaliShadow(W, H, "j", 0.45, 220) : ""}
    ${lighting(W, H, "l", 0.3, 0.18, dark ? 1.2 : 0.8)}
    ${grain(W, H, "g", 0.07)}`,
  };
}

export function watchOnSurface(out: string, cid: string, sf: Surface, W: number, H: number, x: number, y: number, rot: number, scale: number, opts: { jaali?: number; light?: [number, number, number]; darken?: number } = {}): Scene {
  const c = colorways[cid];
  const d = dialFor[cid];
  const p = "x";
  const [lx, ly, ls] = opts.light ?? [0.3, 0.2, 1];
  return {
    out,
    W,
    H,
    body: `${defs(p, c)}
    ${surface(sf, W, H, "s", 31)}
    <g transform="translate(${x} ${y}) rotate(${rot}) scale(${scale})">${assembledWatch({ c, p, dial: d.dial, dialDark: d.dark })}</g>
    ${opts.jaali ? jaaliShadow(W, H, "j", opts.jaali, 220) : ""}
    ${lighting(W, H, "l", lx, ly, ls)}
    ${opts.darken ? `<rect width="${W}" height="${H}" fill="#000" opacity="${opts.darken}"/>` : ""}
    ${grain(W, H, "g", 0.08)}`,
  };
}

export function watchHeadMacro(out: string, W: number, H: number, dial: string, dark: boolean): Scene {
  const p = "m";
  const c = colorways.noir;
  const inner = `${surface("studioDark", W, H, "s")}
    <g transform="translate(${W * 0.56} ${H * 0.55}) rotate(-12) scale(${(W / 420) * 0.9})">${watchHead({ p, dial, dialDark: dark })}</g>`;
  return {
    out,
    W,
    H,
    body: `${defs(p, c)}
    ${dof(W, H, "z", inner, 0, 0, 1, 1, 10, 0.55)}
    ${lighting(W, H, "l", 0.25, 0.2, 1.1)}
    ${grain(W, H, "g", 0.08)}`,
  };
}

/** Three straps on the same watch (triptych) */
export function triptych(out: string): Scene {
  const W = 2400;
  const H = 1600;
  const ids = ["courtyard", "earth", "indigo"];
  let body = "";
  ids.forEach((id, i) => {
    const c = colorways[id];
    const p = `q${i}`;
    const d = dialFor.indigo;
    body += `<defs>${sharedDefs(p)}${watchDefs(p)}${printPattern(c, p + "print")}</defs>
    <svg x="${i * 800}" y="0" width="800" height="${H}" viewBox="0 0 800 ${H}">
      ${surface(i === 1 ? "sandstone" : "linen", 800, H, `s${i}`, 7 + i)}
      <g transform="translate(400 800) rotate(0) scale(1.15)">${assembledWatch({ c, p, dial: d.dial })}</g>
      ${lighting(800, H, `l${i}`, 0.3, 0.2, 0.7)}
    </svg>`;
  });
  body += `<rect x="799" y="0" width="2" height="${H}" fill="#F4F0E8" opacity="0.9"/><rect x="1599" y="0" width="2" height="${H}" fill="#F4F0E8" opacity="0.9"/>${grain(W, H, "g", 0.07)}`;
  return { out, W, H, body };
}

/** Flat lay of several straps side by side (vertical). */
export function strapRow(out: string, ids: string[], sf: Surface, W = 2400, H = 1600): Scene {
  let body = `${surface(sf, W, H, "s", 17)}`;
  const gap = W / (ids.length + 1);
  ids.forEach((id, i) => {
    const c = colorways[id];
    const p = `r${i}`;
    body += `<defs>${sharedDefs(p)}${printPattern(c, p + "print")}</defs>
    <g transform="translate(${gap * (i + 1)} ${H * 0.12}) rotate(${(i - (ids.length - 1) / 2) * 1.6}) scale(${H / 1400})">${strap({ c, p, kind: "long" })}</g>`;
  });
  body += `${lighting(W, H, "l", 0.3, 0.15, 0.75)}${grain(W, H, "g", 0.07)}`;
  return { out, W, H, body };
}

/** Plain leather vs printed fabric comparison */
export function leatherVsFabric(out: string): Scene {
  const W = 2400;
  const H = 1600;
  const leather: Colorway = {
    id: "leather",
    kind: "buti",
    ground: "#5A3826",
    ink: "#5A3826",
    accent: "#5A3826",
    leaf: "#5A3826",
    rekh: "",
    thread: "#E6D6BC",
    lining: "#3B2418",
    keeper: "#4E3020",
  };
  const fabric = colorways.midnight;
  const s = (c: Colorway, p: string, x: number, rot: number) =>
    `<defs>${sharedDefs(p)}${printPattern(c, p + "print")}</defs><g transform="translate(${x} 120) rotate(${rot}) scale(1.15)">${strap({ c, p, kind: "long" })}</g>`;
  return {
    out,
    W,
    H,
    body: `${surface("linen", W, H, "s", 9)}${s(leather, "lv", 980, 4)}${s(fabric, "fv", 1420, -4)}${lighting(W, H, "l", 0.3, 0.15, 0.8)}${grain(W, H, "g", 0.07)}`,
  };
}

/** Wooden printing block resting on printed cloth. */
export function printingBlock(out: string, W = 2400, H = 1600, cid = "ivory"): Scene {
  const c = colorways[cid];
  const p = "k";
  const cloth = `<rect width="${W}" height="${H}" fill="url(#${p}print)"/>`;
  const woodGrain = `<filter id="wood" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.004 0.12" numOctaves="3" seed="4"/><feColorMatrix type="matrix" values="0 0 0 0 0.25  0 0 0 0 0.14  0 0 0 0 0.07  0 0 0 -1.4 1.1"/></filter>`;
  const bx = 1260;
  const by = 380;
  const bw = 760;
  const bh = 760;
  return {
    out,
    W,
    H,
    body: `<defs>${sharedDefs(p)}${printPattern(c, p + "print", 3.2)}${woodGrain}
      <linearGradient id="woodg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9C6A43"/><stop offset="1" stop-color="#6E4528"/></linearGradient>
      <linearGradient id="woodside" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5B3820"/><stop offset="1" stop-color="#3A2313"/></linearGradient>
    </defs>
    ${surface("linen", W, H, "s", 3)}
    <g opacity="0.92" style="mix-blend-mode:multiply">${cloth}</g>
    <rect width="${W}" height="${H}" filter="url(#${p}fibre)" opacity="0.35" style="mix-blend-mode:multiply"/>
    <g transform="rotate(-9 ${bx + bw / 2} ${by + bh / 2})">
      <rect x="${bx + 40}" y="${by + 60}" width="${bw}" height="${bh}" rx="18" fill="#000" opacity="0.55" filter="url(#${p}soft)"/>
      <rect x="${bx + 30}" y="${by + 50}" width="${bw}" height="${bh}" rx="16" fill="#000" opacity="0.45" filter="url(#${p}soft)"/>
      <rect x="${bx}" y="${by + 36}" width="${bw}" height="${bh}" rx="16" fill="url(#woodside)"/>
      <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="16" fill="url(#woodg)"/>
      <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="16" filter="url(#wood)" opacity="0.9"/>
      <rect x="${bx + 6}" y="${by + 6}" width="${bw - 12}" height="${bh - 12}" rx="12" fill="none" stroke="#fff" stroke-opacity="0.18" stroke-width="3"/>
      <g transform="translate(${bx + bw / 2} ${by + bh / 2})">
        <rect x="-230" y="-300" width="460" height="130" rx="65" fill="#4A2D18" opacity="0.6"/>
        <rect x="-226" y="-306" width="452" height="122" rx="61" fill="#B47E52"/>
        <rect x="-226" y="-306" width="452" height="122" rx="61" filter="url(#wood)" opacity="0.7"/>
        <rect x="-200" y="-296" width="400" height="20" rx="10" fill="#fff" opacity="0.12"/>
      </g>
    </g>
    ${lighting(W, H, "l", 0.62, 0.25, 0.95)}
    ${grain(W, H, "g", 0.08)}`,
  };
}

/** Original architectural illustration: pink-wash façade with cusped arches and jaali. */
export function facade(out: string, W = 2400, H = 1300, bays = 5): Scene {
  const p = "fa";
  const bw = W / bays;
  const archTop = H * 0.26;
  const archBottom = H * 1.02;
  const arch = (cx: number, w: number, top: number, bottom: number) => {
    const l = cx - w / 2;
    const r = cx + w / 2;
    const spring = top + w * 0.62;
    const lobes = 5;
    let d = `M${l} ${bottom} L${l} ${spring}`;
    // multifoil arch made of lobes along a pointed arch
    const pts: [number, number][] = [];
    for (let i = 0; i <= lobes; i++) {
      const t = i / lobes;
      const ang = Math.PI * (1 - t);
      const x = cx + Math.cos(ang) * (w / 2);
      const y = spring - Math.sin(ang) * (spring - top) * (1 - 0.25 * Math.abs(Math.cos(ang)));
      pts.push([x, y]);
    }
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      const mx = (x0 + x1) / 2;
      const my = (y0 + y1) / 2;
      const nx = -(y1 - y0);
      const ny = x1 - x0;
      const len = Math.hypot(nx, ny);
      const bulge = 0.32 * len;
      d += ` Q ${(mx + (nx / len) * bulge).toFixed(1)} ${(my + (ny / len) * bulge).toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
    }
    d += ` L${r} ${bottom} Z`;
    return d;
  };
  let bays_ = "";
  for (let i = 0; i < bays; i++) {
    const cx = bw * (i + 0.5);
    const w = bw * 0.62;
    const outer = arch(cx, w + 70, archTop - 50, archBottom);
    const mid = arch(cx, w + 34, archTop - 24, archBottom);
    const inner = arch(cx, w, archTop, archBottom);
    const lit = i % 2 === 1;
    bays_ += `
    <path d="${outer}" fill="none" stroke="#F6EEE6" stroke-width="5" opacity="0.9"/>
    <path d="${mid}" fill="#B9705F" opacity="0.5"/>
    <path d="${mid}" fill="none" stroke="#F6EEE6" stroke-width="2.2" opacity="0.8"/>
    <path d="${inner}" fill="url(#${p}recess)"/>
    ${lit ? `<path d="${inner}" fill="url(#${p}jaali)" opacity="0.9"/><path d="${inner}" fill="url(#${p}glow)"/>` : ""}
    <path d="${inner}" fill="url(#${p}topShade)"/>
    <path d="${inner}" fill="none" stroke="#3B1C15" stroke-width="3" opacity="0.5" transform="translate(-4 6)"/>
    <g transform="translate(${cx} ${archTop - 110})" fill="none" stroke="#F6EEE6" stroke-width="2.4" opacity="0.85">
      <circle r="16"/><circle r="5" fill="#F6EEE6"/>
      ${Array.from({ length: 8 }, (_, k) => `<ellipse cx="0" cy="-27" rx="7" ry="11" transform="rotate(${k * 45})"/>`).join("")}
    </g>
    <rect x="${cx - bw / 2 + 6}" y="${archTop - 40}" width="12" height="${H}" fill="#F6EEE6" opacity="0.25"/>`;
  }
  return {
    out,
    W,
    H,
    body: `<defs>
      <linearGradient id="${p}recess" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3B1E19"/><stop offset="1" stop-color="#6E3A30"/></linearGradient>
      <linearGradient id="${p}topShade" x1="0" y1="0" x2="1" y2="0.4"><stop offset="0" stop-color="#000" stop-opacity="0.45"/><stop offset="0.5" stop-color="#000" stop-opacity="0.05"/><stop offset="1" stop-color="#000" stop-opacity="0.3"/></linearGradient>
      <radialGradient id="${p}glow" cx="0.5" cy="0.7" r="0.6"><stop offset="0" stop-color="#FFD9A0" stop-opacity="0.35"/><stop offset="1" stop-color="#FFD9A0" stop-opacity="0"/></radialGradient>
      <pattern id="${p}jaali" patternUnits="userSpaceOnUse" width="44" height="44">
        <rect width="44" height="44" fill="#4A2620"/>
        <polygon points="22,6 27,17 38,22 27,27 22,38 17,27 6,22 17,17" fill="#F2B983" opacity="0.85"/>
        <circle cx="0" cy="0" r="4" fill="#F2B983" opacity="0.7"/><circle cx="44" cy="0" r="4" fill="#F2B983" opacity="0.7"/><circle cx="0" cy="44" r="4" fill="#F2B983" opacity="0.7"/><circle cx="44" cy="44" r="4" fill="#F2B983" opacity="0.7"/>
      </pattern>
    </defs>
    ${surface("pinkstone", W, H, "s", 6)}
    <rect y="${H * 0.05}" width="${W}" height="10" fill="#F6EEE6" opacity="0.7"/>
    <rect y="${H * 0.05 + 22}" width="${W}" height="3" fill="#F6EEE6" opacity="0.55"/>
    <rect y="${H * 0.05 + 25}" width="${W}" height="40" fill="#000" opacity="0.12"/>
    ${Array.from({ length: Math.ceil(W / 60) }, (_, k) => `<path d="M${k * 60 + 30} ${H * 0.05 + 40} l10 14 l-10 14 l-10 -14z" fill="#F6EEE6" opacity="0.55"/>`).join("")}
    ${bays_}
    ${jaaliShadow(W, H, "j", 0.0, 200)}
    ${lighting(W, H, "l", 0.15, 0.1, 1.05, "#FFE2BC")}
    <linearGradient id="${p}rake" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.35"/></linearGradient>
    <rect width="${W}" height="${H}" fill="url(#${p}rake)"/>
    ${grain(W, H, "g", 0.09)}`,
  };
}

/** Exploded construction diagram of a strap (illustrative). */
export function constructionLayers(out: string): Scene {
  const W = 2000;
  const H = 1500;
  const c = colorways.earth;
  const p = "e";
  const layer = (y: number, fill: string, label: string, i: number) => `
    <g transform="translate(1180 ${y}) skewX(-38) scale(0.8 0.5)">
      <rect x="-620" y="-110" width="1240" height="220" rx="110" fill="#000" opacity="0.28" filter="url(#${p}soft)" transform="translate(16 40)"/>
      <rect x="-620" y="-110" width="1240" height="220" rx="110" fill="${fill}"/>
      ${i === 0 ? `<rect x="-620" y="-110" width="1240" height="220" rx="110" fill="url(#${p}twill)" opacity="0.2"/><rect x="-590" y="-80" width="1180" height="160" rx="80" fill="none" stroke="${c.thread}" stroke-width="5" stroke-dasharray="20 12"/>` : ""}
    </g>
    <text x="120" y="${y + 10}" font-family="Manrope, Helvetica, Arial, sans-serif" font-size="26" letter-spacing="5" fill="#3a352f">${label}</text>
    <line x1="120" y1="${y + 26}" x2="460" y2="${y + 26}" stroke="#3a352f" stroke-width="1" opacity="0.5"/>`;
  return {
    out,
    W,
    H,
    body: `<defs>${sharedDefs(p)}${printPattern(c, p + "print", 2.2)}</defs>
    ${surface("studio", W, H, "s")}
    ${layer(1110, mix(c.lining, "#000000", 0.05), "03  LINING  ·  TBC", 2)}
    ${layer(800, "#CDBB9C", "02  REINFORCEMENT  ·  TBC", 1)}
    ${layer(490, `url(#${p}print)`, "01  PRINTED TEXTILE", 0)}
    ${lighting(W, H, "l", 0.3, 0.15, 0.5, "#FFF4E2")}
    ${grain(W, H, "g", 0.05)}`,
  };
}

/** Swatch board: all prints side by side */
export function swatchBoard(out: string): Scene {
  const W = 2400;
  const H = 1600;
  const ids = ["indigo", "ivory", "rose", "earth", "midnight", "noir", "courtyard"];
  let body = surface("studio", W, H, "s");
  const sw = 280;
  const gap = 40;
  const total = ids.length * sw + (ids.length - 1) * gap;
  const x0 = (W - total) / 2;
  ids.forEach((id, i) => {
    const c = colorways[id];
    const p = `w${i}`;
    const x = x0 + i * (sw + gap);
    const y = 300 + (i % 2) * 60;
    body += `<defs>${sharedDefs(p)}${printPattern(c, p + "print", 2.4)}</defs>
      <rect x="${x + 14}" y="${y + 26}" width="${sw}" height="${sw * 3}" fill="#000" opacity="0.28" filter="url(#${p}soft)"/>
      <rect x="${x}" y="${y}" width="${sw}" height="${sw * 3}" fill="url(#${p}print)"/>
      <rect x="${x}" y="${y}" width="${sw}" height="${sw * 3}" fill="url(#${p}twill)" opacity="0.22"/>
      <rect x="${x}" y="${y}" width="${sw}" height="${sw * 3}" filter="url(#${p}fibre)" opacity="0.25" style="mix-blend-mode:multiply"/>`;
  });
  body += `${lighting(W, H, "l", 0.3, 0.15, 0.7, "#FFF4E2")}${grain(W, H, "g", 0.06)}`;
  return { out, W, H, body };
}

/** Strap laid on folded indigo cloth */
export function onCloth(out: string, cid: string, W = 2000, H = 1333): Scene {
  const c = colorways[cid];
  const p = "o";
  const d = dialFor[cid];
  const folds = Array.from({ length: 7 }, (_, i) => {
    const x = i * (W / 6) - 200;
    return `<path d="M${x} -50 C ${x + 200} ${H * 0.3}, ${x - 120} ${H * 0.7}, ${x + 160} ${H + 50}" stroke="#000" stroke-opacity="0.35" stroke-width="${60 + (i % 3) * 30}" fill="none" filter="url(#${p}soft)"/>
    <path d="M${x + 70} -50 C ${x + 270} ${H * 0.3}, ${x - 50} ${H * 0.7}, ${x + 230} ${H + 50}" stroke="#fff" stroke-opacity="0.08" stroke-width="40" fill="none" filter="url(#${p}soft)"/>`;
  }).join("");
  return {
    out,
    W,
    H,
    body: `${defs(p, c)}${printPattern(colorways.indigo, "clothprint", 2)}
    <rect width="${W}" height="${H}" fill="url(#clothprint)"/>
    <rect width="${W}" height="${H}" fill="#0e1622" opacity="0.35"/>
    ${folds}
    <g transform="translate(${W * 0.58} ${H * 0.5}) rotate(-62) scale(${H / 1250})">${assembledWatch({ c, p, dial: d.dial, dialDark: d.dark })}</g>
    ${lighting(W, H, "l", 0.55, 0.35, 1.2)}
    ${grain(W, H, "g", 0.08)}`,
  };
}

export const products: [string, string][] = [
  ["sanganer-indigo", "indigo"],
  ["sanganer-ivory", "ivory"],
  ["jaipur-rose", "rose"],
  ["bagru-earth", "earth"],
  ["bagru-midnight", "midnight"],
  ["jharokha-noir", "noir"],
  ["jharokha-ivory", "courtyard"],
];

export function allScenes(): Scene[] {
  const s: Scene[] = [heroDesktop(), heroMobile()];
  for (const [h, c] of products) {
    s.push(productFront(h, c), productOnWatch(h, c), productDetail(h, c), productBuckle(h, c));
  }
  s.push(
    textileMacro("editorial/intro-textile", "indigo"),
    collectionImage("collections/sanganer", ["ivory", "indigo", "rose"], "linen"),
    collectionImage("collections/bagru", ["earth", "midnight", "earth"], "sandstone"),
    collectionImage("collections/jharokha", ["courtyard", "noir", "courtyard"], "slate", true),
    facade("editorial/jaipur-facade"),
    facade("editorial/jaipur-facade-tall", 1600, 2000, 3),
    textileMacro("editorial/material-fabric", "ivory", 1600, 2000, 9, -8),
    productDetail("_material", "midnight"),
    productBuckle("_finish", "earth"),
    watchOnSurface("editorial/philosophy", "noir", "sandstone", 2400, 1500, 1550, 760, -38, 1.45, { jaali: 0.72, light: [0.62, 0.45, 0.7], darken: 0.38 }),
    onCloth("editorial/on-cloth", "ivory"),
    triptych("editorial/triptych"),
    strapRow("editorial/strap-row", ["indigo", "ivory", "rose", "earth", "midnight", "noir", "courtyard"], "linen"),
    leatherVsFabric("journal/leather-vs-fabric"),
    printingBlock("journal/sanganeri-printing"),
    printingBlock("journal/block-printing-story", 2400, 1600, "earth"),
    facade("journal/jaipur-architecture", 2400, 1600, 4),
    watchHeadMacro("journal/mechanical-watches", 2400, 1600, "#EDE9E0", false),
    watchOnSurface("journal/dress-watch", "noir", "slate", 2400, 1600, 1250, 820, 58, 1.2, { jaali: 0.4 }),
    watchOnSurface("journal/lug-width", "midnight", "linen", 2400, 1600, 1200, 800, -90, 1.3),
    swatchBoard("editorial/swatch-board"),
    constructionLayers("editorial/construction"),
    watchOnSurface("editorial/og", "indigo", "sandstone", 1200, 630, 820, 330, -60, 0.62, { jaali: 0.5, light: [0.6, 0.4, 1.2] }),
  );
  return s;
}
