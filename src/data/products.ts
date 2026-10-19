import type { Product, Spec, Variant, VariantStatus } from "@/types/catalog";

/**
 * TAAROKH catalogue — CATALOGUE PREVIEW DATA.
 *
 * Names, prices, SKUs and specifications follow the proposed v1 assortment in
 * the business plan. None of these straps has been released for sale: every
 * product is `status: "preview"`, prices are hypotheses (`priceConfirmed:
 * false`) and stock is `null` (not configured).
 *
 * To launch a product: set its status to "live", set real `stock` on each
 * QC-released variant, mark verified specs `verified: true`, replace concept
 * images with photographs of the actual strap, and set `priceConfirmed: true`.
 */

const LONG = 115;
const SHORT = 75;

function variants(code: string, widths: { w: number; status: VariantStatus }[]): Variant[] {
  return widths.map(({ w, status }) => ({
    id: `${code}-${w}`,
    sku: `${code}-${w}`,
    lugWidthMm: w,
    buckleWidthMm: w - 2,
    lengthLabel: "Standard",
    longPieceMm: LONG,
    shortPieceMm: SHORT,
    status,
    stock: null,
  }));
}

const launchWidths = [
  { w: 18, status: "preview" as const },
  { w: 20, status: "preview" as const },
  { w: 22, status: "preview" as const },
];
const launchOnly = launchWidths;

function specs(outer: string, extra: Spec[] = []): Spec[] {
  return [
    { label: "Strap form", value: "Two-piece strap for standard spring-bar lugs", verified: false },
    { label: "Lug width", value: "18 mm, 20 mm or 22 mm", verified: false },
    { label: "Taper", value: "Tapers 2 mm towards the buckle, e.g. 20 mm to 18 mm (target)", verified: false },
    { label: "Length", value: `Approx. ${LONG} mm long piece + ${SHORT} mm buckle piece (target)`, verified: false },
    { label: "Outer", value: outer, verified: false },
    { label: "Lining", value: "Comfort lining — material to be confirmed after wear testing", verified: false },
    { label: "Hardware", value: "Corrosion-resistant tang buckle and spring bars — finish to be confirmed", verified: false },
    { label: "Attachment", value: "Quick-release spring bars only if strength and fit checks pass", verified: false },
    ...extra,
  ];
}

const careFabric = [
  "Keep dry when possible. Treat it as a textile accessory, not a waterproof strap.",
  "Wipe gently with a soft, dry cloth. Do not machine wash.",
  "Remove before swimming, showering or exercise that causes heavy sweating.",
  "Store flat, away from direct sunlight, to protect printed colours.",
];

const constructionStd = [
  "Printed textile outer, reinforced and lined for structure and comfort.",
  "Stitched edges with reinforcement at the spring-bar and buckle ends.",
  "Edges sealed and tested against fraying before release.",
];

const provenancePending =
  "Design inspired by traditional motifs. The fabric source, printing method and place of assembly will be stated here once verified for this product.";

export const products: Product[] = [
  {
    id: "tar-san-ind",
    handle: "sanganer-indigo",
    name: "Sanganer Indigo",
    design: "Indigo Buti",
    collection: "sanganer",
    status: "preview",
    featured: true,
    price: 1199,
    priceConfirmed: false,
    currency: "INR",
    color: "Indigo",
    swatch: "#22324A",
    colorway: "indigo",
    material: "Printed cotton canvas",
    shortDescription: "A small ivory buti on a deep indigo ground, with a dark, comfortable underside.",
    description: [
      "Sanganer Indigo is our first study: a six-petal flower in warm ivory, centred with a touch of madder, repeated in a half-drop across a deep indigo ground.",
      "The motif is drawn at the scale of a watch strap — large enough to read from across a table, small enough to stay calm beside a polished case and a white dial.",
    ],
    inspiration:
      "Sanganeri printing is associated with fine, closely observed florals on light and indigo grounds. We redrew the buti from first principles for a 20 mm strap rather than reproducing any existing block.",
    provenance: provenancePending,
    images: [
      { src: "/images/products/sanganer-indigo/02-on-watch.jpg", alt: "Concept render: an unbranded steel watch with an ivory dial on the Sanganer Indigo strap, on linen.", note: "Concept render" },
      { src: "/images/products/sanganer-indigo/01-front.jpg", alt: "Concept render: both pieces of the Sanganer Indigo strap laid flat — the long piece with holes and the buckle piece.", note: "Concept render" },
      { src: "/images/products/sanganer-indigo/03-detail.jpg", alt: "Concept render: close-up of the indigo floral print, edge stitching and strap holes.", note: "Concept render" },
      { src: "/images/products/sanganer-indigo/04-buckle.jpg", alt: "Concept render: the tang buckle and keepers on the indigo buckle piece.", note: "Concept render" },
    ],
    specs: specs("Tightly woven printed cotton or canvas — exact composition to be confirmed"),
    construction: constructionStd,
    buckle: "Silver-toned tang buckle, 18 mm (target)",
    care: careFabric,
    variants: variants("TAR-SAN-IND", launchWidths),
    related: ["sanganer-ivory", "bagru-midnight", "jaipur-rose"],
    seo: {
      title: "Sanganer Indigo — Watch Strap, 18/20/22 mm",
      description: "An indigo watch strap with a small ivory floral buti, inspired by Sanganeri printing. Available in 18, 20 and 22 mm for analog watches with standard lugs.",
    },
    createdAt: "2026-10-19",
  },
  {
    id: "tar-san-ivr",
    handle: "sanganer-ivory",
    name: "Sanganer Ivory",
    design: "Ivory Buti",
    collection: "sanganer",
    status: "preview",
    featured: true,
    price: 1199,
    priceConfirmed: false,
    currency: "INR",
    color: "Ivory",
    swatch: "#EEE6D6",
    colorway: "ivory",
    material: "Printed cotton canvas",
    shortDescription: "Indigo florals with a fine dark outline on a warm ivory ground.",
    description: [
      "The lighter counterpart to Sanganer Indigo. Indigo petals carry a fine dark outline — a nod to the rekh, the outline block used in many floral prints — with olive leaves and a madder centre.",
      "On a dark or blue dial it reads crisp and summery; on a cream dial, softly tonal.",
    ],
    inspiration:
      "Light grounds and outlined florals are characteristic of much Sanganeri work. This colourway explores how far an outline can sharpen a very small motif.",
    provenance: provenancePending,
    images: [
      { src: "/images/products/sanganer-ivory/02-on-watch.jpg", alt: "Concept render: an unbranded watch with a deep blue dial on the Sanganer Ivory strap, on sandstone.", note: "Concept render" },
      { src: "/images/products/sanganer-ivory/01-front.jpg", alt: "Concept render: both pieces of the Sanganer Ivory strap laid flat.", note: "Concept render" },
      { src: "/images/products/sanganer-ivory/03-detail.jpg", alt: "Concept render: close-up of outlined indigo flowers on ivory, with edge stitching.", note: "Concept render" },
      { src: "/images/products/sanganer-ivory/04-buckle.jpg", alt: "Concept render: tang buckle and keepers on the ivory buckle piece.", note: "Concept render" },
    ],
    specs: specs("Tightly woven printed cotton or canvas — exact composition to be confirmed"),
    construction: constructionStd,
    buckle: "Silver-toned tang buckle, 18 mm (target)",
    care: [...careFabric, "Lighter grounds show marks more readily; spot-clean promptly with a barely damp cloth."],
    variants: variants("TAR-SAN-IVR", launchOnly),
    related: ["sanganer-indigo", "jharokha-ivory", "bagru-earth"],
    seo: {
      title: "Sanganer Ivory — Watch Strap, 18/20/22 mm",
      description: "An ivory fabric watch strap with small outlined indigo florals, inspired by Sanganeri printing. Available in 18, 20 and 22 mm.",
    },
    createdAt: "2026-10-19",
  },
  {
    id: "tar-san-ros",
    handle: "jaipur-rose",
    name: "Jaipur Rose",
    design: "Rose Buti",
    collection: "sanganer",
    status: "preview",
    featured: false,
    price: 1199,
    priceConfirmed: false,
    currency: "INR",
    color: "Rose",
    swatch: "#B57C76",
    colorway: "rose",
    material: "Printed cotton canvas",
    shortDescription: "Ivory butis on a muted rose ground — the colour of the old city's walls, softened.",
    description: [
      "Jaipur Rose takes the Sanganer buti and sets it on a dusty, muted rose — closer to weathered lime-wash than to anything bright.",
      "It is the most expressive strap in the preview collection, and pairs best with a simple cream or silver dial.",
    ],
    inspiration:
      "Jaipur's old city has been washed in its characteristic terracotta-pink since the nineteenth century. We used a softened version of that tone as a ground for the floral buti.",
    provenance: provenancePending,
    images: [
      { src: "/images/products/jaipur-rose/02-on-watch.jpg", alt: "Concept render: an unbranded watch with a cream dial on the Jaipur Rose strap, on linen.", note: "Concept render" },
      { src: "/images/products/jaipur-rose/01-front.jpg", alt: "Concept render: both pieces of the Jaipur Rose strap laid flat.", note: "Concept render" },
      { src: "/images/products/jaipur-rose/03-detail.jpg", alt: "Concept render: close-up of ivory flowers on a rose ground.", note: "Concept render" },
      { src: "/images/products/jaipur-rose/04-buckle.jpg", alt: "Concept render: tang buckle and rose keepers.", note: "Concept render" },
    ],
    specs: specs("Tightly woven printed cotton or canvas — exact composition to be confirmed"),
    construction: constructionStd,
    buckle: "Silver-toned tang buckle, 18 mm (target)",
    care: careFabric,
    variants: variants("TAR-SAN-ROS", launchOnly),
    related: ["sanganer-indigo", "sanganer-ivory", "jharokha-ivory"],
    seo: {
      title: "Jaipur Rose — Watch Strap, 18/20/22 mm",
      description: "A muted rose watch strap with small ivory florals, inspired by Jaipur's colour and Sanganeri printing. Available in 18, 20 and 22 mm.",
    },
    createdAt: "2026-10-19",
  },
  {
    id: "tar-bag-ear",
    handle: "bagru-earth",
    name: "Bagru Earth",
    design: "Earth Jaal",
    collection: "bagru",
    status: "preview",
    featured: true,
    price: 1199,
    priceConfirmed: false,
    currency: "INR",
    color: "Earth",
    swatch: "#D3B98C",
    colorway: "earth",
    material: "Printed cotton canvas",
    shortDescription: "An ochre ground with a black ogee lattice and small madder-red flowers.",
    description: [
      "Bagru Earth is built on structure: a black ogee lattice — the jaal — with a four-petal madder flower at every junction and a small diamond at the centre of each cell.",
      "It is a warm, grounded strap that suits field watches, cream dials and brushed cases.",
    ],
    inspiration:
      "Bagru printing is associated with earthy grounds and black and red inks. We drew an original lattice that keeps that palette and sense of order.",
    provenance: provenancePending,
    images: [
      { src: "/images/products/bagru-earth/02-on-watch.jpg", alt: "Concept render: an unbranded watch with a cream dial on the Bagru Earth strap, on sandstone.", note: "Concept render" },
      { src: "/images/products/bagru-earth/01-front.jpg", alt: "Concept render: both pieces of the Bagru Earth strap laid flat.", note: "Concept render" },
      { src: "/images/products/bagru-earth/03-detail.jpg", alt: "Concept render: close-up of the black lattice and red flowers on ochre.", note: "Concept render" },
      { src: "/images/products/bagru-earth/04-buckle.jpg", alt: "Concept render: tang buckle and dark keepers on the ochre buckle piece.", note: "Concept render" },
    ],
    specs: specs("Tightly woven printed cotton or canvas — exact composition to be confirmed", [
      { label: "Underside", value: "Reinforced underside (target)", verified: false },
    ]),
    construction: constructionStd,
    buckle: "Silver-toned tang buckle, 18 mm (target)",
    care: careFabric,
    variants: variants("TAR-BAG-EAR", launchWidths),
    related: ["bagru-midnight", "sanganer-indigo", "jharokha-noir"],
    seo: {
      title: "Bagru Earth — Watch Strap, 18/20/22 mm",
      description: "An ochre fabric watch strap with a black lattice and red flowers, inspired by Bagru printing. Available in 18, 20 and 22 mm.",
    },
    createdAt: "2026-10-19",
  },
  {
    id: "tar-bag-mid",
    handle: "bagru-midnight",
    name: "Bagru Midnight",
    design: "Midnight Jaal",
    collection: "bagru",
    status: "preview",
    featured: false,
    price: 1199,
    priceConfirmed: false,
    currency: "INR",
    color: "Midnight",
    swatch: "#1D2737",
    colorway: "midnight",
    material: "Printed cotton canvas",
    shortDescription: "The Bagru lattice reversed: sand lines and rust flowers on midnight blue.",
    description: [
      "Bagru Midnight inverts the Earth colourway — a sand-coloured lattice on a ground somewhere between indigo and night.",
      "It is the most versatile strap in the preview collection: quiet enough for the office, textured enough for the weekend.",
    ],
    inspiration: "An exploration of how the same lattice changes character when its tones are reversed.",
    provenance: provenancePending,
    images: [
      { src: "/images/products/bagru-midnight/02-on-watch.jpg", alt: "Concept render: an unbranded watch with a silver dial on the Bagru Midnight strap, on dark slate.", note: "Concept render" },
      { src: "/images/products/bagru-midnight/01-front.jpg", alt: "Concept render: both pieces of the Bagru Midnight strap laid flat.", note: "Concept render" },
      { src: "/images/products/bagru-midnight/03-detail.jpg", alt: "Concept render: close-up of the sand lattice and rust flowers on midnight blue.", note: "Concept render" },
      { src: "/images/products/bagru-midnight/04-buckle.jpg", alt: "Concept render: tang buckle on the midnight buckle piece.", note: "Concept render" },
    ],
    specs: specs("Tightly woven printed cotton or canvas — exact composition to be confirmed"),
    construction: constructionStd,
    buckle: "Silver-toned tang buckle, 18 mm (target)",
    care: careFabric,
    variants: variants("TAR-BAG-MID", launchOnly),
    related: ["bagru-earth", "sanganer-indigo", "jharokha-noir"],
    seo: {
      title: "Bagru Midnight — Watch Strap, 18/20/22 mm",
      description: "A midnight-blue fabric watch strap with a sand-coloured lattice, inspired by Bagru printing. Available in 18, 20 and 22 mm.",
    },
    createdAt: "2026-10-19",
  },
  {
    id: "tar-jha-nor",
    handle: "jharokha-noir",
    name: "Jharokha Noir",
    design: "Noir Arcade",
    collection: "jharokha",
    status: "preview",
    featured: true,
    price: 1499,
    priceConfirmed: false,
    currency: "INR",
    color: "Noir",
    swatch: "#1C1B1A",
    colorway: "noir",
    material: "Canvas–leather hybrid (proposed)",
    shortDescription: "A fine antique-gold arcade of cusped arches on near-black.",
    description: [
      "Jharokha Noir draws a row of cusped arches in a single antique-gold line on a near-black ground. From a distance it reads as a dark strap with a soft sheen; closer, the arcade appears.",
      "It was designed for black and deep-blue dials, and for evenings.",
    ],
    inspiration:
      "The cusped arch and the screened jharokha window are defining forms in Jaipur's architecture. This print abstracts them into an original line drawing — no specific building is reproduced.",
    provenance: provenancePending,
    images: [
      { src: "/images/products/jharokha-noir/02-on-watch.jpg", alt: "Concept render: an unbranded watch with a black dial on the Jharokha Noir strap, on dark slate in patterned light.", note: "Concept render" },
      { src: "/images/products/jharokha-noir/01-front.jpg", alt: "Concept render: both pieces of the Jharokha Noir strap laid flat.", note: "Concept render" },
      { src: "/images/products/jharokha-noir/03-detail.jpg", alt: "Concept render: close-up of the fine gold arch line print and stitching.", note: "Concept render" },
      { src: "/images/products/jharokha-noir/04-buckle.jpg", alt: "Concept render: tang buckle on the noir buckle piece.", note: "Concept render" },
    ],
    specs: specs("Printed canvas outer; a hybrid leather construction is under evaluation and will only be offered after testing"),
    construction: [
      "Printed canvas outer. A leather-backed hybrid construction is being evaluated.",
      "Stitched edges with reinforcement at the spring-bar and buckle ends.",
      "Edges sealed and tested against fraying before release.",
    ],
    buckle: "Tang buckle, 18 mm — finish to be confirmed",
    care: careFabric,
    variants: variants("TAR-JHA-NOR", launchWidths),
    related: ["jharokha-ivory", "bagru-midnight", "sanganer-indigo"],
    seo: {
      title: "Jharokha Noir — Watch Strap, 18/20/22 mm",
      description: "A near-black watch strap with a fine antique-gold arcade inspired by Jaipur's jharokha architecture. Available in 18, 20 and 22 mm.",
    },
    createdAt: "2026-10-19",
  },
  {
    id: "tar-jai-ivr",
    handle: "jharokha-ivory",
    name: "Courtyard Ivory",
    design: "Courtyard Arcade",
    collection: "jharokha",
    status: "preview",
    featured: false,
    price: 1499,
    priceConfirmed: false,
    currency: "INR",
    color: "Ivory",
    swatch: "#E9E1D1",
    colorway: "courtyard",
    material: "Canvas–leather hybrid (proposed)",
    shortDescription: "Neutral fabric with restrained indigo arch geometry and sand-toned recesses.",
    description: [
      "Courtyard Ivory is the quietest strap in the preview collection: a neutral ground, a fine indigo arcade, and arch recesses filled with a sand tone.",
      "It brings a little structure to a cream or blue dial without competing with it.",
    ],
    inspiration:
      "Inspired by the calm, enclosed geometry of courtyards and arcades — original line work, not a copy of any specific building.",
    provenance: provenancePending,
    images: [
      { src: "/images/products/jharokha-ivory/02-on-watch.jpg", alt: "Concept render: an unbranded watch with a blue dial on the Courtyard Ivory strap, on linen.", note: "Concept render" },
      { src: "/images/products/jharokha-ivory/01-front.jpg", alt: "Concept render: both pieces of the Courtyard Ivory strap laid flat.", note: "Concept render" },
      { src: "/images/products/jharokha-ivory/03-detail.jpg", alt: "Concept render: close-up of indigo arches on an ivory ground.", note: "Concept render" },
      { src: "/images/products/jharokha-ivory/04-buckle.jpg", alt: "Concept render: tang buckle and indigo keepers.", note: "Concept render" },
    ],
    specs: specs("Neutral printed fabric; optional hybrid leather construction only after testing"),
    construction: [
      "Neutral printed fabric outer. Hybrid leather construction to be offered only after testing.",
      "Stitched edges with reinforcement at the spring-bar and buckle ends.",
      "Edges sealed and tested against fraying before release.",
    ],
    buckle: "Tang buckle, 18 mm — finish to be confirmed",
    care: [...careFabric, "Lighter grounds show marks more readily; spot-clean promptly with a barely damp cloth."],
    variants: variants("TAR-JAI-IVR", launchOnly),
    related: ["jharokha-noir", "sanganer-ivory", "jaipur-rose"],
    seo: {
      title: "Courtyard Ivory — Watch Strap, 18/20/22 mm",
      description: "A neutral ivory watch strap with restrained indigo arch geometry inspired by Jaipur architecture. Available in 18, 20 and 22 mm.",
    },
    createdAt: "2026-10-19",
  },
];

export const getProduct = (handle: string) => products.find((p) => p.handle === handle);
export const productsInCollection = (handle: string) => products.filter((p) => p.collection === handle && p.status !== "draft");
export const publishedProducts = () => products.filter((p) => p.status !== "draft");
export const featuredProducts = () => publishedProducts().filter((p) => p.featured);
