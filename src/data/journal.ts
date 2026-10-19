/**
 * Journal articles. Body is lightweight Markdown:
 *   ## Heading, ### Small heading, paragraphs, "- " bullet lists,
 *   "1. " numbered lists, **bold**, [links](/path), and "> " notes.
 * Original educational writing — no invented interviews or quotations.
 */

export type JournalCategory = "craft-heritage" | "watch-knowledge" | "style";

export const journalCategories: Record<JournalCategory, { label: string; description: string }> = {
  "craft-heritage": { label: "Craft & Heritage", description: "Textile traditions, pattern and the architecture of Jaipur." },
  "watch-knowledge": { label: "Watch Knowledge", description: "Fit, sizing and the mechanics of traditional watches." },
  style: { label: "Style", description: "How a strap changes the way a watch is worn." },
};

export interface Article {
  slug: string;
  title: string;
  dek: string;
  category: JournalCategory;
  image: string;
  imageAlt: string;
  publishedAt: string;
  featured?: boolean;
  body: string;
}

export const articles: Article[] = [
  {
    slug: "how-to-measure-your-watch-lug-width",
    title: "How to Measure Your Watch's Lug Width",
    dek: "The single most important number when buying a replacement strap — and the three ways to find it accurately.",
    category: "watch-knowledge",
    image: "/images/journal/lug-width.jpg",
    imageAlt: "Concept render: an unbranded watch on a midnight lattice strap, lying horizontally on linen.",
    publishedAt: "2026-10-19",
    featured: true,
    body: `
Lug width is the distance between the inside faces of a watch's lugs — the two pairs of "horns" that extend from the case and hold the strap. It is measured in millimetres, and it is the measurement a replacement strap must match.

A strap that is too narrow leaves a visible gap and can shift on the spring bar. A strap that is too wide will not fit between the lugs at all, or will bunch and strain the spring bars. A difference of a single millimetre matters.

## Method one: check the manufacturer's specifications

Many watchmakers publish the lug width (sometimes called "band width" or "strap width") in the product specifications or the instruction manual. If you know your exact model reference — usually printed on the caseback or on the warranty card — this is often the quickest route. Use the specifications for your precise reference: different versions of the same model line can have different lug widths.

## Method two: measure between the lugs

You will get the most reliable reading with a set of digital or vernier calipers. A good millimetre ruler works if you are careful.

1. Lay the watch face-up on a soft cloth.
2. Place the jaws of the calipers (or the ruler) between the inside faces of the two lugs at one end of the case.
3. Measure as close as possible to where the spring bar sits, not at the very tips of the lugs, which may be shaped or bevelled.
4. Read the result in millimetres and repeat at the other end of the case.

Most results land on an even number — 18, 20 or 22 mm are the most common widths on men's watches; 12, 14 and 16 mm are common on smaller watches. Odd sizes such as 19 mm and 21 mm do exist, particularly on dress and vintage watches. If your reading is close to a half millimetre, measure again rather than rounding by guesswork.

## Method three: measure the existing strap

If your current strap is still attached, measure its width right where it meets the case. This should equal the lug width. Avoid measuring further down the strap: most straps taper towards the buckle, so the width there will be smaller.

## Lug width is not the whole story

Matching the width is necessary, but it does not guarantee a fit. Before ordering any replacement strap, check:

- **The attachment system.** Our straps are designed for standard spring-bar lugs. Watches with integrated bracelets, proprietary connectors, screw-in bars or unusual case shapes may not accept a standard two-piece strap.
- **Clearance.** A thicker strap needs room between the spring bar and the case. Some cases with very tight lug-to-case gaps work better with thinner straps.
- **Curved lugs and end links.** A case designed around a curved bracelet end link can leave a gap with a straight-ended strap.

If you are unsure, [ask us before ordering](/contact) and include your watch model and a clear photograph of where the strap attaches. We would rather check than have you guess.

> Our [size guide](/size-guide) includes an interactive helper for interpreting your measurement.
`,
  },
  {
    slug: "the-art-of-sanganeri-printing",
    title: "The Art of Sanganeri Printing",
    dek: "Fine florals, careful registration and a town just south of Jaipur — an introduction to one of Rajasthan's best-known textile traditions.",
    category: "craft-heritage",
    image: "/images/journal/sanganeri-printing.jpg",
    imageAlt: "Concept render: a wooden printing block resting on cloth printed with small indigo flowers.",
    publishedAt: "2026-10-19",
    featured: true,
    body: `
Sanganer lies a short distance south of Jaipur's walled city. For generations it has been associated with hand-block printing — and, in particular, with fine, delicately drawn floral patterns on light grounds.

## The vocabulary of a Sanganeri print

The most recognisable Sanganeri designs are built from small, repeated motifs. A **buti** is a small, self-contained motif — often a single flower or sprig — scattered in a regular repeat. A **bel** is a running border of vine or flower. Larger compositions arrange florals inside a lattice.

What distinguishes the style is restraint and precision: thin outlines, carefully balanced spacing, and motifs that remain legible at a small scale. Lighter grounds are characteristic, though many colourways exist.

## How hand-block printing works

Hand-block printing, as practised in Sanganer and elsewhere in Rajasthan, is a sequence of skilled stages rather than a single act.

1. **Preparing the cloth.** Fabric is washed to remove starch and impurities so that it accepts dye evenly.
2. **Carving the blocks.** A design is transferred to a block of seasoned wood and carved by hand. One design often needs several blocks: an outline block — commonly called the *rekh* — and further blocks to fill each colour.
3. **Printing.** The printer charges the block with colour from a tray and presses it onto the cloth, aligning each impression by eye. Each additional colour is printed with its own block, in register with the outline.
4. **Fixing and finishing.** Depending on the dyes used, the cloth is fixed, washed and dried — traditionally in the open sun.

Because every impression is placed by hand, genuine block-printed cloth shows small variations in registration and depth of colour. These are not defects; they are the evidence of the process.

## Protection and provenance

Sanganeri hand-block printing is a registered Geographical Indication (GI) in India, which recognises the link between the product and its place. This matters for anyone designing with the tradition. A design can be *inspired by* Sanganeri motifs without being Sanganeri hand-block-printed cloth — and the two should never be confused in how a product is described.

## How it informs TAAROKH

Our Sanganer studies borrow the logic of the buti: a small, complete flower, repeated with care. We redrew our own motif from first principles for a strap twenty millimetres wide. Where a product uses fabric genuinely hand-block printed in Sanganer, its product page will say so — and only once that has been verified. Until then, our language is deliberately exact: *inspired by*.

You can read more about how we separate inspiration from origin on [The Craft](/the-craft).
`,
  },
  {
    slug: "the-architecture-behind-jaipurs-patterns",
    title: "The Architecture Behind Jaipur's Patterns",
    dek: "Arches, screens and a planned city: how Jaipur's built environment shapes a visual language.",
    category: "craft-heritage",
    image: "/images/journal/jaipur-architecture.jpg",
    imageAlt: "Original illustration: a pink-washed façade with cusped arches, white line ornament and lit jaali screens.",
    publishedAt: "2026-10-19",
    body: `
Jaipur was founded in 1727 by Maharaja Sawai Jai Singh II. Unusually for its time, it was a planned city: broad, straight streets laid out on a grid of rectangular sectors, with markets lining the main avenues. The planning is commonly credited to the architect Vidyadhar Bhattacharya and drew on traditional Indian principles of town planning. In 2019 the walled city was inscribed on the UNESCO World Heritage List.

## The jharokha

A jharokha is an enclosed balcony that projects from a building's upper storey, typically supported on brackets and roofed with a small canopy. It allows those inside to look out onto the street while remaining largely unseen, and it shades the façade below. Repeated along a street front, jharokhas give a building its rhythm of projection and shadow.

Jaipur's best-known example of the form is the Hawa Mahal, built in 1799 during the reign of Maharaja Sawai Pratap Singh. Its façade is composed of tier upon tier of small windows and screens.

## The jaali

A jaali is a pierced screen, carved from stone or built up in other materials, forming a geometric or floral lattice. It filters light and allows air to move while preserving privacy. In strong sun, a jaali projects its own pattern across the floor — one of the most beautiful effects in Rajasthani architecture, and a recurring image in our own visual work.

## The cusped arch

Many arches in the region are not smooth curves but are formed from a series of small lobes, or cusps. The result is a richly modelled outline that reads clearly in both strong light and deep shadow.

## Colour

The old city's characteristic terracotta-pink wash dates from the nineteenth century. It is widely associated with preparations for the 1876 visit of the Prince of Wales. Many façades combine that ground with fine white line ornament outlining arches and openings.

## From building to strap

Our Jharokha studies take three ideas from this architecture — the cusped arch, the repeated bay, and the play of line against shadow — and abstract them into a single fine line on a narrow strap. We do not reproduce any specific building. The aim is to carry the *rhythm* of the city, not its monuments.
`,
  },
  {
    slug: "how-to-choose-the-right-watch-strap",
    title: "How to Choose the Right Watch Strap",
    dek: "Width, length, material and colour — a practical sequence for choosing a strap you'll actually wear.",
    category: "style",
    image: "/images/editorial/strap-row.jpg",
    imageAlt: "Concept render: seven printed straps laid side by side on linen.",
    publishedAt: "2026-10-19",
    featured: true,
    body: `
A replacement strap is one of the most effective ways to change how a watch looks and feels. The choice is easier if you take it in a set order: fit first, then comfort, then style.

## 1. Confirm the width

Everything starts with lug width — the distance between the lugs, in millimetres. If the width is wrong, nothing else matters. [Here is how to measure it](/journal/how-to-measure-your-watch-lug-width).

## 2. Check the attachment

Two-piece straps with spring bars fit most traditional watches with conventional lugs. They will not suit integrated bracelets, many proprietary systems, or some cases with unusually tight lug gaps. When in doubt, check before buying.

## 3. Consider the length

Strap length is normally given as two numbers: the long piece (with holes) and the short piece (with the buckle). A common "standard" combination is in the region of 115–120 mm and 70–80 mm. Wrist size, watch size and how you like a strap to sit all affect which length suits you. If you are between sizes, look at where the middle hole would fall on your wrist.

## 4. Choose a material for how you'll wear it

- **Leather** is classic and forms to the wrist over time, but dislikes water and heavy sweat.
- **Fabric and canvas** are light, breathable and casual, with a texture leather lacks. Treat printed fabric as a textile accessory: keep it dry when you can.
- **Rubber and synthetic** straps are made for water and exertion.

## 5. Use colour deliberately

A few reliable principles:

- **Echo something in the dial.** A strap that picks up the colour of the hands, indices or dial gives a coherent look.
- **Contrast with the case.** Dark straps make steel cases look brighter; light straps soften them.
- **Let one element lead.** A busy dial pairs best with a calm strap, and a patterned strap with a simple dial.

## 6. Think about the buckle

Most straps taper, so the buckle end is narrower than the lug end — a 20 mm strap might taper to 18 mm. The buckle finish should sit comfortably beside the case: polished with polished, brushed with brushed, or a deliberate contrast.

The best strap is the one that fits correctly and gets worn. Start with the measurements and the rest becomes a pleasure.
`,
  },
  {
    slug: "leather-vs-fabric-watch-straps",
    title: "Leather vs Fabric Watch Straps",
    dek: "Two very different materials, each with its own strengths. An honest comparison.",
    category: "watch-knowledge",
    image: "/images/journal/leather-vs-fabric.jpg",
    imageAlt: "Concept render: a plain brown leather strap beside a printed midnight fabric strap on linen.",
    publishedAt: "2026-10-19",
    body: `
Leather and fabric are the two most common materials for straps on traditional watches. Neither is better in every situation; each suits different watches, climates and habits.

## Leather

**Strengths.** Leather has a long association with dress and classic watches. Good leather is supple, forms to the wrist and develops character with wear. It can be finished in many ways — smooth, grained, suede — and edge-finished for a refined look.

**Considerations.** Leather does not like water. Repeated soaking and drying can cause it to stiffen, crack or discolour. In hot and humid conditions it can absorb sweat and odour. Quality varies widely, and terms such as "genuine leather" say little about grade.

## Fabric

**Strengths.** Fabric straps are typically lighter and more breathable. They bring colour and pattern that leather cannot, and they make even a formal watch feel more relaxed. Construction matters: a well-made fabric strap is reinforced and lined so it holds its shape and does not fray.

**Considerations.** Printed textiles are best treated as textile accessories rather than waterproof straps. Lighter colours show marks more readily, and prints may change gradually with prolonged sun exposure. Check the care instructions for each strap — they depend on construction, dye and finish.

## Hybrid constructions

Some straps combine a textile outer with a leather lining or backing. The aim is the look of fabric with more structure. The trade-offs depend entirely on how the strap is built, so look for clear information on each layer.

## Which should you choose?

- For a **dress watch worn on formal occasions**, leather is the traditional choice — though a restrained fabric strap can be a quietly distinctive alternative.
- For **everyday wear in warm weather**, fabric is often more comfortable.
- For **water and exercise**, neither: choose rubber or a purpose-made synthetic.

Whatever you choose, look for straps whose materials are named precisely. Vague descriptions are a warning sign.
`,
  },
  {
    slug: "a-beginners-guide-to-mechanical-watches",
    title: "A Beginner's Guide to Mechanical Watches",
    dek: "Mainsprings, escapements and why a watch without a battery keeps running.",
    category: "watch-knowledge",
    image: "/images/journal/mechanical-watches.jpg",
    imageAlt: "Concept render: a close view of an unbranded watch dial with applied indices and dauphine hands.",
    publishedAt: "2026-10-19",
    body: `
A mechanical watch keeps time with springs and gears rather than a battery and an electronic circuit. For many people, that is precisely its appeal.

## How it works

At its simplest, a mechanical movement has five parts working together:

- **The mainspring** is a coiled spring that stores energy when the watch is wound.
- **The gear train** carries that energy from the mainspring towards the regulating parts, and drives the hands.
- **The escapement** releases the energy in small, regular steps. It is responsible for the familiar ticking.
- **The balance wheel** and its hairspring oscillate back and forth at a steady rate, regulating the escapement.
- **The dial train and hands** translate the movement's steady motion into hours, minutes and seconds.

## Manual and automatic

A **manual-winding** watch is wound by turning the crown. An **automatic** (self-winding) watch contains a rotor — a weighted segment that turns as the wrist moves — which winds the mainspring. Many automatics can also be wound by hand.

The **power reserve** is how long a fully wound watch runs before stopping. Common figures range from around a day and a half to several days, depending on the movement.

## Mechanical and quartz

A quartz watch uses a battery and a quartz crystal that vibrates at a precise frequency. Quartz watches are generally more accurate and need little attention. Mechanical watches are valued for their craftsmanship, their sweeping seconds hands and the absence of a battery — and they reward a little care.

## Living with a mechanical watch

- Expect some variation in daily accuracy; manufacturers publish tolerances for their movements.
- Keep it away from strong magnets, which can affect the hairspring.
- Avoid hard knocks.
- Have it serviced at the intervals the manufacturer recommends.

Changing the strap is one of the simplest, safest ways to refresh a mechanical watch. Use the correct tool, work over a soft surface, and if the watch is valuable, consider asking a professional.
`,
  },
  {
    slug: "how-to-style-a-dress-watch",
    title: "How to Style a Dress Watch",
    dek: "Proportion, restraint and the strap that ties it together.",
    category: "style",
    image: "/images/journal/dress-watch.jpg",
    imageAlt: "Concept render: an unbranded watch with a black dial on the Jharokha Noir strap, in patterned light on slate.",
    publishedAt: "2026-10-19",
    body: `
A dress watch is defined less by rules than by intent: a simple, legible dial, a relatively slim case, and a design that sits quietly under a shirt cuff.

## Proportion first

A dress watch should slide under a cuff rather than fight it. Thinner cases are traditional, and modest diameters tend to look more considered than oversized ones. The strap should follow suit: slim and tapered, rather than thick and padded.

## Dial and metal

- **White, ivory and silver dials** are the most classic and pair with almost anything.
- **Deep blue and black dials** feel more evening-appropriate.
- Try to keep metals in conversation: a steel watch beside steel cufflinks, a gold watch beside gold.

## The strap

Traditionally, a dress watch is worn on smooth leather in black or brown. That remains a reliable choice — but it is not the only one. A strap with a fine, low-contrast pattern can add character without breaking formality, provided:

- the pattern is **small and quiet** enough to read as texture from a distance;
- the colours **echo the dial** or the clothes;
- the strap is **slim and well finished**, with a buckle that matches the case.

Our Jharokha studies were drawn with exactly this in mind: a single fine line on a dark ground, designed to look plain at a glance and reveal its detail up close.

## Occasions

Formal events reward restraint. Weddings and celebrations allow more colour and pattern. At work, follow the dial: if the watch is simple, the strap can carry a little more personality.
`,
  },
  {
    slug: "why-the-strap-changes-a-watchs-character",
    title: "Why the Strap Changes a Watch's Character",
    dek: "One watch, three straps, three different personalities.",
    category: "style",
    image: "/images/editorial/triptych.jpg",
    imageAlt: "Concept render: the same unbranded watch shown on three different printed straps side by side.",
    publishedAt: "2026-10-19",
    body: `
The case, dial and hands of a watch rarely change. The strap can change in a minute. That is why it is one of the most expressive decisions a wearer makes.

## Colour frames the dial

Strap colour sets the background against which the dial is read. A dark strap makes a light dial appear brighter; a light strap makes it softer. A strap that repeats a colour from the dial — the hands, a printed detail, the seconds track — pulls the whole design together.

## Texture changes formality

Smooth materials read as formal; textured ones read as relaxed. A printed fabric strap sits somewhere in between, depending on the scale and contrast of its pattern. Small, low-contrast motifs feel almost like a weave. Large, high-contrast ones are a statement.

## Pattern carries meaning

Pattern is never neutral. A lattice suggests order; a scattered floral suggests ease; an arcade suggests architecture. Choosing a pattern is choosing a small story to wear.

## Proportion changes perceived size

A wider-looking strap makes a case feel larger; a strongly tapered strap makes it feel more elegant. Pale straps also tend to make a watch look larger than dark straps of the same width.

## One watch, many expressions

The practical upshot is simple: rather than buying another watch to change the mood, try changing the strap. A single good watch with a few well-chosen straps can cover the office, the weekend and the occasion.

That is the idea TAAROKH is built around.
`,
  },
  {
    slug: "the-story-of-traditional-block-printing",
    title: "The Story of Traditional Block Printing",
    dek: "Wood, dye and repetition — the processes behind Rajasthan's block-printed textiles, and why provenance matters.",
    category: "craft-heritage",
    image: "/images/journal/block-printing-story.jpg",
    imageAlt: "Concept render: a wooden printing block on cloth printed with an ochre lattice.",
    publishedAt: "2026-10-19",
    body: `
Block printing — pressing a carved, dye-charged block onto cloth — is among the oldest ways of decorating textiles. In Rajasthan it remains a living craft, practised in centres such as Sanganer and Bagru near Jaipur, and closely associated with communities of printers known as Chhipa.

## The block

Blocks are carved by hand from seasoned wood. A single design may require a set of blocks: one for the outline and one for each colour that fills it. The carving determines everything that follows — the sharpness of the line, the weight of the colour, the way the repeat locks together.

## Direct printing and resist printing

There are two broad approaches.

- **Direct printing** applies colour straight onto the cloth with the block.
- **Resist printing** applies a substance that *prevents* dye from reaching parts of the cloth. When the cloth is then dyed — for instance in indigo — the protected areas remain lighter. In Bagru, a mud-based resist known as *dabu* is particularly associated with the craft.

## Grounds and colours in Bagru

Bagru printing is known for earthy palettes. Cloth is often treated with *harda* (myrobalan), giving a pale yellowish ground. Black (*syahi*) and red (*begar*) are traditional printing colours, and indigo is widely used for dyeing. Bagru hand-block printing, like Sanganeri printing, is a registered Geographical Indication in India.

## Why provenance matters

Because block-printed patterns are so recognisable, they are frequently imitated — by screen printing, digital printing, or simply by copying the look. There is nothing wrong with a design being *inspired* by a tradition, as long as it is described honestly.

At TAAROKH we use exact language:

- **"Inspired by"** describes a design that draws on a tradition's visual vocabulary.
- **"Hand-block printed"** will only appear where the fabric's source and printing method are verified for that specific product.
- **Places and people** — where something was printed, assembled, or by whom — will only be named with documentation and permission.

It is a small discipline, but it respects both the craft and the customer.
`,
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

export function articleWords(a: Article) {
  return a.body.split(/\s+/).filter(Boolean).length;
}
