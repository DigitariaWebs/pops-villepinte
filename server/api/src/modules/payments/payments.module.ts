import { Module, forwardRef } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { OrdersModule } from '../orders/orders.module';
import { StripeService } from './stripe.service';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentsAdminController } from './payments-admin.controller';

@Module({
  // forwardRef breaks the OrdersModule ↔ PaymentsModule cycle: orders create
  // PaymentIntents on checkout, payments emit order events / release orders on
  // webhook.
  imports: [forwardRef(() => OrdersModule), NotificationsModule],
  controllers: [PaymentsController, PaymentsAdminController],
  providers: [StripeService, PaymentsService],
  exports: [StripeService, PaymentsService],
})
export class PaymentsModule {}
