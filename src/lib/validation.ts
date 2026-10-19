import { z } from "zod";
import { indianStates } from "@/data/india";

export const contactTopics = ["size-help", "existing-order", "material-question", "collaboration", "other"] as const;
export const topicLabels: Record<(typeof contactTopics)[number], string> = {
  "size-help": "Size & fit help",
  "existing-order": "An existing order",
  "material-question": "Materials & products",
  collaboration: "Collaboration",
  other: "Something else",
};

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100, "Name is too long."),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  topic: z.enum(contactTopics, { message: "Please choose a topic." }),
  orderId: z.string().trim().max(60, "Order ID is too long.").optional().or(z.literal("")),
  message: z.string().trim().min(10, "Please write a little more (at least 10 characters).").max(4000, "Message is too long (4,000 characters max)."),
  consent: z.literal(true, { message: "Please confirm we may use your details to reply." }),
  company: z.string().max(0).optional().or(z.literal("")), // honeypot
  startedAt: z.number().optional(),
  turnstileToken: z.string().optional(),
});

export const newsletterSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  consent: z.literal(true, { message: "Please confirm you'd like to receive updates." }),
  source: z.string().max(40).optional(),
  company: z.string().max(0).optional().or(z.literal("")),
});

export const checkoutSchema = z.object({
  lines: z
    .array(z.object({ variantId: z.string().min(1).max(80), quantity: z.number().int().min(1).max(99) }))
    .min(1)
    .max(30),
});

export type ContactInput = z.infer<typeof contactSchema>;


const phone = z
  .string()
  .transform((s) => s.replace(/[\s-]/g, "").replace(/^(\+91|0091|91(?=\d{10}$)|0(?=\d{10}$))/, ""))
  .refine((s) => /^[6-9]\d{9}$/.test(s), "Enter a 10-digit Indian mobile number.");

export const orderSchema = z.object({
  lines: checkoutSchema.shape.lines,
  customer: z.object({
    name: z.string().trim().min(2, "Please enter your full name.").max(100),
    phone,
    email: z.string().trim().email("Please enter a valid email address.").max(200).optional().or(z.literal("")),
  }),
  address: z.object({
    line1: z.string().trim().min(5, "Enter your house / flat number and street.").max(200),
    line2: z.string().trim().max(200).optional().or(z.literal("")),
    landmark: z.string().trim().max(120).optional().or(z.literal("")),
    city: z.string().trim().min(2, "Enter your city or town.").max(80),
    state: z.enum(indianStates, { message: "Choose your state." }),
    pincode: z.string().trim().regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit PIN code."),
  }),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  payment: z.literal("cod"),
  agree: z.literal(true, { message: "Please confirm the order details." }),
  company: z.string().max(0).optional().or(z.literal("")),
});

export type OrderInput = z.infer<typeof orderSchema>;
