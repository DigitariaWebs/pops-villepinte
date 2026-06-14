import { Module } from '@nestjs/common';
import { AccountDeletionController } from './account-deletion.controller';
import { AdminAccountDeletionController } from './admin-account-deletion.controller';
import { AccountDeletionService } from './account-deletion.service';

@Module({
  controllers: [AccountDeletionController, AdminAccountDeletionController],
  providers: [AccountDeletionService],
})
export class AccountDeletionModule {}
