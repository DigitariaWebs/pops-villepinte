import { Module, forwardRef } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersAdminController } from './orders-admin.controller';
import { OrdersService } from './orders.service';
import { OrdersGateway } from './orders.gateway';
import { NotificationsModule } from '../notifications/notifications.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [NotificationsModule, forwardRef(() => PaymentsModule)],
  controllers: [OrdersController, OrdersAdminController],
  providers: [OrdersService, OrdersGateway],
  exports: [OrdersGateway, OrdersService],
})
export class OrdersModule {}
