import re

content = """// PRICES MARKED "TBD" ARE PLACEHOLDERS — confirmed prices only on Bowls/Box (10/15/30 €).
// Replace with real prices once Abdoullah confirms.
//
// IMAGES: hand-picked Unsplash photos, one per category (CATEGORY_IMAGES below).
// All 37 products inside a category share the same hero photo for now —
// Abdoullah will swap these for real shop photography later. To swap a single
// category, edit one URL in CATEGORY_IMAGES; to swap a single product, set
// `imageUrl` directly on that product.

import type { Category, Product, ProductVariant, Supplement } from "@/types";

// -- helpers ------------------------------------------------------------

const UNSPLASH_PARAMS = "w=800&h=560&fit=crop&auto=format&q=80";

function unsplash(photoId: string): string {
  return `https://images.unsplash.com/photo-${photoId}?${UNSPLASH_PARAMS}`;
}

const CATEGORY_IMAGES: Readonly<Record<string, string>> = Object.freeze({
  "smash-burgers": unsplash("1568901346375-23c9450c58cd"),
  wraps: unsplash("1626700051175-6818013e1d4f"),
  tacos: unsplash("1599974579688-8dbdd335c77f"),
  tasty: unsplash("1551024601-bec78aea704b"),
  bowls: unsplash("1546069901-ba9599a7e63c"),
  box: unsplash("1513104890138-7c749659a591"),
  bucket: unsplash("1562967914-608f82629710"),
  plats: unsplash("1604908176997-125f25cc6f3d"),
  boissons: unsplash("1554866585-cd94860890b7"),
});

function imgFor(categoryId: string): string {
  return CATEGORY_IMAGES[categoryId] ?? CATEGORY_IMAGES["smash-burgers"]!;
}

function smashVariants(basePrice: number): ProductVariant[] {
  return [
    { id: "1", label: "1 steak", priceEUR: basePrice },
    { id: "2", label: "2 steaks", priceEUR: basePrice + 2 },
    { id: "3", label: "3 steaks", priceEUR: basePrice + 4 },
    { id: "4", label: "4 steaks", priceEUR: basePrice + 6 },
    { id: "5", label: "5 steaks", priceEUR: basePrice + 8 },
    { id: "6", label: "6 steaks", priceEUR: basePrice + 10 },
    { id: "7", label: "7 steaks", priceEUR: basePrice + 12 },
  ];
}

const SIZE_VARIANTS: ProductVariant[] = [
  { id: "s", label: "10 €", priceEUR: 10 },
  { id: "m", label: "15 €", priceEUR: 15 },
  { id: "l", label: "30 €", priceEUR: 30 },
];

// -- categories ---------------------------------------------------------

export const CATEGORIES: Category[] = [
  { id: "smash-burgers", name: "Smash Burgers", icon: "sandwich", order: 1 },
  { id: "wraps", name: "Wraps", icon: "wheat", order: 2 },
  { id: "tacos", name: "Tacos", icon: "utensils-crossed", order: 3 },
  { id: "tasty", name: "Tasty", icon: "cookie", order: 4 },
  { id: "bowls", name: "Bowls", icon: "soup", order: 5 },
  { id: "box", name: "Box", icon: "package", order: 6 },
  { id: "bucket", name: "Bucket", icon: "drumstick", order: 7 },
  { id: "plats", name: "Plats", icon: "chef-hat", order: 8 },
  { id: "boissons", name: "Boissons", icon: "cup-soda", order: 9 },
];

// -- supplements --------------------------------------------------------

export const SUPPLEMENTS: Supplement[] = [
  { id: "cheddar", name: "Cheddar", priceEUR: 1 },
  { id: "oignons-frits", name: "Oignons frits", priceEUR: 1 },
  { id: "bacon", name: "Bacon", priceEUR: 1 },
  { id: "double-steak", name: "Double steak", priceEUR: 3 },
  { id: "pickles", name: "Pickles", priceEUR: 1 },
  { id: "sauce-pops", name: "Sauce POP'S", priceEUR: 1 },
  { id: "sauce-algerienne", name: "Sauce Algérienne", priceEUR: 1 },
  { id: "sauce-samourai", name: "Sauce Samouraï", priceEUR: 1 },
  { id: "nashville", name: "Option Nashville 🔥", priceEUR: 0 },
  { id: "oignons-caramelises", name: "Oignon caramélisée", priceEUR: 1 },
  { id: "jalapenos", name: "Jalapeños", priceEUR: 1 },
  { id: "galette-pomme-terre", name: "Galette de pomme de terre", priceEUR: 1.5 },
  { id: "fromage-chevre", name: "Fromage de chèvre", priceEUR: 1 },
  { id: "raclette", name: "Raclette", priceEUR: 1 },
  { id: "viande-hachee", name: "Viande hachée", priceEUR: 2 },
  { id: "tenders-supp", name: "Tenders", priceEUR: 2 },
  { id: "cordon-bleu", name: "Cordon bleu", priceEUR: 2 },
  { id: "pastrami", name: "Pastrami", priceEUR: 2 },
];

// -- supplement bundles per category ------------------------------------

const SMASH_SUPPLEMENTS = [
  "cheddar", "bacon", "oignons-frits", "oignons-caramelises", "pickles", "jalapenos", "galette-pomme-terre",
  "fromage-chevre", "raclette", "viande-hachee", "pastrami", "double-steak", "sauce-pops"
];

const WRAP_SUPPLEMENTS = [
  "cheddar", "oignons-frits", "sauce-pops", "sauce-algerienne", "nashville"
];

const TACOS_SUPPLEMENTS = [
  "cheddar", "oignons-frits", "sauce-pops", "sauce-algerienne", "sauce-samourai", "nashville", "cordon-bleu", "tenders-supp", "viande-hachee"
];

const TASTY_SUPPLEMENTS = [
  "cheddar", "bacon", "sauce-pops", "sauce-samourai"
];

const BOWL_SUPPLEMENTS = [
  "cheddar", "bacon", "sauce-pops", "sauce-algerienne", "nashville"
];

const BOX_SUPPLEMENTS = [
  "cheddar", "bacon", "oignons-frits", "sauce-pops", "nashville"
];

const BUCKET_SUPPLEMENTS = [
  "sauce-pops", "sauce-samourai", "sauce-algerienne", "nashville"
];

const PLATS_SUPPLEMENTS = [
  "sauce-pops", "sauce-algerienne", "sauce-samourai"
];

// -- products -----------------------------------------------------------

const RAW_PRODUCTS: Omit<Product, \"imageUrl\">[] = [
  // Smash Burgers ------------------------------------------------------
  {
    id: "smash-chicken",
    categoryId: "smash-burgers",
    name: "Chicken Burger",
    description: "Poulet croustillant, pain brioché smashé, cheddar fondant.",
    priceEUR: 7,
    tags: [],
    availableSupplements: SMASH_SUPPLEMENTS,
    prepTimeMinutes: 15,
  },
  {
    id: "smash-cheese",
    categoryId: "smash-burgers",
    name: "Cheese",
    description: "Pain brioché smashé, double cheddar fondant, sauce maison.",
    priceEUR: 8,
    variants: smashVariants(8),
    tags: ["TOP"],
    availableSupplements: SMASH_SUPPLEMENTS,
    prepTimeMinutes: 15,
  },
  {
    id: "smash-beef",
    categoryId: "smash-burgers",
    name: "Beef",
    description: "Steak haché smashé minute, oignons grillés, double cheddar.",
    priceEUR: 8,
    variants: smashVariants(8),
    tags: ["TOP"],
    availableSupplements: SMASH_SUPPLEMENTS,
    prepTimeMinutes: 15,
  },
  {
    id: "smash-raclette",
    categoryId: "smash-burgers",
    name: "Raclette",
    description: "Raclette coulante, oignons confits, pain brioché smashé.",
    priceEUR: 9,
    variants: smashVariants(9),
    tags: [],
    availableSupplements: SMASH_SUPPLEMENTS,
    prepTimeMinutes: 15,
  },
  {
    id: "smash-bacon",
    categoryId: "smash-burgers",
    name: "Bacon",
    description: "Bacon croustillant, cheddar fondant, sauce barbecue maison.",
    priceEUR: 9,
    variants: smashVariants(9),
    tags: [],
    availableSupplements: SMASH_SUPPLEMENTS,
    prepTimeMinutes: 15,
  },
  {
    id: "smash-rosti",
    categoryId: "smash-burgers",
    name: "Rosti",
    description: "Galette de pommes de terre dorée, cheddar, sauce crémeuse.",
    priceEUR: 9,
    variants: smashVariants(9),
    tags: ["TOP"],
    availableSupplements: SMASH_SUPPLEMENTS,
    prepTimeMinutes: 15,
  },
  {
    id: "smash-mixte",
    categoryId: "smash-burgers",
    name: "Mixte",
    description: "Double steak, double cheddar, bacon — pour les affamés.",
    priceEUR: 9,
    variants: smashVariants(9),
    tags: [],
    availableSupplements: SMASH_SUPPLEMENTS,
    prepTimeMinutes: 15,
  },
  {
    id: "smash-smoky",
    categoryId: "smash-burgers",
    name: "Smoky",
    description: "2 steaks viande hachée, pastrami, sauce poivrée, oignon caramélisé, cheddar.",
    priceEUR: 10,
    tags: ["NOUVEAU"],
    availableSupplements: SMASH_SUPPLEMENTS,
    prepTimeMinutes: 15,
  },
  {
    id: "smash-gourmet",
    categoryId: "smash-burgers",
    name: "Le Gourmet",
    description: "2 steaks XL, jalapenos, pastrami, oignon caramélisé, cheddar.",
    priceEUR: 10,
    tags: ["NOUVEAU", "TOP"],
    availableSupplements: SMASH_SUPPLEMENTS,
    prepTimeMinutes: 15,
  },
  {
    id: "smash-baleze",
    categoryId: "smash-burgers",
    name: "Le Balèze",
    description: "3 steaks XL, sauce biggi, galette de pomme de terre, 2 tenders, salade, cheddar.",
    priceEUR: 12,
    tags: ["NOUVEAU"],
    availableSupplements: SMASH_SUPPLEMENTS,
    prepTimeMinutes: 15,
  },
  {
    id: "smash-chevre-miel",
    categoryId: "smash-burgers",
    name: "Chèvre Miel",
    description: "Chèvre fondant, miel, noix, sauce moutarde à l'ancienne.",
    priceEUR: 9,
    variants: smashVariants(9),
    tags: ["NOUVEAU"],
    availableSupplements: SMASH_SUPPLEMENTS,
    prepTimeMinutes: 15,
  },
  {
    id: "burger-chicken-nashville",
    categoryId: "smash-burgers",
    name: "Burger Chicken Nashville 🔥",
    description: "Burger au poulet mariné façon Nashville, bien piquant.",
    priceEUR: 9,
    tags: ["SPICY", "NOUVEAU"],
    availableSupplements: SMASH_SUPPLEMENTS,
    prepTimeMinutes: 15,
  },

  // Wraps --------------------------------------------------------------
  {
    id: "wrap-tenders",
    categoryId: "wraps",
    name: "Wrap Tenders",
    description: "Tortilla moelleuse, tenders croustillants, sauce POP'S.",
    priceEUR: 7,
    tags: [],
    availableSupplements: WRAP_SUPPLEMENTS,
    prepTimeMinutes: 10,
  },
  {
    id: "wrap-master",
    categoryId: "wraps",
    name: "Wrap Master",
    description: "Tortilla, steak haché, cheddar, crudités, sauce maison.",
    priceEUR: 8,
    tags: ["TOP"],
    availableSupplements: WRAP_SUPPLEMENTS,
    prepTimeMinutes: 10,
  },
  {
    id: "wrap-nashville",
    categoryId: "wraps",
    name: "Wrap Nashville 🔥",
    description: "Tenders nashville, salade, cheddar, sauce au choix.",
    priceEUR: 8,
    tags: ["SPICY", "NOUVEAU"],
    availableSupplements: WRAP_SUPPLEMENTS,
    prepTimeMinutes: 10,
  },

  // Tacos --------------------------------------------------------------
  {
    id: "tacos-tenders",
    categoryId: "tacos",
    name: "Tacos Tenders",
    description: "Galette tacos, tenders, cheddar fondant, sauce algérienne.",
    priceEUR: 7,
    tags: [],
    availableSupplements: TACOS_SUPPLEMENTS,
    prepTimeMinutes: 12,
  },
  {
    id: "tacos-viande-hachee",
    categoryId: "tacos",
    name: "Tacos Viande Hachée",
    description: "Galette tacos, steak haché, double sauce, frites.",
    priceEUR: 8,
    tags: ["TOP"],
    availableSupplements: TACOS_SUPPLEMENTS,
    prepTimeMinutes: 12,
  },
  {
    id: "tacos-cordon-bleu",
    categoryId: "tacos",
    name: "Tacos Cordon Bleu",
    description: "Galette tacos, cordon bleu, cheddar, sauce samouraï.",
    priceEUR: 8,
    tags: [],
    availableSupplements: TACOS_SUPPLEMENTS,
    prepTimeMinutes: 12,
  },

  // Tasty --------------------------------------------------------------
  {
    id: "frite-cheddar",
    categoryId: "tasty",
    name: "Frite Cheddar",
    description: "Frites dorées nappées de cheddar fondant.",
    priceEUR: 4,
    tags: [],
    availableSupplements: TASTY_SUPPLEMENTS,
    prepTimeMinutes: 10,
  },
  {
    id: "frite-cheddar-bacon-oignons",
    categoryId: "tasty",
    name: "Frite Cheddar Bacon Oignons Frits",
    description: "Frites, cheddar, bacon croustillant, oignons frits.",
    priceEUR: 5,
    tags: ["TOP"],
    availableSupplements: TASTY_SUPPLEMENTS,
    prepTimeMinutes: 10,
  },
  {
    id: "tasty-mixte",
    categoryId: "tasty",
    name: "Tasty Mixte",
    description: "Plateau généreux à partager — viandes, frites, sauces maison.",
    priceEUR: 7,
    tags: [],
    availableSupplements: TASTY_SUPPLEMENTS,
    prepTimeMinutes: 10,
  },
  {
    id: "tasty-sucre",
    categoryId: "tasty",
    name: "Tasty Sucré",
    description: "Version sucrée — gaufres, glace, chantilly, topping au choix.",
    priceEUR: 7,
    tags: [],
    availableSupplements: TASTY_SUPPLEMENTS,
    prepTimeMinutes: 10,
  },
  {
    id: "tasty-piquant",
    categoryId: "tasty",
    name: "Tasty Piquant",
    description: "Pour les amateurs de sensations — sauces fortes, épices maison.",
    priceEUR: 7,
    tags: ["SPICY"],
    availableSupplements: TASTY_SUPPLEMENTS,
    prepTimeMinutes: 10,
  },

  // Bowls --------------------------------------------------------------
  {
    id: "bowl-tenders",
    categoryId: "bowls",
    name: "Bowl Tenders",
    description: "Frites, tenders, bacon, sauce cheddar, oignons frits.",
    priceEUR: 10,
    tags: [],
    availableSupplements: BOWL_SUPPLEMENTS,
    prepTimeMinutes: 12,
  },
  {
    id: "bowl-nashville",
    categoryId: "bowls",
    name: "Bowl Nashville 🔥",
    description: "Frites, tenders nashville, bacon, sauce cheddar, oignons frits.",
    priceEUR: 10,
    tags: ["SPICY"],
    availableSupplements: BOWL_SUPPLEMENTS,
    prepTimeMinutes: 12,
  },
  {
    id: "bowl-gratine",
    categoryId: "bowls",
    name: "Bowl Gratiné",
    description: "Frites, tenders, bacon, sauce cheddar, oignons frits et mozzarella fondue.",
    priceEUR: 11,
    tags: ["TOP", "NOUVEAU"],
    availableSupplements: BOWL_SUPPLEMENTS,
    prepTimeMinutes: 12,
  },
  {
    id: "bowl-galette",
    categoryId: "bowls",
    name: "Bowl Galette",
    description: "Riz, galette de pommes de terre, légumes grillés, sauce maison.",
    priceEUR: 10,
    tags: [],
    availableSupplements: BOWL_SUPPLEMENTS,
    prepTimeMinutes: 12,
  },

  // Box ----------------------------------------------------------------
  {
    id: "box-familiale",
    categoryId: "box",
    name: "Box Familiale",
    description: "4 smash burgers, 5 wings, 5 tenders, Frite XXL, 4 boissons au choix, Sauce blanche maison.",
    priceEUR: 29,
    tags: ["TOP"],
    availableSupplements: BOX_SUPPLEMENTS,
    prepTimeMinutes: 20,
  },
  {
    id: "box-nashville",
    categoryId: "box",
    name: "Box Nashville 🔥",
    description: "2 tenders nashville, frites, burger au choix et une boisson.",
    priceEUR: 15,
    tags: ["SPICY", "NOUVEAU"],
    availableSupplements: BOX_SUPPLEMENTS,
    prepTimeMinutes: 15,
  },
  {
    id: "box-1",
    categoryId: "box",
    name: "Box 1",
    description: "Assortiment généreux à composer — plusieurs viandes au choix.",
    priceEUR: 10,
    variants: SIZE_VARIANTS,
    tags: [],
    availableSupplements: BOX_SUPPLEMENTS,
    prepTimeMinutes: 15,
  },

  // Bucket -------------------------------------------------------------
  {
    id: "bucket-wings",
    categoryId: "bucket",
    name: "Bucket Wings",
    description: "5 wings, frites, boisson.",
    priceEUR: 8,
    tags: [],
    availableSupplements: BUCKET_SUPPLEMENTS,
    prepTimeMinutes: 15,
  },
  {
    id: "bucket-tenders",
    categoryId: "bucket",
    name: "Bucket Tenders",
    description: "5 tenders, frites, boisson.",
    priceEUR: 8,
    tags: [],
    availableSupplements: BUCKET_SUPPLEMENTS,
    prepTimeMinutes: 15,
  },
  {
    id: "bucket-mix",
    categoryId: "bucket",
    name: "Bucket Mix",
    description: "6 wings, 6 tenders, 2 frites, 2 boissons.",
    priceEUR: 16,
    tags: ["TOP"],
    availableSupplements: BUCKET_SUPPLEMENTS,
    prepTimeMinutes: 15,
  },
  {
    id: "bucket-family",
    categoryId: "bucket",
    name: "Bucket Family",
    description: "10 tenders, 10 wings, 3 frites, 3 boissons.",
    priceEUR: 26,
    tags: ["TOP"],
    availableSupplements: BUCKET_SUPPLEMENTS,
    prepTimeMinutes: 20,
  },

  // Plats --------------------------------------------------------------
  {
    id: "plat-cuisse-poulet",
    categoryId: "plats",
    name: "Cuisse de poulet",
    description: "Cuisse confite au four, peau dorée, accompagnement inclus.",
    priceEUR: 8,
    tags: [],
    availableSupplements: PLATS_SUPPLEMENTS,
    prepTimeMinutes: 12,
  },
  {
    id: "plat-saucisse",
    categoryId: "plats",
    name: "Saucisse",
    description: "Saucisse grillée maison, pain, moutarde à l'ancienne.",
    priceEUR: 6,
    tags: [],
    availableSupplements: PLATS_SUPPLEMENTS,
    prepTimeMinutes: 12,
  },
  {
    id: "plat-coque-monsieur",
    categoryId: "plats",
    name: "Coque Monsieur",
    description: "Croque revisité POP'S — jambon, fromage fondant, pain doré.",
    priceEUR: 7,
    tags: [],
    availableSupplements: PLATS_SUPPLEMENTS,
    prepTimeMinutes: 12,
  },
  {
    id: "plat-pates-poulet",
    categoryId: "plats",
    name: "Pâtes poulet crème fraîche",
    description: "Pâtes fraîches, poulet rôti, crème fraîche généreuse.",
    priceEUR: 9,
    tags: [],
    availableSupplements: PLATS_SUPPLEMENTS,
    prepTimeMinutes: 12,
  },
  {
    id: "plat-riz-thai",
    categoryId: "plats",
    name: "Riz thaï",
    description: "Riz thaï parfumé, légumes sautés, sauce soja maison.",
    priceEUR: 7,
    tags: [],
    availableSupplements: PLATS_SUPPLEMENTS,
    prepTimeMinutes: 12,
  },

  // Boissons -----------------------------------------------------------
  {
    id: "drink-coca",
    categoryId: "boissons",
    name: "Coca 33cl",
    description: "Canette bien fraîche, classique indémodable.",
    priceEUR: 2,
    tags: [],
    availableSupplements: [],
    prepTimeMinutes: 0,
  },
  {
    id: "drink-oasis",
    categoryId: "boissons",
    name: "Oasis 33cl",
    description: "Canette Oasis fruitée, bien fraîche pour accompagner.",
    priceEUR: 2,
    tags: [],
    availableSupplements: [],
    prepTimeMinutes: 0,
  },
  {
    id: "drink-eau",
    categoryId: "boissons",
    name: "Eau 50cl",
    description: "Bouteille d'eau plate 50 cl, pour l'hydratation.",
    priceEUR: 1.5,
    tags: [],
    availableSupplements: [],
    prepTimeMinutes: 0,
  },
];

export const PRODUCTS: Product[] = RAW_PRODUCTS.map((p) => ({
  ...p,
  imageUrl: imgFor(p.categoryId),
}));

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
    (p) => p.categoryId === "smash-burgers" && p.tags.includes("TOP"),
  );
  if (signature) return signature;
  const anySmash = PRODUCTS.find((p) => p.categoryId === "smash-burgers");
  if (anySmash) return anySmash;
  return PRODUCTS[0]!;
}
"""

with open("src/data/menu.ts", "w") as f:
    f.write(content)

