import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../shared/dto/pagination.dto';

export type PaymentStatusFilter =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'refunded';

export class PaymentsQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'processing', 'paid', 'failed', 'refunded'])
  payment_status?: PaymentStatusFilter;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  date_from?: string;

  @IsOptional()
  @IsString()
  date_to?: string;
}
