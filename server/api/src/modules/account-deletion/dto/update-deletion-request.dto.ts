import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateDeletionRequestDto {
  @IsOptional()
  @IsIn(['pending', 'processing', 'completed', 'rejected'])
  status?: 'pending' | 'processing' | 'completed' | 'rejected';

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  admin_notes?: string;
}
