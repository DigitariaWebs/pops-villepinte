import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { AccountDeletionService } from './account-deletion.service';
import { UpdateDeletionRequestDto } from './dto/update-deletion-request.dto';

type DeletionStatus =
  | 'pending'
  | 'processing'
  | 'scheduled'
  | 'completed'
  | 'rejected'
  | 'cancelled';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminAccountDeletionController {
  constructor(private readonly service: AccountDeletionService) {}

  @Get('deletion-requests')
  list(@Query('status') status?: DeletionStatus) {
    return this.service.list(status);
  }

  @Patch('deletion-requests/:id')
  update(@Param('id') id: string, @Body() dto: UpdateDeletionRequestDto) {
    return this.service.update(id, dto);
  }

  // One-click fulfilment: deletes the matched account, then marks completed.
  @Post('deletion-requests/:id/execute')
  execute(@Param('id') id: string) {
    return this.service.execute(id);
  }
}
