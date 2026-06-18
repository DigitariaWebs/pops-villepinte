import { Body, Controller, Delete, HttpCode, Post } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/current-user.decorator';
import { AccountDeletionService } from './account-deletion.service';
import { CreateDeletionRequestDto } from './dto/create-deletion-request.dto';
import { DeleteOwnAccountDto } from './dto/delete-own-account.dto';

@Controller('account-deletion')
export class AccountDeletionController {
  constructor(private readonly service: AccountDeletionService) {}

  // Public endpoint hit by the hosted account-deletion web page. No auth: a
  // user must be able to request deletion without (or after losing) account
  // access. Goes through admin review + manual execute.
  @Public()
  @HttpCode(201)
  @Post('request')
  request(@Body() dto: CreateDeletionRequestDto) {
    return this.service.createRequest(dto);
  }

  // Authenticated self-service deletion (Apple 5.1.1(v)). Protected by the
  // global SupabaseAuthGuard — the user can delete only their own account. Locks
  // the account immediately and schedules the permanent 30-day purge.
  @Delete('me')
  deleteOwn(@CurrentUser() user: AuthUser, @Body() dto: DeleteOwnAccountDto) {
    return this.service.deleteOwnAccount(user.id, dto.reason);
  }
}
