import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/current-user.decorator';
import { PaymentsService } from './payments.service';
import { PaymentsQueryDto } from './dto/payments-query.dto';
import { RefundOrderDto } from './dto/refund-order.dto';

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
  refund(
    @Param('id') id: string,
    @Body() dto: RefundOrderDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.payments.refundOrder(id, dto, user.email);
  }
}
