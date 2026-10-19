"use client";

import { getImageProps } from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { LineReveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { imageMeta } from "@/lib/images";

const ease = [0.22, 1, 0.36, 1] as const;
const alt = "Concept render: an unbranded steel analog watch on the Sanganer Indigo strap, resting on sandstone in star-shaped light from a jaali screen.";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.02, 1.12]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const common = { alt, fill: true, priority: true, sizes: "100vw" } as const;
  const { props: { srcSet: desktop } } = getImageProps({ ...common, src: "/images/hero/hero-desktop.jpg" });
  const { props: { srcSet: mobile, ...rest } } = getImageProps({ ...common, src: "/images/hero/hero-mobile.jpg" });

  return (
    <section ref={ref} className="dark-surface relative h-[100svh] min-h-[38rem] overflow-hidden bg-ink text-ivory" aria-label="Introduction">
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <motion.div className="absolute inset-0" initial={{ scale: 1.12, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 2.4, ease }}>
          <picture>
            <source media="(min-width: 768px)" srcSet={desktop} />
            <source media="(max-width: 767px)" srcSet={mobile} />
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img {...rest} className="h-full w-full object-cover object-[70%_50%] md:object-center" style={{ backgroundImage: `url(${imageMeta("/images/hero/hero-desktop.jpg")?.blur})`, backgroundSize: "cover" }} />
          </picture>
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-transparent to-ink/40 md:from-ink/40" aria-hidden />

      <motion.div style={{ opacity: fade }} className="container-luxe relative flex h-full flex-col justify-end pb-[max(5rem,12vh)] pt-32 md:justify-center md:pb-0">
        <motion.p className="eyebrow text-sand" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.5 }}>
          Born of Jaipur
        </motion.p>
        <h1 className="serif mt-6 text-display font-light">
          <LineReveal immediate delay={0.6} lines={["Time, reimagined", "through heritage."]} />
        </h1>
        <motion.p className="mt-8 max-w-md text-base leading-relaxed text-ivory/80 sm:text-lg" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease, delay: 1.2 }}>
          Contemporary watch straps inspired by the artistry of Jaipur.
        </motion.p>
        <motion.div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease, delay: 1.4 }}>
          <ButtonLink href="/shop" variant="light" arrow>
            Explore the collection
          </ButtonLink>
          <ButtonLink href="/our-story" variant="textLight">
            Our story
          </ButtonLink>
        </motion.div>
      </motion.div>

      <motion.div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }} aria-hidden>
        <span className="eyebrow text-[0.55rem] text-ivory/60">Scroll</span>
        <span className="relative h-12 w-px overflow-hidden bg-ivory/20">
          <motion.span className="absolute inset-x-0 top-0 h-1/2 bg-ivory" animate={{ y: ["-100%", "200%"] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} />
        </span>
      </motion.div>
    </section>
  );
}
