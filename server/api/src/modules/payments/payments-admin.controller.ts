import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { PaymentsService } from './payments.service';
import { PaymentsQueryDto } from './dto/payments-query.dto';

@Controller('admin/payments')
@UseGuards(AdminGuard)
export class PaymentsAdminController {
  constructor(private readonly payments: PaymentsService) {}

  // Aggregate totals — declared before the (implicit) list so a future `:id`
  // route can never shadow it.
  @Get('summary')
  summary(@Query() query: PaymentsQueryDto) {
    return this.payments.getPaymentsSummary(query);
  }

  @Get()
  list(@Query() query: PaymentsQueryDto) {
    return this.payments.getPayments(query);
  }

  @Post(':id/refund')
  refund(@Param('id') id: string) {
    return this.payments.refundOrder(id);
  }
}
