// PRICES MARKED "TBD" ARE PLACEHOLDERS — confirmed prices only on Bowls/Box (10/15/30 €).
// Replace with real prices once Abdoullah confirms.

import type { Category, Product, ProductVariant, Supplement } from "@/types";

// -- helpers ------------------------------------------------------------

function imgUrl(name: string): string {
  // URL-encode then swap %20 for + so the placeholder service renders spaces cleanly.
  return `https://placehold.co/600x400/FFCE00/111111?text=${encodeURIComponent(name).replace(/%20/g, "+")}`;
}

function smashVariants(basePrice: number): ProductVariant[] {
  // Each additional steak adds ~2 € on top of the 1-steak base price.
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
];

// -- supplement bundles per category ------------------------------------

const SMASH_SUPPLEMENTS = [
  "cheddar",
  "bacon",
  "oignons-frits",
  "pickles",
  "double-steak",
  "sauce-pops",
];

const WRAP_SUPPLEMENTS = [
  "cheddar",
  "oignons-frits",
  "sauce-pops",
  "sauce-algerienne",
  "nashville",
];

const TACOS_SUPPLEMENTS = [
  "cheddar",
  "oignons-frits",
  "sauce-pops",
  "sauce-algerienne",
  "sauce-samourai",
  "nashville",
];

const TASTY_SUPPLEMENTS = [
  "cheddar",
  "bacon",
  "sauce-pops",
  "sauce-samourai",
];

const BOWL_SUPPLEMENTS = [
  "cheddar",
  "bacon",
  "sauce-pops",
  "sauce-algerienne",
  "nashville",
];

const BOX_SUPPLEMENTS = [
  "cheddar",
  "bacon",
  "oignons-frits",
  "sauce-pops",
  "nashville",
];

const BUCKET_SUPPLEMENTS = [
  "sauce-pops",
  "sauce-samourai",
  "sauce-algerienne",
  "nashville",
];

const PLATS_SUPPLEMENTS = [
  "sauce-pops",
  "sauce-algerienne",
  "sauce-samourai",
];

// -- products -----------------------------------------------------------

export const PRODUCTS: Product[] = [
  // Smash Burgers ------------------------------------------------------
  {
    id: "smash-chicken",
    categoryId: "smash-burgers",
    name: "Chicken Burger",
    description: "Poulet croustillant, pain brioché smashé, cheddar fondant.",
    priceEUR: 7,
    imageUrl: imgUrl("Chicken Burger"),
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
    imageUrl: imgUrl("Cheese"),
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
    imageUrl: imgUrl("Beef"),
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
    imageUrl: imgUrl("Raclette"),
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
    imageUrl: imgUrl("Bacon"),
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
    imageUrl: imgUrl("Rosti"),
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
    imageUrl: imgUrl("Mixte"),
    tags: [],
    availableSupplements: SMASH_SUPPLEMENTS,
    prepTimeMinutes: 15,
  },
  {
    id: "smash-smoky",
    categoryId: "smash-burgers",
    name: "Smoky",
    description: "Sauce barbecue fumée, cheddar, bacon, oignons caramélisés.",
    priceEUR: 9,
    variants: smashVariants(9),
    imageUrl: imgUrl("Smoky"),
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
    imageUrl: imgUrl("Chèvre Miel"),
    tags: ["NOUVEAU"],
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
    imageUrl: imgUrl("Wrap Tenders"),
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
    imageUrl: imgUrl("Wrap Master"),
    tags: ["TOP"],
    availableSupplements: WRAP_SUPPLEMENTS,
    prepTimeMinutes: 10,
  },
  {
    id: "wrap-nashville",
    categoryId: "wraps",
    name: "Wrap Nashville 🔥",
    description: "Tortilla, poulet mariné au piment Nashville, sauce fraîcheur.",
    priceEUR: 8,
    imageUrl: imgUrl("Wrap Nashville"),
    tags: ["SPICY"],
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
    imageUrl: imgUrl("Tacos Tenders"),
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
    imageUrl: imgUrl("Tacos Viande Hachée"),
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
    imageUrl: imgUrl("Tacos Cordon Bleu"),
    tags: [],
    availableSupplements: TACOS_SUPPLEMENTS,
    prepTimeMinutes: 12,
  },

  // Tasty --------------------------------------------------------------
  {
    id: "tasty-mixte",
    categoryId: "tasty",
    name: "Tasty Mixte",
    description: "Plateau généreux à partager — viandes, frites, sauces maison.",
    priceEUR: 7,
    imageUrl: imgUrl("Tasty Mixte"),
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
    imageUrl: imgUrl("Tasty Sucré"),
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
    imageUrl: imgUrl("Tasty Piquant"),
    tags: ["SPICY"],
    availableSupplements: TASTY_SUPPLEMENTS,
    prepTimeMinutes: 10,
  },

  // Bowls --------------------------------------------------------------
  {
    id: "bowl-tenders",
    categoryId: "bowls",
    name: "Bowl Tenders",
    description: "Riz, tenders croustillants, légumes frais, sauce au choix.",
    priceEUR: 10,
    variants: SIZE_VARIANTS,
    imageUrl: imgUrl("Bowl Tenders"),
    tags: [],
    availableSupplements: BOWL_SUPPLEMENTS,
    prepTimeMinutes: 12,
  },
  {
    id: "bowl-galette",
    categoryId: "bowls",
    name: "Bowl Galette",
    description: "Riz, galette de pommes de terre, légumes grillés, sauce maison.",
    priceEUR: 10,
    variants: SIZE_VARIANTS,
    imageUrl: imgUrl("Bowl Galette"),
    tags: [],
    availableSupplements: BOWL_SUPPLEMENTS,
    prepTimeMinutes: 12,
  },
  {
    id: "bowl-nashville",
    categoryId: "bowls",
    name: "Bowl Nashville 🔥",
    description: "Riz, poulet Nashville bien piquant, crudités, sauce fraîcheur.",
    priceEUR: 10,
    variants: SIZE_VARIANTS,
    imageUrl: imgUrl("Bowl Nashville"),
    tags: ["SPICY"],
    availableSupplements: BOWL_SUPPLEMENTS,
    prepTimeMinutes: 12,
  },

  // Box ----------------------------------------------------------------
  {
    id: "box-1",
    categoryId: "box",
    name: "Box 1",
    description: "Assortiment généreux à composer — plusieurs viandes au choix.",
    priceEUR: 10,
    variants: SIZE_VARIANTS,
    imageUrl: imgUrl("Box 1"),
    tags: [],
    availableSupplements: BOX_SUPPLEMENTS,
    prepTimeMinutes: 15,
  },
  {
    id: "box-2",
    categoryId: "box",
    name: "Box 2",
    description: "Box familiale à partager — viandes, frites, boissons incluses.",
    priceEUR: 10,
    variants: SIZE_VARIANTS,
    imageUrl: imgUrl("Box 2"),
    tags: ["TOP"],
    availableSupplements: BOX_SUPPLEMENTS,
    prepTimeMinutes: 15,
  },
  {
    id: "box-3",
    categoryId: "box",
    name: "Box 3",
    description: "La grosse box pour les grosses faims — tout y passe.",
    priceEUR: 10,
    variants: SIZE_VARIANTS,
    imageUrl: imgUrl("Box 3"),
    tags: [],
    availableSupplements: BOX_SUPPLEMENTS,
    prepTimeMinutes: 15,
  },

  // Bucket -------------------------------------------------------------
  {
    id: "bucket-tenders",
    categoryId: "bucket",
    name: "Bucket Tenders",
    description: "12 tenders croustillants à partager, 3 sauces au choix.",
    priceEUR: 12,
    imageUrl: imgUrl("Bucket Tenders"),
    tags: [],
    availableSupplements: BUCKET_SUPPLEMENTS,
    prepTimeMinutes: 15,
  },
  {
    id: "bucket-wings",
    categoryId: "bucket",
    name: "Bucket Wings",
    description: "Ailes de poulet marinées, croustillantes, sauces maison.",
    priceEUR: 12,
    imageUrl: imgUrl("Bucket Wings"),
    tags: [],
    availableSupplements: BUCKET_SUPPLEMENTS,
    prepTimeMinutes: 15,
  },
  {
    id: "bucket-pops",
    categoryId: "bucket",
    name: "Bucket Pops",
    description: "Pop corn chicken dorés, dips variés, à grignoter à plusieurs.",
    priceEUR: 12,
    imageUrl: imgUrl("Bucket Pops"),
    tags: [],
    availableSupplements: BUCKET_SUPPLEMENTS,
    prepTimeMinutes: 15,
  },
  {
    id: "bucket-familial",
    categoryId: "bucket",
    name: "Bucket Familial 🔥",
    description: "Gros bucket pour toute la famille — wings, tenders, pops Nashville.",
    priceEUR: 25,
    imageUrl: imgUrl("Bucket Familial"),
    tags: ["SPICY", "TOP"],
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
    imageUrl: imgUrl("Cuisse de poulet"),
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
    imageUrl: imgUrl("Saucisse"),
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
    imageUrl: imgUrl("Coque Monsieur"),
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
    imageUrl: imgUrl("Pâtes poulet crème fraîche"),
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
    imageUrl: imgUrl("Riz thaï"),
    tags: [],
    availableSupplements: PLATS_SUPPLEMENTS,
    prepTimeMinutes: 12,
  },
  {
    id: "plat-brick-poulet",
    categoryId: "plats",
    name: "Brick de poulet",
    description: "Brick croustillante, poulet épicé, herbes fraîches.",
    priceEUR: 6,
    imageUrl: imgUrl("Brick de poulet"),
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
    imageUrl: imgUrl("Coca 33cl"),
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
    imageUrl: imgUrl("Oasis 33cl"),
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
    imageUrl: imgUrl("Eau 50cl"),
    tags: [],
    availableSupplements: [],
    prepTimeMinutes: 0,
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

/**
 * Signature product for the Accueil hero card. Prefers a smash burger that
 * carries the TOP tag, falls back to any smash burger, and finally any
 * product — so it is guaranteed to return something even if the data shifts.
 */
export function getFeaturedProduct(): Product {
  const signature = PRODUCTS.find(
    (p) => p.categoryId === "smash-burgers" && p.tags.includes("TOP"),
  );
  if (signature) return signature;
  const anySmash = PRODUCTS.find((p) => p.categoryId === "smash-burgers");
  if (anySmash) return anySmash;
  // PRODUCTS is non-empty by construction above.
  return PRODUCTS[0]!;
}
