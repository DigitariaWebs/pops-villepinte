import type { Category, Product, ProductVariant, Supplement } from "@/types";

// -- categories ---------------------------------------------------------
export const CATEGORIES: Category[] = [
  { id: "box", name: "Box", icon: "package", order: 1 },
  { id: "smash-burgers", name: "Smash Burgers", icon: "sandwich", order: 2 },
  { id: "bucket", name: "Buckets", icon: "drumstick", order: 3 },
  { id: "bowls", name: "Bowls", icon: "soup", order: 4 },
  { id: "wraps", name: "Wraps", icon: "wheat", order: 5 },
  { id: "frites", name: "Frites", icon: "cookie", order: 6 },
];

// -- supplements --------------------------------------------------------
export const SUPPLEMENTS: Supplement[] = [
  { id: "oignons-caramelises", name: "Oignon caramélisée", priceEUR: 1 },
  { id: "oignons-frits", name: "Oignon frits", priceEUR: 1 },
  { id: "jalapenos", name: "Jalapeños", priceEUR: 1 },
  { id: "galette-pomme-terre", name: "Galette de pomme de terre", priceEUR: 1.5 },
  { id: "cheddar", name: "Chedar", priceEUR: 1 },
  { id: "fromage-chevre", name: "Fromage de chèvre", priceEUR: 1 },
  { id: "raclette", name: "Raclette", priceEUR: 1 },
  { id: "viande-hachee", name: "Viande hachée", priceEUR: 2 },
  { id: "tenders-supp", name: "Tenders", priceEUR: 2 },
  { id: "cordon-bleu", name: "Cordon bleu", priceEUR: 2 },
  { id: "pastrami", name: "Pastrami", priceEUR: 2 },
  { id: "bacon", name: "Bacon", priceEUR: 1 },
  { id: "sauce-blanche", name: "Sauce blanche maison", priceEUR: 0 },
  { id: "sauce-biggi", name: "Sauce Biggi", priceEUR: 0 },
  { id: "sauce-poivre", name: "Sauce poivrée", priceEUR: 0 },
];

const ALL_SUPPLEMENTS = SUPPLEMENTS.map(s => s.id);

// -- products -----------------------------------------------------------
export const PRODUCTS: Product[] = [
  // Box
  {
    id: "box-familiale",
    categoryId: "box",
    name: "BOX FAMILLIALE",
    description: "4 smash burger, 5 wings, 5 tenders, Frite XXL, 4 boisson aux choix, Sauce blanche maison.",
    priceEUR: 29,
    tags: ["TOP"],
    availableSupplements: ALL_SUPPLEMENTS,
    prepTimeMinutes: 20,
    imageUrl: require("../../assets/products/box_familiale.png"),
  },
  {
    id: "box-nashville",
    categoryId: "box",
    name: "Box nashville",
    description: "2 tenders nashville, frite, burger aux choix et une boisson.",
    priceEUR: 15,
    tags: ["SPICY", "NOUVEAU"],
    availableSupplements: ALL_SUPPLEMENTS,
    prepTimeMinutes: 15,
    imageUrl: require("../../assets/products/box_nashville.png"),
  },

  // Smash Burgers
  {
    id: "smash-baleze",
    categoryId: "smash-burgers",
    name: "Le baleze",
    description: "3 steak XL, SAUCE BIGGI, GALTT DE POMME DE TERRE, 2 tenders, Salade, Chedar.",
    priceEUR: 12,
    tags: ["NOUVEAU"],
    availableSupplements: ALL_SUPPLEMENTS,
    prepTimeMinutes: 15,
    imageUrl: require("../../assets/products/burger_le_baleze.png"),
  },
  {
    id: "smash-smoky",
    categoryId: "smash-burgers",
    name: "Smoky",
    description: "2steak Viande hachée, Pastrami, Sauce poivré, Oignon caramélisé, Chedar.",
    priceEUR: 10,
    tags: ["NOUVEAU"],
    availableSupplements: ALL_SUPPLEMENTS,
    prepTimeMinutes: 15,
    imageUrl: require("../../assets/products/burger_smoky.png"),
  },
  {
    id: "smash-gourmet",
    categoryId: "smash-burgers",
    name: "Le gourmet",
    description: "2 steak XL, Jalapenos, pastrami, Oignon caramélisé, Chedar.",
    priceEUR: 10,
    tags: ["NOUVEAU", "TOP"],
    availableSupplements: ALL_SUPPLEMENTS,
    prepTimeMinutes: 15,
    imageUrl: require("../../assets/products/burger_gourmet.png"),
  },
  {
    id: "burger-chicken-nashville",
    categoryId: "smash-burgers",
    name: "Burger chicken nashville",
    description: "Burger au poulet mariné façon Nashville, bien piquant.",
    priceEUR: 9,
    tags: ["SPICY", "NOUVEAU"],
    availableSupplements: ALL_SUPPLEMENTS,
    prepTimeMinutes: 15,
    imageUrl: require("../../assets/products/burger_nashville.png"),
  },

  // Frites
  {
    id: "frite-cheddar",
    categoryId: "frites",
    name: "Frite chedar",
    description: "Frites dorées nappées de cheddar fondant.",
    priceEUR: 4,
    tags: [],
    availableSupplements: ALL_SUPPLEMENTS,
    prepTimeMinutes: 10,
    imageUrl: require("../../assets/products/frite_cheddar.png"),
  },
  {
    id: "frite-cheddar-bacon",
    categoryId: "frites",
    name: "Frite chedar bacon oignon frits",
    description: "Frites, cheddar, bacon croustillant, oignons frits.",
    priceEUR: 5,
    tags: ["TOP"],
    availableSupplements: ALL_SUPPLEMENTS,
    prepTimeMinutes: 10,
    imageUrl: require("../../assets/products/frite_bacon.png"),
  },

  // Buckets
  {
    id: "bucket-wings",
    categoryId: "bucket",
    name: "Buckets wings",
    description: "5 wings, frite, boisson.",
    priceEUR: 8,
    tags: [],
    availableSupplements: ALL_SUPPLEMENTS,
    prepTimeMinutes: 15,
    imageUrl: require("../../assets/products/bucket_wings.png"),
  },
  {
    id: "bucket-tenders",
    categoryId: "bucket",
    name: "Buckets tenders",
    description: "5 tenders, frite, boisson.",
    priceEUR: 8,
    tags: [],
    availableSupplements: ALL_SUPPLEMENTS,
    prepTimeMinutes: 15,
    imageUrl: require("../../assets/products/bucket_tenders.png"),
  },
  {
    id: "bucket-mix",
    categoryId: "bucket",
    name: "Buckets mix",
    description: "6 wings, 6 tenders, 2 boisson, 2 frite.",
    priceEUR: 16,
    tags: ["TOP"],
    availableSupplements: ALL_SUPPLEMENTS,
    prepTimeMinutes: 15,
    imageUrl: require("../../assets/products/bucket_mix.png"),
  },
  {
    id: "bucket-family",
    categoryId: "bucket",
    name: "Buckets family",
    description: "10 tenders, 10 wings, 3 frite, 3 boisson.",
    priceEUR: 26,
    tags: ["TOP"],
    availableSupplements: ALL_SUPPLEMENTS,
    prepTimeMinutes: 20,
    imageUrl: require("../../assets/products/bucket_family.png"),
  },

  // Bowls
  {
    id: "bowl-tenders",
    categoryId: "bowls",
    name: "Bolws tenders",
    description: "Frite, bacon, sauce chedar, oignon frits.",
    priceEUR: 10,
    tags: [],
    availableSupplements: ALL_SUPPLEMENTS,
    prepTimeMinutes: 12,
    imageUrl: require("../../assets/products/bowl_tenders.png"),
  },
  {
    id: "bowl-nashville",
    categoryId: "bowls",
    name: "Bolws nashville",
    description: "Frite, tenders nashville, bacon, sauce chedar, oignon frits.",
    priceEUR: 10,
    tags: ["SPICY"],
    availableSupplements: ALL_SUPPLEMENTS,
    prepTimeMinutes: 12,
    imageUrl: require("../../assets/products/bowl_nashville.png"),
  },
  {
    id: "bowl-gratine",
    categoryId: "bowls",
    name: "Bolws gratiné",
    description: "Frite, tenders, bacon, sauce chedar, oignon frits et mozarella.",
    priceEUR: 11,
    tags: ["TOP", "NOUVEAU"],
    availableSupplements: ALL_SUPPLEMENTS,
    prepTimeMinutes: 12,
    imageUrl: require("../../assets/products/bowl_gratine.png"),
  },

  // Wraps
  {
    id: "wrap-nashville",
    categoryId: "wraps",
    name: "Wrap nashville",
    description: "Tenders nashville, salade, chedar, sauce aux choix.",
    priceEUR: 8,
    tags: ["SPICY", "NOUVEAU"],
    availableSupplements: ALL_SUPPLEMENTS,
    prepTimeMinutes: 10,
    imageUrl: require("../../assets/products/wrap_nashville.png"),
  },
];

// -- lookup maps --------------------------------------------------------

export const PRODUCTS_BY_ID: Readonly<Record<string, Product>> = Object.freeze(
  PRODUCTS.reduce<Record<string, Product>>((acc, p) => {
    acc[p.id] = p;
    return acc;
  }, {}),
);

export const SUPPLEMENTS_BY_ID: Readonly<Record<string, Supplement>> = Object.freeze(
  SUPPLEMENTS.reduce<Record<string, Supplement>>((acc, s) => {
    acc[s.id] = s;
    return acc;
  }, {}),
);

export const CATEGORIES_BY_ID: Readonly<Record<string, Category>> = Object.freeze(
  CATEGORIES.reduce<Record<string, Category>>((acc, c) => {
    acc[c.id] = c;
    return acc;
  }, {}),
);

// -- feature selection --------------------------------------------------

export function getFeaturedProduct(): Product {
  const signature = PRODUCTS.find(
    (p) => p.categoryId === "box" && p.tags.includes("TOP"),
  );
  if (signature) return signature;
  const anyBox = PRODUCTS.find((p) => p.categoryId === "box");
  if (anyBox) return anyBox;
  return PRODUCTS[0]!;
}
