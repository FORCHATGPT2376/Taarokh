/**
 * TAAROKH concept-art engine.
 *
 * Pure functions that return SVG markup strings. Everything here is original
 * drawing code: the prints are TAAROKH's own motifs (inspired by, not copied
 * from, Sanganeri butis, Bagru jaal lattices and Jaipur jharokha arcades) and
 * the watch is a generic, unbranded three-hand analog watch.
 *
 * Units: 10 units = 1 mm on the strap (a 20 mm strap is 200 units wide).
 */
import type { Colorway } from "./palette";

const f = (n: number) => Number(n.toFixed(2));

/* ------------------------------------------------------------------ */
/* Colour helpers                                                       */
/* ------------------------------------------------------------------ */

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

export function mix(a: string, b: string, t: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const c = ca.map((v, i) => Math.round(v + (cb[i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

/** Colourise a noise channel between two colours (feColorMatrix values). */
export function noiseMatrix(dark: string, light: string, contrast = 1): string {
  const d = hexToRgb(dark).map((v) => v / 255);
  const l = hexToRgb(light).map((v) => v / 255);
  const rows = [0, 1, 2].map((i) => {
    const k = (l[i] - d[i]) * contrast;
    const off = d[i] - (k - (l[i] - d[i])) / 2;
    return `${f(k)} 0 0 0 ${f(off)}`;
  });
  return `${rows.join(" ")} 0 0 0 0 1`;
}

/* ------------------------------------------------------------------ */
/* Print patterns                                                       */
/* ------------------------------------------------------------------ */

function butiMotif(c: Colorway, x: number, y: number, rot: number, s = 1): string {
  const petals = Array.from({ length: 6 }, (_, k) =>
    `<ellipse cx="0" cy="-6.6" rx="3.7" ry="6.2" transform="rotate(${k * 60})"/>`,
  ).join("");
  const rekh = c.rekh
    ? `<g fill="none" stroke="${c.rekh}" stroke-width="0.7" opacity="0.85" transform="translate(0.7 0.5)">${petals}<circle r="2.8"/></g>`
    : "";
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    <path d="M0 7 C 1.5 11, 3.5 14, 2 19" fill="none" stroke="${c.leaf}" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M1.6 13.5 C 6 9.5, 11 10, 13.5 13 C 10.5 16, 5.5 16.5, 1.6 13.5Z" fill="${c.leaf}"/>
    <path d="M1.2 15.5 C -3.5 12.5, -8.5 13.5, -10.5 16.8 C -7 19, -2.5 18.6, 1.2 15.5Z" fill="${c.leaf}"/>
    <g fill="${c.ink}">${petals}</g>
    ${rekh}
    <circle r="2.9" fill="${c.accent}"/>
    <circle r="1.1" fill="${c.ground}" opacity="0.55"/>
  </g>`;
}

function butiTile(c: Colorway, id: string, scale: number): string {
  const w = 58;
  const h = 66;
  const dots = (x: number, y: number) =>
    `<g fill="${c.accent}" opacity="0.9"><circle cx="${x}" cy="${y}" r="1.25"/><circle cx="${x + 3.4}" cy="${y + 2.2}" r="1.05"/><circle cx="${x - 0.6}" cy="${y + 4}" r="1.05"/></g>`;
  return `<pattern id="${id}" patternUnits="userSpaceOnUse" width="${w}" height="${h}" patternTransform="scale(${scale})">
    <rect width="${w}" height="${h}" fill="${c.ground}"/>
    ${butiMotif(c, 14.5, 14, -8)}
    ${butiMotif(c, 43.5, 47, 8)}
    ${butiMotif(c, 43.5, 47 - h, 8)}
    ${butiMotif(c, 14.5 + w, 14, -8)}
    ${dots(42, 13)}${dots(13, 46)}
  </pattern>`;
}

function jaalTile(c: Colorway, id: string, scale: number): string {
  const s = 64;
  const m = s / 2;
  const flower = (x: number, y: number) =>
    `<g transform="translate(${x} ${y})" fill="${c.accent}">
      <circle cx="0" cy="-3.6" r="2.7"/><circle cx="3.6" cy="0" r="2.7"/><circle cx="0" cy="3.6" r="2.7"/><circle cx="-3.6" cy="0" r="2.7"/>
      <circle r="1.9" fill="${c.ink}"/>
    </g>`;
  const cell = (x: number, y: number) =>
    `<g transform="translate(${x} ${y})">
      <path d="M0 -9 C 3 -4, 4 -2, 9 0 C 4 2, 3 4, 0 9 C -3 4, -4 2, -9 0 C -4 -2, -3 -4, 0 -9Z" fill="none" stroke="${c.leaf}" stroke-width="1.3"/>
      <circle r="2" fill="${c.ink}"/>
      <g fill="${c.ink}"><circle cx="0" cy="-14" r="1"/><circle cx="14" cy="0" r="1"/><circle cx="0" cy="14" r="1"/><circle cx="-14" cy="0" r="1"/></g>
    </g>`;
  // ogee lattice: S-curved diagonals
  const lattice = `<path d="M0 ${m} C 10 ${m - 4}, ${m - 12} 12, ${m} 0 C ${m + 12} 12, ${s - 10} ${m - 4}, ${s} ${m} C ${s - 10} ${m + 4}, ${m + 12} ${s - 12}, ${m} ${s} C ${m - 12} ${s - 12}, 10 ${m + 4}, 0 ${m}Z" fill="none" stroke="${c.ink}" stroke-width="2.3" stroke-linejoin="round"/>
    <path d="M0 ${m} C 10 ${m - 4}, ${m - 12} 12, ${m} 0 C ${m + 12} 12, ${s - 10} ${m - 4}, ${s} ${m} C ${s - 10} ${m + 4}, ${m + 12} ${s - 12}, ${m} ${s} C ${m - 12} ${s - 12}, 10 ${m + 4}, 0 ${m}Z" fill="none" stroke="${c.ink}" stroke-width="0.7" stroke-dasharray="1.2 2.4" transform="translate(${m} ${m}) scale(0.78) translate(${-m} ${-m})" opacity="0.8"/>`;
  return `<pattern id="${id}" patternUnits="userSpaceOnUse" width="${s}" height="${s}" patternTransform="scale(${scale})">
    <rect width="${s}" height="${s}" fill="${c.ground}"/>
    ${lattice}
    ${cell(m, m)}
    ${cell(0, 0)}${cell(s, 0)}${cell(0, s)}${cell(s, s)}
    ${flower(0, m)}${flower(s, m)}${flower(m, 0)}${flower(m, s)}
  </pattern>`;
}

function arcadeTile(c: Colorway, id: string, scale: number): string {
  const w = 52;
  const h = 74;
  // cusped (multifoil) arch between x=9 and x=43, springing at y=36, apex at y=9
  const arch = `M9 72 L9 36 C 9 31, 12 29, 14.5 29.5 C 14 25, 17 22, 20 22.6 C 20 18, 23 15.5, 26 9 C 29 15.5, 32 18, 32 22.6 C 35 22, 38 25, 37.5 29.5 C 40 29, 43 31, 43 36 L43 72`;
  const fill = c.kind === "arcade" && c.id === "courtyard" ? c.accent : "none";
  return `<pattern id="${id}" patternUnits="userSpaceOnUse" width="${w}" height="${h}" patternTransform="scale(${scale})">
    <rect width="${w}" height="${h}" fill="${c.ground}"/>
    <path d="${arch} Z" fill="${fill}" stroke="none"/>
    <path d="${arch}" fill="none" stroke="${c.ink}" stroke-width="1.15" stroke-linejoin="round"/>
    <path d="M13 72 L13 37.5 C 13 34, 15 33, 17 33.4 C 17 30.5, 19 28.5, 21.5 28.8 C 22 25.5, 24 23, 26 19 C 28 23, 30 25.5, 30.5 28.8 C 33 28.5, 35 30.5, 35 33.4 C 37 33, 39 34, 39 37.5 L39 72" fill="none" stroke="${c.ink}" stroke-width="0.55" opacity="0.75"/>
    <circle cx="26" cy="5.6" r="1.5" fill="${c.ink}"/>
    <path d="M26 7.2 L26 9" stroke="${c.ink}" stroke-width="0.8"/>
    <g fill="${c.ink}" opacity="0.85">
      <circle cx="26" cy="46" r="1.1"/><circle cx="22" cy="52" r="0.9"/><circle cx="30" cy="52" r="0.9"/><circle cx="26" cy="58" r="1.1"/><circle cx="22" cy="64" r="0.9"/><circle cx="30" cy="64" r="0.9"/>
    </g>
    <path d="M0 73.4 L${w} 73.4" stroke="${c.ink}" stroke-width="1.1"/>
    <path d="M0 70.4 L${w} 70.4" stroke="${c.ink}" stroke-width="0.45" opacity="0.7"/>
    <path d="M0 1.5 L4 1.5 M48 1.5 L52 1.5" stroke="${c.ink}" stroke-width="0.5" opacity="0.6"/>
  </pattern>`;
}

export function printPattern(c: Colorway, id: string, scale = 1): string {
  const s = scale * (c.scale ?? (c.kind === "buti" ? 1.35 : c.kind === "jaal" ? 1.2 : 1.3));
  if (c.kind === "buti") return butiTile(c, id, s);
  if (c.kind === "jaal") return jaalTile(c, id, s);
  return arcadeTile(c, id, s);
}

/* ------------------------------------------------------------------ */
/* Shared filters                                                       */
/* ------------------------------------------------------------------ */

export function sharedDefs(p: string, opts: { lite?: boolean } = {}): string {
  const lite = !!opts.lite;
  return `
  <pattern id="${p}twill" patternUnits="userSpaceOnUse" width="4" height="4">
    <rect width="4" height="4" fill="#fff" opacity="0"/>
    <path d="M-1 1 L1 -1 M0 4 L4 0 M3 5 L5 3" stroke="#000" stroke-width="0.9" opacity="0.55"/>
    <path d="M-1 3 L3 -1 M1 5 L5 1" stroke="#fff" stroke-width="0.5" opacity="0.35"/>
  </pattern>
  ${
    lite
      ? ""
      : `<filter id="${p}fibre" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.55 0.08" numOctaves="3" seed="7" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.05"/>
  </filter>
  <filter id="${p}bleed" x="-2%" y="-2%" width="104%" height="104%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="5" result="t"/>
    <feDisplacementMap in="SourceGraphic" in2="t" scale="2.6" xChannelSelector="R" yChannelSelector="G" result="d"/>
    <feGaussianBlur in="d" stdDeviation="0.55"/>
  </filter>
  <filter id="${p}weave" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="1.6 0.35" numOctaves="2" seed="13" result="h"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.35 1.6" numOctaves="2" seed="17" result="v"/>
    <feComposite in="h" in2="v" operator="arithmetic" k2="0.5" k3="0.5"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.4 0 0 0 1.3"/>
  </filter>
  <filter id="${p}inkMask" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="4" seed="3" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -0.9 1.25"/>
  </filter>`
  }
  <filter id="${p}soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>
  <filter id="${p}contact" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.4"/></filter>
  <filter id="${p}handShadow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>
  <linearGradient id="${p}vol" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#000" stop-opacity="0.42"/>
    <stop offset="0.07" stop-color="#000" stop-opacity="0.12"/>
    <stop offset="0.3" stop-color="#fff" stop-opacity="0.1"/>
    <stop offset="0.55" stop-color="#fff" stop-opacity="0.02"/>
    <stop offset="0.93" stop-color="#000" stop-opacity="0.14"/>
    <stop offset="1" stop-color="#000" stop-opacity="0.5"/>
  </linearGradient>
  <linearGradient id="${p}fold" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#000" stop-opacity="0.55"/>
    <stop offset="0.6" stop-color="#000" stop-opacity="0.12"/>
    <stop offset="1" stop-color="#000" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="${p}steel" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#f6f5f1"/>
    <stop offset="0.18" stop-color="#a9a8a3"/>
    <stop offset="0.36" stop-color="#ecebe6"/>
    <stop offset="0.52" stop-color="#6f6e6a"/>
    <stop offset="0.7" stop-color="#d9d8d2"/>
    <stop offset="0.86" stop-color="#8b8a85"/>
    <stop offset="1" stop-color="#cfcec8"/>
  </linearGradient>
  <linearGradient id="${p}brushV" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#7b7a76"/>
    <stop offset="0.25" stop-color="#d7d6d0"/>
    <stop offset="0.5" stop-color="#b3b2ad"/>
    <stop offset="0.72" stop-color="#e9e8e3"/>
    <stop offset="1" stop-color="#6c6b67"/>
  </linearGradient>`;
}

/* ------------------------------------------------------------------ */
/* Strap                                                               */
/* ------------------------------------------------------------------ */

export interface StrapOpts {
  c: Colorway;
  p: string; // id prefix (must match sharedDefs prefix)
  kind: "long" | "short";
  length?: number;
  lite?: boolean;
  printScale?: number;
  /** show underside (lining) instead of print */
  reverse?: boolean;
  /** draw the tang buckle on the short piece */
  buckle?: boolean;
  /** piece is drawn rotated 180°; keeps shadows falling the same way */
  flip?: boolean;
}

function longPath(L: number) {
  return `M-100 0 L100 0 L90 ${L - 92} C 90 ${L - 38}, 46 ${L}, 0 ${L} C -46 ${L}, -90 ${L - 38}, -90 ${L - 92} Z`;
}
function shortPath(L: number) {
  return `M-100 0 L100 0 L90 ${L} L-90 ${L} Z`;
}
function stitchPath(kind: "long" | "short", L: number) {
  const i = 13;
  if (kind === "long")
    return `M${-100 + i} 34 L${-90 + i} ${L - 92} C ${-90 + i} ${L - 46}, -40 ${L - i}, 0 ${L - i} C 40 ${L - i}, ${90 - i} ${L - 46}, ${90 - i} ${L - 92} L${100 - i} 34`;
  return `M${-100 + i} 34 L${-90 + i} ${L - 16} M${100 - i} 34 L${90 - i} ${L - 16}`;
}

export function buckle(p: string, y: number): string {
  // tang buckle, 18 mm inner width
  const top = y - 10;
  const outer = `M-118 ${top} L118 ${top} L118 ${top + 70} C 118 ${top + 128}, 72 ${top + 150}, 0 ${top + 150} C -72 ${top + 150}, -118 ${top + 128}, -118 ${top + 70} Z`;
  const inner = `M-96 ${top + 16} L96 ${top + 16} L96 ${top + 70} C 96 ${top + 114}, 60 ${top + 128}, 0 ${top + 128} C -60 ${top + 128}, -96 ${top + 114}, -96 ${top + 70} Z`;
  return `<g>
    <path d="${outer}" transform="translate(7 10)" fill="#000" opacity="0.35" filter="url(#${p}soft)"/>
    <path d="${outer} ${inner}" fill-rule="evenodd" fill="url(#${p}steel)"/>
    <path d="${outer}" fill="none" stroke="#fff" stroke-opacity="0.55" stroke-width="1.6"/>
    <path d="${inner}" fill="none" stroke="#3b3a37" stroke-opacity="0.6" stroke-width="1.6"/>
    <rect x="-9" y="${top - 6}" width="18" height="${150 - 18}" rx="9" fill="#000" opacity="0.28" transform="translate(4 6)" filter="url(#${p}contact)"/>
    <rect x="-8" y="${top - 8}" width="16" height="${150 - 20}" rx="8" fill="url(#${p}brushV)"/>
    <rect x="-8" y="${top - 8}" width="16" height="${150 - 20}" rx="8" fill="none" stroke="#444" stroke-opacity="0.5" stroke-width="1"/>
  </g>`;
}

export function strap(o: StrapOpts): string {
  const { c, p, kind } = o;
  const L = o.length ?? (kind === "long" ? 1150 : 750);
  const d = kind === "long" ? longPath(L) : shortPath(L);
  const clip = `${p}${kind}clip${o.reverse ? "r" : ""}`;
  const fillId = `${p}print`;
  const fill = o.reverse ? c.lining : `url(#${fillId})`;
  const holes =
    kind === "long"
      ? Array.from({ length: 7 }, (_, k) => {
          const y = L - 150 - k * 62;
          return `<g transform="translate(0 ${y})">
            <ellipse rx="13" ry="16" fill="#000" opacity="0.18" transform="translate(1.5 2)"/>
            <ellipse rx="11.5" ry="14" fill="${mix(c.thread, "#000000", 0.25)}"/>
            <ellipse rx="7.2" ry="9.4" fill="#0d0c0b"/>
            <path d="M-10 -6 A 11.5 14 0 0 1 8 -10" fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="1.4"/>
          </g>`;
        }).join("")
      : "";
  const keepers =
    kind === "short"
      ? [L - 70, L - 165]
          .map(
            (y, k) => `<g transform="translate(0 ${y})">
          <rect x="-112" y="-14" width="224" height="34" rx="6" fill="#000" opacity="0.35" filter="url(#${p}contact)" transform="translate(3 5)"/>
          <rect x="-110" y="-16" width="220" height="32" rx="7" fill="${c.keeper}"/>
          <rect x="-110" y="-16" width="220" height="32" rx="7" fill="url(#${p}vol)" opacity="0.9"/>
          <rect x="-110" y="-16" width="220" height="32" rx="7" fill="url(#${p}twill)" opacity="0.25"/>
          <path d="M-100 -9 L100 -9 M-100 9 L100 9" stroke="${c.thread}" stroke-width="1.6" stroke-dasharray="7 5" opacity="${k === 0 ? 0.8 : 0.65}"/>
          <rect x="-110" y="-16" width="220" height="5" rx="2.5" fill="#fff" opacity="0.1"/>
        </g>`,
          )
          .join("")
      : "";
  const texture = o.lite
    ? `<rect x="-110" y="0" width="220" height="${L}" fill="url(#${p}twill)" opacity="0.22"/>`
    : `<rect x="-110" y="0" width="220" height="${L}" filter="url(#${p}weave)" opacity="0.32" style="mix-blend-mode:multiply"/>
       <rect x="-110" y="0" width="220" height="${L}" filter="url(#${p}fibre)" opacity="0.22" style="mix-blend-mode:multiply"/>`;
  const printLayer = o.reverse
    ? `<rect x="-110" y="-2" width="220" height="${L + 4}" fill="${fill}"/>`
    : o.lite
      ? `<rect x="-110" y="-2" width="220" height="${L + 4}" fill="${fill}"/>`
      : `<rect x="-110" y="-2" width="220" height="${L + 4}" fill="${c.ground}"/>
         <g filter="url(#${p}bleed)"><rect x="-110" y="-2" width="220" height="${L + 4}" fill="${fill}" mask="url(#${p}inkM${kind})"/></g>`;
  const sh = o.flip ? -1 : 1;
  const bkl = kind === "short" && o.buckle !== false ? buckle(p, L) : "";
  return `<g>
    <defs>
      <clipPath id="${clip}"><path d="${d}"/></clipPath>
      ${o.lite || o.reverse ? "" : `<mask id="${p}inkM${kind}" maskUnits="userSpaceOnUse" x="-120" y="-10" width="240" height="${L + 20}"><rect x="-120" y="-10" width="240" height="${L + 20}" filter="url(#${p}inkMask)"/></mask>`}
    </defs>
    ${kind === "short" ? `<rect x="-90" y="${L - 30}" width="180" height="40" fill="${c.lining}"/>` : ""}
    <path d="${d}" transform="translate(${sh * 10} ${sh * 14})" fill="#000" opacity="0.32" filter="url(#${p}soft)"/>
    <path d="${d}" transform="translate(${sh * 2} ${sh * 3})" fill="#000" opacity="0.4" filter="url(#${p}contact)"/>
    <path d="${d}" transform="translate(${sh * 3.5} ${sh * 5})" fill="${mix(o.reverse ? c.lining : c.ground, "#000000", 0.62)}"/>
    <g clip-path="url(#${clip})">
      ${printLayer}
      ${texture}
      <rect x="-110" y="0" width="220" height="${L}" fill="url(#${p}vol)"/>
      <rect x="-110" y="0" width="220" height="70" fill="url(#${p}fold)" opacity="0.7"/>
      <path d="${d}" fill="none" stroke="#000" stroke-opacity="0.32" stroke-width="9"/>
      <path d="${d}" fill="none" stroke="#fff" stroke-opacity="0.12" stroke-width="2.4" transform="translate(-1.2 -1)"/>
    </g>
    <path d="${stitchPath(kind, L)}" fill="none" stroke="#000" stroke-opacity="0.35" stroke-width="3" stroke-dasharray="11 6.5" stroke-linecap="round" transform="translate(0.9 1.2)"/>
    <path d="${stitchPath(kind, L)}" fill="none" stroke="${c.thread}" stroke-width="2.6" stroke-dasharray="11 6.5" stroke-linecap="round"${o.lite ? "" : ` filter="url(#${p}bleed)"`}/>
    <path d="${stitchPath(kind, L)}" fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="0.8" stroke-dasharray="9 8.5" stroke-dashoffset="-1" stroke-linecap="round" transform="translate(-0.5 -0.6)"/>
    <path d="M-87 20 L87 20" stroke="${c.thread}" stroke-width="2.3" stroke-dasharray="11 6.5" stroke-linecap="round" opacity="0.9"/>
    ${holes}
    ${keepers}
    ${bkl}
  </g>`;
}

/* ------------------------------------------------------------------ */
/* Watch head                                                          */
/* ------------------------------------------------------------------ */

export interface WatchOpts {
  p: string;
  dial?: string;
  dialDark?: boolean;
  hours?: number;
  minutes?: number;
  seconds?: number;
  light?: number; // light angle (deg)
}

function ringWedges(r1: number, r2: number, n: number, colorAt: (a: number) => string): string {
  let out = "";
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2;
    const a1 = ((i + 1.05) / n) * Math.PI * 2;
    const p = [
      [r1 * Math.cos(a0), r1 * Math.sin(a0)],
      [r2 * Math.cos(a0), r2 * Math.sin(a0)],
      [r2 * Math.cos(a1), r2 * Math.sin(a1)],
      [r1 * Math.cos(a1), r1 * Math.sin(a1)],
    ];
    out += `<path d="M${f(p[0][0])} ${f(p[0][1])} L${f(p[1][0])} ${f(p[1][1])} A${r2} ${r2} 0 0 1 ${f(p[2][0])} ${f(p[2][1])} L${f(p[3][0])} ${f(p[3][1])} A${r1} ${r1} 0 0 0 ${f(p[0][0])} ${f(p[0][1])}Z" fill="${colorAt(a0 + Math.PI / n)}"/>`;
  }
  return out;
}

function grey(v: number) {
  const x = Math.max(0, Math.min(255, Math.round(v)));
  return `rgb(${x},${x},${Math.max(0, x - 4)})`;
}

export function watchHead(o: WatchOpts): string {
  const p = o.p;
  const dial = o.dial ?? "#ECE8DF";
  const L = ((o.light ?? -130) * Math.PI) / 180;
  const hh = o.hours ?? 10;
  const mm = o.minutes ?? 9;
  const ss = o.seconds ?? 36;
  const polished = (a: number) => {
    const t = 0.5 + 0.5 * Math.cos(2 * (a - L));
    const t2 = 0.5 + 0.5 * Math.cos(3 * (a - L) + 1.1);
    return grey(48 + 200 * Math.pow(t, 5) + 70 * Math.pow(t2, 3) + 20 * Math.cos(a - L));
  };
  const bezel = (a: number) => {
    const t = Math.cos(a - L);
    return grey(150 + 80 * t + 18 * Math.cos(4 * a + 0.4));
  };
  const dc = hexToRgb(dial);
  const sun = (a: number) => {
    const t = Math.pow(Math.abs(Math.cos(a - L - 0.35)), 10);
    const v = (x: number) => Math.round(Math.max(0, Math.min(255, x * (0.86 + 0.2 * t) + (o.dialDark ? 70 : 22) * t)));
    return `rgb(${v(dc[0])},${v(dc[1])},${v(dc[2])})`;
  };
  const ink = o.dialDark ? "#d9d4c8" : "#2b2b2b";
  const ticks = Array.from({ length: 60 }, (_, i) => {
    if (i % 5 === 0) return "";
    const a = (i / 60) * Math.PI * 2;
    return `<line x1="${f(Math.sin(a) * 158)}" y1="${f(-Math.cos(a) * 158)}" x2="${f(Math.sin(a) * 165)}" y2="${f(-Math.cos(a) * 165)}"/>`;
  }).join("");
  const indices = Array.from({ length: 12 }, (_, i) => {
    const rot = i * 30;
    const double = i === 0;
    const bar = (dx: number) =>
      `<g transform="translate(${dx} 0)">
        <rect x="-4.5" y="-156" width="9" height="${double ? 36 : 32}" rx="1" fill="#000" opacity="0.45" transform="translate(2.5 4)" filter="url(#${p}contact)"/>
        <rect x="-4.5" y="-156" width="9" height="${double ? 36 : 32}" rx="1" fill="#8c8a85"/>
        <rect x="-4.5" y="-156" width="4.5" height="${double ? 36 : 32}" fill="#f7f6f2"/>
        <rect x="-4.5" y="-156" width="9" height="${double ? 36 : 32}" rx="1" fill="none" stroke="#3d3c39" stroke-width="0.7" stroke-opacity="0.7"/>
      </g>`;
    return `<g transform="rotate(${rot})">${double ? bar(-6.5) + bar(6.5) : bar(0)}</g>`;
  }).join("");
  const dauphine = (len: number, w: number) =>
    `<path d="M0 ${-len} L${w / 2} -12 L0 22 Z" fill="#8f8d87"/><path d="M0 ${-len} L${-w / 2} -12 L0 22 Z" fill="#f7f6f1"/><path d="M0 ${-len} L${w / 2} -12 L0 22 L${-w / 2} -12Z" fill="none" stroke="#4a4945" stroke-width="0.6" stroke-opacity="0.6"/>`;
  const handsAt = (dx: number, dy: number, op: number, shadow: boolean) => {
    const hA = (hh % 12) * 30 + mm * 0.5;
    const mA = mm * 6 + ss * 0.1;
    const sA = ss * 6;
    const fil = shadow ? `fill="#000" opacity="${op}" filter="url(#${p}handShadow)"` : "";
    if (shadow)
      return `<g transform="translate(${dx} ${dy})" ${fil}>
        <path d="M0 -100 L7 -12 L0 22 L-7 -12Z" transform="rotate(${hA})"/>
        <path d="M0 -150 L5.5 -12 L0 22 L-5.5 -12Z" transform="rotate(${mA})"/>
        <rect x="-0.9" y="-156" width="1.8" height="194" transform="rotate(${sA})"/>
      </g>`;
    return `<g>
      <g transform="rotate(${hA})">${dauphine(104, 17)}</g>
      <g transform="rotate(${mA})">${dauphine(152, 13)}</g>
      <g transform="rotate(${sA})"><rect x="-0.85" y="-156" width="1.7" height="194" fill="${o.dialDark ? "#B39662" : "#7d2f26"}"/><circle cy="26" r="4.4" fill="${o.dialDark ? "#B39662" : "#7d2f26"}"/></g>
      <circle r="6.5" fill="url(#${p}steel)"/><circle r="2" fill="#555"/>
    </g>`;
  };
  const lug = (sx: number, sy: number) =>
    `<g transform="scale(${sx} ${sy})">
      <path d="M98 -150 L100 -222 C 100 -238, 130 -240, 132 -224 L 134 -150 Z" fill="url(#${p}brushV)"/>
      <path d="M100 -222 C 100 -238, 130 -240, 132 -224" fill="none" stroke="#fff" stroke-opacity="0.6" stroke-width="1.4"/>
      <path d="M98 -150 L100 -222" stroke="#000" stroke-opacity="0.35" stroke-width="1.5"/>
    </g>`;
  return `<g>
    <circle r="214" transform="translate(22 34)" fill="#000" opacity="0.5" filter="url(#${p}deep)"/>
    <circle r="208" transform="translate(5 8)" fill="#000" opacity="0.45" filter="url(#${p}contact)"/>
    <rect x="-140" y="-255" width="280" height="510" rx="40" transform="translate(18 28)" fill="#000" opacity="0.3" filter="url(#${p}soft)"/>
    ${lug(1, 1)}${lug(-1, 1)}${lug(1, -1)}${lug(-1, -1)}
    <g transform="translate(206 0)">
      <rect x="0" y="-11" width="12" height="22" fill="url(#${p}brushV)"/>
      <rect x="10" y="-22" width="22" height="44" rx="4" fill="url(#${p}steel)"/>
      ${Array.from({ length: 9 }, (_, i) => `<line x1="${12 + i * 2.3}" y1="-21" x2="${12 + i * 2.3}" y2="21" stroke="#555" stroke-opacity="0.5" stroke-width="0.8"/>`).join("")}
    </g>
    <circle r="206" fill="url(#${p}steel)"/>
    ${ringWedges(190, 206, 360, polished)}
    ${ringWedges(176, 190, 360, bezel)}
    <circle r="206" fill="none" stroke="#3a3936" stroke-opacity="0.55" stroke-width="1.6"/>
    <circle r="190" fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="1"/>
    <circle r="176" fill="${mix(dial, "#000000", 0.35)}"/>
    <circle r="172" fill="${dial}"/>
    ${ringWedges(0.01, 172, 240, sun)}
    <circle r="172" fill="url(#${p}dialEdge)"/>
    <g stroke="${ink}" stroke-width="1.3" opacity="0.75">${ticks}</g>
    <circle r="166.5" fill="none" stroke="${ink}" stroke-opacity="0.5" stroke-width="0.7"/>
    <circle r="156.5" fill="none" stroke="${ink}" stroke-opacity="0.35" stroke-width="0.5"/>
    ${indices}
    ${handsAt(6, 11, 0.5, true)}
    ${handsAt(0, 0, 1, false)}
    <circle r="172" fill="url(#${p}crystal)"/>
    <path d="M-150 -60 A 162 162 0 0 1 -40 -158 A 175 175 0 0 0 -136 -48 Z" fill="#fff" opacity="0.16"/>
    <path d="M60 150 A 165 165 0 0 0 150 70" fill="none" stroke="#fff" stroke-opacity="0.12" stroke-width="6"/>
  </g>`;
}

export function watchDefs(p: string): string {
  return `<radialGradient id="${p}dialEdge" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0.86" stop-color="#000" stop-opacity="0"/>
      <stop offset="0.97" stop-color="#000" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.4"/>
    </radialGradient>
    <filter id="${p}deep" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22"/></filter>
    <radialGradient id="${p}crystal" cx="0.42" cy="0.38" r="0.7">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/>
      <stop offset="0.82" stop-color="#fff" stop-opacity="0.03"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.12"/>
    </radialGradient>`;
}

/** Fully assembled watch on strap (vertical, centred at 0,0). */
export function assembledWatch(o: {
  c: Colorway;
  p: string;
  dial?: string;
  dialDark?: boolean;
  lite?: boolean;
  longLen?: number;
  shortLen?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}): string {
  const top = strap({ c: o.c, p: o.p, kind: "short", length: o.shortLen ?? 750, lite: o.lite, flip: true });
  const bottom = strap({ c: o.c, p: o.p, kind: "long", length: o.longLen ?? 1150, lite: o.lite });
  return `<g>
    <g transform="translate(0 -212) rotate(180)">${top}</g>
    <g transform="translate(0 212)">${bottom}</g>
    ${watchHead({ p: o.p, dial: o.dial, dialDark: o.dialDark, hours: o.hours, minutes: o.minutes, seconds: o.seconds })}
  </g>`;
}
