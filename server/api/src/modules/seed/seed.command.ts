import { Inject, Injectable } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_ADMIN } from '../../common/supabase/supabase.module';

// Menu data from mobile app (inline for seed independence)
const CATEGORIES = [
  { name: 'Box', icon: '📦', display_order: 0 },
  { name: 'Smash Burgers', icon: '🍔', display_order: 1 },
  { name: 'Buckets', icon: '🪣', display_order: 2 },
  { name: 'Bowls', icon: '🥗', display_order: 3 },
  { name: 'Wraps', icon: '🌯', display_order: 4 },
  { name: 'Frites', icon: '🍟', display_order: 5 },
];

const SUPPLEMENTS = [
  { name: 'Sauce Algérienne', price_eur: 0 },
  { name: 'Sauce Samouraï', price_eur: 0 },
  { name: 'Sauce Blanche', price_eur: 0 },
  { name: 'Sauce Barbecue', price_eur: 0 },
  { name: 'Sauce Ketchup', price_eur: 0 },
  { name: 'Sauce Andalouse', price_eur: 0 },
  { name: 'Sauce Harissa', price_eur: 0 },
  { name: 'Sauce Biggy Burger', price_eur: 0 },
  { name: 'Cheddar Fondu', price_eur: 1 },
  { name: 'Bacon', price_eur: 1.5 },
  { name: 'Oeuf', price_eur: 1 },
  { name: 'Galette de Pomme de Terre', price_eur: 1 },
  { name: 'Poulet Croustillant', price_eur: 2 },
  { name: 'Steak Haché', price_eur: 2 },
  { name: 'Supplément Frites', price_eur: 1.5 },
];

const PRODUCTS = [
  {
    name: "Pop's Box Poulet",
    description:
      'Tenders de poulet croustillant, frites maison, coleslaw et sauce au choix',
    price_eur: 12,
    category: 'Box',
    prep_time_minutes: 12,
    tags: ['TOP'],
  },
  {
    name: "Pop's Box Mixte",
    description:
      'Mix tenders & nuggets, frites maison, coleslaw et sauce au choix',
    price_eur: 13,
    category: 'Box',
    prep_time_minutes: 12,
    tags: [],
  },
  {
    name: "Pop's Box Nuggets",
    description: '10 nuggets croustillants, frites maison, coleslaw et sauce au choix',
    price_eur: 11,
    category: 'Box',
    prep_time_minutes: 10,
    tags: [],
  },
  {
    name: 'Le Classic Smash',
    description:
      'Steak smashé, cheddar fondu, oignons caramélisés, sauce maison',
    price_eur: 9,
    category: 'Smash Burgers',
    prep_time_minutes: 10,
    tags: ['TOP'],
  },
  {
    name: 'Le Double Smash',
    description:
      'Double steak smashé, double cheddar, pickles, sauce secrète',
    price_eur: 12,
    category: 'Smash Burgers',
    prep_time_minutes: 12,
    tags: ['NOUVEAU'],
  },
  {
    name: 'Le Chicken Smash',
    description:
      'Poulet pané croustillant, cheddar, salade, tomate, sauce algérienne',
    price_eur: 10,
    category: 'Smash Burgers',
    prep_time_minutes: 12,
    tags: [],
  },
  {
    name: 'Le Spicy Smash',
    description:
      'Steak smashé, jalapeños, pepper jack, oignons frits, sauce piquante',
    price_eur: 11,
    category: 'Smash Burgers',
    prep_time_minutes: 12,
    tags: ['SPICY'],
  },
  {
    name: 'Bucket Familial',
    description: '12 tenders, 12 nuggets, grande frites, 3 sauces',
    price_eur: 29,
    category: 'Buckets',
    prep_time_minutes: 18,
    tags: [],
  },
  {
    name: 'Bucket Tenders',
    description: '8 tenders de poulet, frites, 2 sauces au choix',
    price_eur: 18,
    category: 'Buckets',
    prep_time_minutes: 15,
    tags: ['TOP'],
  },
  {
    name: 'Bucket Nuggets',
    description: '20 nuggets croustillants, frites, 2 sauces au choix',
    price_eur: 16,
    category: 'Buckets',
    prep_time_minutes: 15,
    tags: [],
  },
  {
    name: 'Bowl Poulet Grillé',
    description:
      'Riz parfumé, poulet grillé mariné, légumes rôtis, sauce sésame',
    price_eur: 11,
    category: 'Bowls',
    prep_time_minutes: 12,
    tags: [],
  },
  {
    name: 'Bowl Crispy',
    description:
      'Riz, tenders croustillants, avocat, edamame, sauce teriyaki',
    price_eur: 12,
    category: 'Bowls',
    prep_time_minutes: 12,
    tags: ['NOUVEAU'],
  },
  {
    name: 'Bowl Veggie',
    description:
      'Riz complet, falafels, houmous, légumes grillés, sauce tahini',
    price_eur: 10,
    category: 'Bowls',
    prep_time_minutes: 10,
    tags: [],
  },
  {
    name: 'Wrap Poulet',
    description:
      'Tortilla, poulet croustillant, crudités, cheddar, sauce au choix',
    price_eur: 8,
    category: 'Wraps',
    prep_time_minutes: 8,
    tags: [],
  },
  {
    name: 'Wrap Spicy',
    description:
      'Tortilla, poulet épicé, jalapeños, oignons frits, sauce piquante',
    price_eur: 9,
    category: 'Wraps',
    prep_time_minutes: 8,
    tags: ['SPICY'],
  },
  {
    name: 'Wrap Veggie',
    description:
      'Tortilla, falafels, houmous, crudités, sauce blanche',
    price_eur: 8,
    category: 'Wraps',
    prep_time_minutes: 8,
    tags: [],
  },
  {
    name: 'Frites Classiques',
    description: 'Frites maison dorées et croustillantes',
    price_eur: 4,
    category: 'Frites',
    prep_time_minutes: 8,
    tags: [],
  },
  {
    name: 'Frites Cheddar Bacon',
    description: 'Frites maison, cheddar fondu, bacon émietté, ciboulette',
    price_eur: 7,
    category: 'Frites',
    prep_time_minutes: 10,
    tags: ['TOP'],
  },
  {
    name: 'Frites Poutine',
    description: 'Frites maison, sauce gravy, fromage en grains',
    price_eur: 8,
    category: 'Frites',
    prep_time_minutes: 10,
    tags: ['NOUVEAU'],
  },
];

@Command({ name: 'seed:menu', description: 'Seed menu data into Supabase' })
@Injectable()
export class SeedCommand extends CommandRunner {
  constructor(
    @Inject(SUPABASE_ADMIN) private readonly supabase: SupabaseClient,
  ) {
    super();
  }

  async run(): Promise<void> {
    console.log('🌱 Seeding menu data...');

    // 1. Upsert categories
    const { data: categories, error: catError } = await this.supabase
      .from('categories')
      .upsert(
        CATEGORIES.map((c) => ({ ...c, is_active: true })),
        { onConflict: 'name' },
      )
      .select();

    if (catError) {
      console.error('❌ Categories error:', catError.message);
      return;
    }
    console.log(`✅ ${categories.length} categories upserted`);

    const categoryMap = new Map(categories.map((c) => [c.name, c.id]));

    // 2. Upsert supplements
    const { data: supplements, error: supError } = await this.supabase
      .from('supplements')
      .upsert(
        SUPPLEMENTS.map((s) => ({ ...s, is_active: true })),
        { onConflict: 'name' },
      )
      .select();

    if (supError) {
      console.error('❌ Supplements error:', supError.message);
      return;
    }
    console.log(`✅ ${supplements.length} supplements upserted`);

    const supplementIds = supplements.map((s) => s.id);

    // 3. Upsert products
    const productRows = PRODUCTS.map((p) => ({
      name: p.name,
      description: p.description,
      price_eur: p.price_eur,
      category_id: categoryMap.get(p.category),
      prep_time_minutes: p.prep_time_minutes,
      tags: p.tags,
      is_available: true,
      is_active: true,
    }));

    const { data: products, error: prodError } = await this.supabase
      .from('products')
      .upsert(productRows, { onConflict: 'name' })
      .select();

    if (prodError) {
      console.error('❌ Products error:', prodError.message);
      return;
    }
    console.log(`✅ ${products.length} products upserted`);

    // 4. Link all supplements to all products (for this restaurant, all are available)
    const junctionRows = products.flatMap((product) =>
      supplementIds.map((supplementId) => ({
        product_id: product.id,
        supplement_id: supplementId,
      })),
    );

    // Delete existing and re-insert
    await this.supabase.from('product_supplements').delete().neq('product_id', '00000000-0000-0000-0000-000000000000');

    const { error: juncError } = await this.supabase
      .from('product_supplements')
      .insert(junctionRows);

    if (juncError) {
      console.error('❌ Product supplements error:', juncError.message);
      return;
    }
    console.log(
      `✅ ${junctionRows.length} product-supplement links created`,
    );

    console.log('🎉 Seed complete!');
  }
}
