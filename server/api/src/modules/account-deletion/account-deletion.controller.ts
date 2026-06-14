import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { AccountDeletionService } from './account-deletion.service';
import { CreateDeletionRequestDto } from './dto/create-deletion-request.dto';

// Public endpoint hit by the hosted account-deletion web page. No auth: a user
// must be able to request deletion without (or after losing) account access.
@Controller('account-deletion')
export class AccountDeletionController {
  constructor(private readonly service: AccountDeletionService) {}

  @Public()
  @HttpCode(201)
  @Post('request')
  request(@Body() dto: CreateDeletionRequestDto) {
    return this.service.createRequest(dto);
  }
}
