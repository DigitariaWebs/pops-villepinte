import { IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';

/**
 * Body for an admin-initiated refund. `amount_eur` is omitted for a full
 * refund and set (positive, ≤ remaining refundable) for a partial one. The
 * password re-authenticates the operator: refunds are irreversible on Stripe,
 * so we verify it against Supabase before touching money.
 */
export class RefundOrderDto {
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount_eur?: number;

  @IsString()
  @MinLength(1, { message: 'Mot de passe requis.' })
  password!: string;
}
