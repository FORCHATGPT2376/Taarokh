import type { Collection } from "@/types/catalog";

/**
 * Collection concepts. Copy describes design inspiration only — it makes no
 * claim about where or how fabric is produced (see each product's provenance).
 */
export const collections: Collection[] = [
  {
    handle: "sanganer",
    number: "01",
    name: "Sanganer",
    tagline: "Fine florals, printed small and spaced with care.",
    description: [
      "Sanganer, a short distance south of Jaipur's walled city, is known for delicate floral printing — small butis repeated across pale and indigo grounds.",
      "Our Sanganer studies borrow that vocabulary of scale and rhythm: a six-petal flower redrawn for a strap only twenty millimetres wide, so the pattern reads at arm's length and resolves into detail up close.",
    ],
    image: "/images/collections/sanganer.jpg",
    imageAlt: "Three concept straps — ivory, indigo and rose floral prints — laid in parallel on natural linen.",
    tone: "light",
  },
  {
    handle: "bagru",
    number: "02",
    name: "Bagru",
    tagline: "Earthy grounds, geometric lattice, quiet texture.",
    description: [
      "Bagru's printing tradition is associated with earth-toned grounds, black and madder-red inks, and lattice-like jaal layouts.",
      "The Bagru studies translate that structure into an ogee lattice with small four-petal flowers at each junction — a pattern that sits comfortably beside brushed steel and warm dials.",
    ],
    image: "/images/collections/bagru.jpg",
    imageAlt: "Concept straps in ochre and midnight lattice prints on a warm sandstone surface.",
    tone: "light",
  },
  {
    handle: "jharokha",
    number: "03",
    name: "Jharokha",
    tagline: "Architecture, distilled to a fine line.",
    description: [
      "The jharokha — the projecting, screened window of Rajasthani architecture — gives Jaipur's façades their rhythm of arches, shadow and light.",
      "The Jharokha studies abstract that rhythm into a slender arcade of cusped arches, drawn as a single fine line. Restrained enough for a dress watch; detailed enough to reward a second look.",
    ],
    image: "/images/collections/jharokha.jpg",
    imageAlt: "Concept straps with fine arched line prints on dark slate, crossed by patterned window light.",
    tone: "dark",
  },
];

export const getCollection = (handle: string) => collections.find((c) => c.handle === handle);
