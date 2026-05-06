import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_ANON } from '../../common/supabase/supabase.module';
import { MenuProductsQueryDto } from './dto/menu-query.dto';

@Injectable()
export class MenuService {
  constructor(
    @Inject(SUPABASE_ANON) private readonly supabase: SupabaseClient,
  ) {}

  async getCategories() {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data;
  }

  async getProducts(query: MenuProductsQueryDto) {
    let qb = this.supabase
      .from('products')
      .select(
        '*, product_variants(*), product_supplements(supplement_id, supplements(*))',
      )
      .eq('is_active', true)
      .eq('is_available', true);

    if (query.category_id) {
      qb = qb.eq('category_id', query.category_id);
    }

    if (query.search) {
      qb = qb.ilike('name', `%${query.search}%`);
    }

    qb = qb.order('name', { ascending: true });

    const { data, error } = await qb;
    if (error) throw error;
    return data;
  }

  async getProductById(id: string) {
    const { data, error } = await this.supabase
      .from('products')
      .select(
        '*, product_variants(*), product_supplements(supplement_id, supplements(*))',
      )
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async getSupplements() {
    const { data, error } = await this.supabase
      .from('supplements')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  }
}
