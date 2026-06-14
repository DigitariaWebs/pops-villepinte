import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

// Filed from the public web page by someone who may not be signed in, so the
// validation is deliberately lenient — phone is the account identifier, the
// rest is contact / context for the admin.
export class CreateDeletionRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  full_name?: string;

  @IsString()
  @Matches(/^[\d\s+().-]{6,20}$/, {
    message: 'Numéro de téléphone invalide',
  })
  phone!: string;

  @IsOptional()
  @IsEmail({}, { message: 'Adresse e-mail invalide' })
  @MaxLength(180)
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(2000)
  reason?: string;
}
