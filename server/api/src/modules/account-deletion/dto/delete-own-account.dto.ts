import { IsOptional, IsString, MaxLength } from 'class-validator';

// Body for the authenticated self-deletion endpoint. Only an optional reason —
// the account is identified from the JWT, not the payload.
export class DeleteOwnAccountDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  reason?: string;
}
