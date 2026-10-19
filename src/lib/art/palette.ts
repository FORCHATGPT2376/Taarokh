/**
 * Colourways for TAAROKH concept strap prints.
 * These drive both the pre-rendered concept imagery (scripts/render-art.ts)
 * and the live strap selector on the homepage.
 */
export type PrintKind = "buti" | "jaal" | "arcade";

export interface Colorway {
  id: string;
  kind: PrintKind;
  ground: string;
  /** primary motif colour */
  ink: string;
  /** secondary accent (flower centre, small fills) */
  accent: string;
  /** leaves / tertiary */
  leaf: string;
  /** fine outline ("rekh"); empty for none */
  rekh: string;
  /** stitching thread */
  thread: string;
  /** underside / lining */
  lining: string;
  /** keeper loops */
  keeper: string;
  /** motif scale multiplier */
  scale?: number;
}

export const colorways: Record<string, Colorway> = {
  indigo: {
    id: "indigo",
    kind: "buti",
    ground: "#22324A",
    ink: "#ECE3D2",
    accent: "#B8705F",
    leaf: "#8197A5",
    rekh: "",
    thread: "#D8CAB0",
    lining: "#1D1D20",
    keeper: "#1F2C40",
  },
  ivory: {
    id: "ivory",
    kind: "buti",
    ground: "#EEE6D6",
    ink: "#2C3F5C",
    accent: "#A65646",
    leaf: "#6E7B58",
    rekh: "#2A2622",
    thread: "#CBBDA3",
    lining: "#3A2E25",
    keeper: "#E3D8C5",
  },
  rose: {
    id: "rose",
    kind: "buti",
    ground: "#B57C76",
    ink: "#F2E8DA",
    accent: "#76383A",
    leaf: "#E5D2BE",
    rekh: "",
    thread: "#EBDCC9",
    lining: "#3A2A28",
    keeper: "#A86F69",
  },
  earth: {
    id: "earth",
    kind: "jaal",
    ground: "#D3B98C",
    ink: "#2A211B",
    accent: "#9A472C",
    leaf: "#6B5534",
    rekh: "",
    thread: "#3A2E24",
    lining: "#2E241D",
    keeper: "#3A2E24",
  },
  midnight: {
    id: "midnight",
    kind: "jaal",
    ground: "#1D2737",
    ink: "#C8B38A",
    accent: "#A65A3C",
    leaf: "#7E8DA2",
    rekh: "",
    thread: "#C8B38A",
    lining: "#17181B",
    keeper: "#1B2433",
  },
  noir: {
    id: "noir",
    kind: "arcade",
    ground: "#1C1B1A",
    ink: "#B39662",
    accent: "#8C7448",
    leaf: "#2A2826",
    rekh: "",
    thread: "#A88D5C",
    lining: "#121212",
    keeper: "#1A1918",
  },
  courtyard: {
    id: "courtyard",
    kind: "arcade",
    ground: "#E9E1D1",
    ink: "#2A3C57",
    accent: "#D6C7AC",
    leaf: "#C9B89A",
    rekh: "",
    thread: "#BFAF92",
    lining: "#4A3A2C",
    keeper: "#2A3C57",
  },
};

export type ColorwayId = keyof typeof colorways;
