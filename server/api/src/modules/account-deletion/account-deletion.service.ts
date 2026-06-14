import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_ADMIN } from '../../common/supabase/supabase.module';
import { CreateDeletionRequestDto } from './dto/create-deletion-request.dto';
import { UpdateDeletionRequestDto } from './dto/update-deletion-request.dto';

@Injectable()
export class AccountDeletionService {
  constructor(
    @Inject(SUPABASE_ADMIN) private readonly supabase: SupabaseClient,
  ) {}

  // ── Public ────────────────────────────────────────────────────────────────

  async createRequest(dto: CreateDeletionRequestDto) {
    const phone = dto.phone.trim();

    const { data, error } = await this.supabase
      .from('account_deletion_requests')
      .insert({
        full_name: dto.full_name?.trim() || null,
        phone,
        email: dto.email?.trim().toLowerCase() || null,
        reason: dto.reason?.trim() || null,
        matched_user_id: await this.matchProfileId(phone),
      })
      .select('id, created_at')
      .single();

    if (error) throw error;
    // Deliberately minimal: don't leak whether an account exists.
    return { id: data.id, created_at: data.created_at };
  }

  // Best-effort link to the owning account. Accounts auth by phone, but the
  // requester may type it loosely (spaces, local 0-prefix), so match on the
  // trailing 9 significant digits rather than an exact string.
  private async matchProfileId(phone: string): Promise<string | null> {
    const digits = phone.replace(/\D/g, '');
    const tail = digits.slice(-9);
    if (tail.length < 6) return null;

    const { data } = await this.supabase
      .from('profiles')
      .select('id')
      .ilike('phone', `%${tail}`)
      .limit(2);

    // Only attach when the match is unambiguous.
    return data && data.length === 1 ? data[0].id : null;
  }

  // ── Admin ───────────────────────────────────────────────────────────────────

  async list(status?: 'pending' | 'processing' | 'completed' | 'rejected') {
    let qb = this.supabase
      .from('account_deletion_requests')
      .select(
        '*, matched:profiles!account_deletion_requests_matched_user_id_fkey(name, phone, role)',
      )
      .order('created_at', { ascending: false });
    if (status) qb = qb.eq('status', status);
    const { data, error } = await qb;
    if (error) throw error;
    return data ?? [];
  }

  async update(id: string, dto: UpdateDeletionRequestDto) {
    const patch: Record<string, unknown> = {};
    if (dto.status !== undefined) {
      patch.status = dto.status;
      patch.processed_at =
        dto.status === 'completed' || dto.status === 'rejected'
          ? new Date().toISOString()
          : null;
    }
    if (dto.admin_notes !== undefined) {
      patch.admin_notes = dto.admin_notes.trim() || null;
    }

    const { data, error } = await this.supabase
      .from('account_deletion_requests')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // Fulfil the request: delete the matched auth user (the profile row cascades,
  // same flow as driver removal) and mark the request completed.
  async execute(id: string) {
    const { data: reqRow, error: fetchErr } = await this.supabase
      .from('account_deletion_requests')
      .select('id, matched_user_id, status')
      .eq('id', id)
      .single();
    if (fetchErr || !reqRow) throw new NotFoundException('Request not found');

    if (!reqRow.matched_user_id) {
      throw new BadRequestException(
        'No account is linked to this request — delete the account manually, then mark it completed.',
      );
    }

    const { error: authErr } = await this.supabase.auth.admin.deleteUser(
      reqRow.matched_user_id,
    );
    // 404 from auth means the user is already gone — treat as success.
    if (authErr && !/not\s*found/i.test(authErr.message)) {
      throw new BadRequestException(authErr.message);
    }

    const { data, error } = await this.supabase
      .from('account_deletion_requests')
      .update({
        status: 'completed',
        processed_at: new Date().toISOString(),
        // The FK already nulled matched_user_id on cascade; keep the row as audit.
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
