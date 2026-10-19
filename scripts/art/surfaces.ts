/**
 * Procedural surfaces and photographic finishing for concept renders.
 * All output is original SVG markup.
 */
import { noiseMatrix } from "../../src/lib/art/svg";

export type Surface = "sandstone" | "linen" | "slate" | "studio" | "indigoCloth" | "studioDark" | "pinkstone";

export function surface(kind: Surface, W: number, H: number, id: string, seed = 2): string {
  switch (kind) {
    case "sandstone":
      return stone(W, H, id, seed, "#B88E6A", "#8F6A4E", "#E0C2A0");
    case "pinkstone":
      return stone(W, H, id, seed, "#C3816F", "#9A5B4D", "#E3AB97");
    case "linen":
      return `
      <filter id="${id}f" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.9 0.012" numOctaves="2" seed="${seed}" result="h"/>
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.9" numOctaves="2" seed="${seed + 3}" result="v"/>
        <feComposite in="h" in2="v" operator="arithmetic" k1="0" k2="0.5" k3="0.5" k4="0" result="hv"/>
        <feColorMatrix in="hv" type="matrix" values="${noiseMatrix("#CFC5B3", "#F5EFE4", 2.4)}"/>
      </filter>
      <rect width="${W}" height="${H}" fill="#E6DECF"/>
      <rect width="${W}" height="${H}" filter="url(#${id}f)"/>`;
    case "slate":
      return `
      <filter id="${id}f" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="5" seed="${seed}" result="a"/>
        <feColorMatrix in="a" type="matrix" values="${noiseMatrix("#121212", "#2E2C2A", 1.8)}"/>
      </filter>
      <rect width="${W}" height="${H}" fill="#1B1A19"/>
      <rect width="${W}" height="${H}" filter="url(#${id}f)"/>`;
    case "studioDark":
      return `
      <radialGradient id="${id}g" cx="0.5" cy="0.42" r="0.75">
        <stop offset="0" stop-color="#2A2826"/><stop offset="1" stop-color="#0F0F0F"/>
      </radialGradient>
      <rect width="${W}" height="${H}" fill="url(#${id}g)"/>`;
    case "indigoCloth":
      return `
      <filter id="${id}f" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.0022 0.006" numOctaves="3" seed="${seed}" result="a"/>
        <feColorMatrix in="a" type="matrix" values="${noiseMatrix("#0E1724", "#3A5274", 2.6)}"/>
      </filter>
      <rect width="${W}" height="${H}" fill="#203048"/>
      <rect width="${W}" height="${H}" filter="url(#${id}f)"/>`;
    case "studio":
    default:
      return `
      <linearGradient id="${id}g" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0" stop-color="#F3EEE5"/><stop offset="1" stop-color="#E2D9CA"/>
      </linearGradient>
      <rect width="${W}" height="${H}" fill="url(#${id}g)"/>`;
  }
}

function stone(W: number, H: number, id: string, seed: number, base: string, dark: string, light: string): string {
  return `
      <filter id="${id}a" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.0018 0.0042" numOctaves="3" seed="${seed}"/>
        <feColorMatrix type="matrix" values="${noiseMatrix(dark, light, 0.9)}"/>
      </filter>
      <filter id="${id}b" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.035 0.09" numOctaves="4" seed="${seed + 5}"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.2 0 0 0 1.25"/>
      </filter>
      <filter id="${id}c" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="1" seed="${seed + 8}"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -9 0 0 0 3.6"/>
      </filter>
      <rect width="${W}" height="${H}" fill="${base}"/>
      <rect width="${W}" height="${H}" filter="url(#${id}a)"/>
      <rect width="${W}" height="${H}" filter="url(#${id}b)" opacity="0.16"/>
      <rect width="${W}" height="${H}" filter="url(#${id}c)" opacity="0.22"/>`;
}

/** Light pool + vignette. `lx, ly` are 0..1 light position. */
export function lighting(W: number, H: number, id: string, lx = 0.3, ly = 0.25, strength = 1, warm = "#FFE9C7"): string {
  return `
  <radialGradient id="${id}L" cx="${lx}" cy="${ly}" r="0.85" gradientUnits="objectBoundingBox">
    <stop offset="0" stop-color="${warm}" stop-opacity="${0.42 * strength}"/>
    <stop offset="0.45" stop-color="${warm}" stop-opacity="${0.08 * strength}"/>
    <stop offset="1" stop-color="${warm}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="${id}V" cx="0.5" cy="0.5" r="0.75">
    <stop offset="0.5" stop-color="#000" stop-opacity="0"/>
    <stop offset="1" stop-color="#000" stop-opacity="${0.55 * strength}"/>
  </radialGradient>
  <rect width="${W}" height="${H}" fill="url(#${id}L)" style="mix-blend-mode:screen"/>
  <rect width="${W}" height="${H}" fill="url(#${id}V)" style="mix-blend-mode:multiply"/>`;
}

/** Shadow of a jaali (pierced screen) falling across the scene. */
export function jaaliShadow(W: number, H: number, id: string, opacity = 0.5, cell = 150, transform = "skewX(-28) rotate(-8)", region?: { cx: number; cy: number; r: number }): string {
  const c = cell;
  const r = c * 0.36;
  // eight-point star openings in a lattice; the shadow is the solid lattice
  const star = (cx: number, cy: number) => {
    const pts: string[] = [];
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const rr = i % 2 === 0 ? r : r * 0.62;
      pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`);
    }
    return `<polygon points="${pts.join(" ")}"/>`;
  };
  return `
  <pattern id="${id}p" patternUnits="userSpaceOnUse" width="${c}" height="${c}">
    <rect width="${c}" height="${c}" fill="#fff"/>
    <g fill="#000">${star(c / 2, c / 2)}<circle cx="0" cy="0" r="${c * 0.12}"/><circle cx="${c}" cy="0" r="${c * 0.12}"/><circle cx="0" cy="${c}" r="${c * 0.12}"/><circle cx="${c}" cy="${c}" r="${c * 0.12}"/></g>
  </pattern>
  <filter id="${id}b" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${c * 0.028}"/></filter>
  <mask id="${id}m" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}">
    <g filter="url(#${id}b)"><rect x="${-W}" y="${-H}" width="${W * 3}" height="${H * 3}" fill="url(#${id}p)" transform="translate(${W / 2} ${H / 2}) ${transform} translate(${-W / 2} ${-H / 2})"/></g>
  </mask>
  <rect width="${W}" height="${H}" fill="#2A1608" opacity="${opacity}" mask="url(#${id}m)" style="mix-blend-mode:multiply"/>
  ${
    region
      ? `<radialGradient id="${id}rg" cx="${region.cx}" cy="${region.cy}" r="${region.r}"><stop offset="0.55" stop-color="#2A1608" stop-opacity="0"/><stop offset="1" stop-color="#2A1608" stop-opacity="${opacity}"/></radialGradient>
  <rect width="${W}" height="${H}" fill="url(#${id}rg)" style="mix-blend-mode:multiply"/>`
      : ""
  }`;
}

/** Film grain over everything. */
export function grain(W: number, H: number, id: string, amount = 0.07, seed = 11): string {
  return `
  <filter id="${id}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="${seed}" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <rect width="${W}" height="${H}" filter="url(#${id})" opacity="${amount}" style="mix-blend-mode:overlay"/>`;
}

export function svgDoc(W: number, H: number, body: string): string {
  return `<!doctype html><html><head><style>html,body{margin:0;padding:0;background:#000}svg{display:block}</style></head><body>
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${body}</svg></body></html>`;
}
