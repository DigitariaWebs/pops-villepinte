import {
  BadRequestException,
  Controller,
  Headers,
  Post,
  Req,
  type RawBodyRequest,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { Public } from '../../common/decorators/public.decorator';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  /**
   * Stripe webhook. Public (no bearer token — Stripe authenticates via the
   * signature header verified against STRIPE_WEBHOOK_SECRET over the raw body).
   * Configure the endpoint in the Stripe Dashboard to POST here and send
   * payment_intent.succeeded, payment_intent.payment_failed, charge.refunded.
   */
  @Public()
  @Post('webhook')
  async webhook(
    @Req() req: RawBodyRequest<FastifyRequest>,
    @Headers('stripe-signature') signature: string,
  ): Promise<{ received: true }> {
    if (!req.rawBody) {
      throw new BadRequestException('Missing raw body');
    }
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }
    await this.payments.handleWebhook(req.rawBody, signature);
    return { received: true };
  }
}
