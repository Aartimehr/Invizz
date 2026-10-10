import { store } from "@/lib/store";

// Outlines are drawn in a 400 × 500 box, the same shape as the drawing area.
export const garments = [
  { id: "tshirt", name: "T-shirt", outline: "M150 60Q200 100 250 60L330 90L385 190L325 225L305 190L305 450L95 450L95 190L75 225L15 190L70 90Z" },
  { id: "shirt", name: "Shirt", outline: "M155 55L200 95L245 55L320 85L390 400L335 412L300 220L300 455L100 455L100 220L65 412L10 400L80 85Z" },
  { id: "dress", name: "Dress", outline: "M160 50Q200 95 240 50L275 70L262 190L340 460L60 460L138 190L125 70Z" },
  // No outline: the whole page is the fabric.
  { id: "other", name: "Something else", outline: "M0 0H400V500H0Z" },
] as const;

export type Garment = (typeof garments)[number];

export const fabricColours = [
  { name: "White", value: "#ffffff" },
  { name: "Cream", value: "#f0e9d8" },
  { name: "Black", value: "#1f1f1f" },
  { name: "Olive", value: "#626449" },
  { name: "Rust", value: "#a65e45" },
  { name: "Blue", value: "#5b7389" },
  { name: "Rose", value: "#dfc0bb" },
  { name: "Mustard", value: "#d2a23c" },
];

export const brushColours = ["#24251f", "#ffffff", "#c0392b", "#a65e45", "#e0a82e", "#3f7d4e", "#626449", "#2f5f9e", "#7fb4d6", "#7a4a9e", "#e08aa8", "#7a5236"];

export const customSizes = ["XS", "S", "M", "L", "XL", "XXL"];

export type CustomRequest = {
  reference: string;
  garment: string;
  fabric: string;
  size: string;
  notes: string;
  name: string;
  phone: string;
};

// "CUS" rather than "INV" so the owner can tell a customised request from a shop order at a glance.
export function createCustomReference() {
  return `CUS-${Date.now().toString(36).slice(-6).toUpperCase()}`;
}

export function customMessage(request: CustomRequest) {
  return [
    `Hi ${store.name}! I'd like a customised piece. I've drawn what I have in mind.`,
    "",
    `Design ref: ${request.reference}`,
    `Piece: ${request.garment}`,
    `Fabric colour: ${request.fabric}`,
    `Size: ${request.size}`,
    ...(request.notes ? [`Notes: ${request.notes}`] : []),
    "",
    `Name: ${request.name}`,
    `Phone: ${request.phone}`,
    "",
    "I'm attaching my drawing. Please tell me the price and how long it will take.",
  ].join("\n");
}
