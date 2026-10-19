const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export const formatPrice = (amount: number) => inr.format(amount);

export function readingTime(words: number) {
  return Math.max(1, Math.round(words / 220));
}

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
