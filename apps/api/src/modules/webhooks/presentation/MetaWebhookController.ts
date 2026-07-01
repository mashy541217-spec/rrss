import { Controller, Post, Get, Req, Res, Headers, HttpStatus, Logger, Body } from '@nestjs/common';
import { Request, Response } from 'express';
import { WebhookSignatureValidator } from '../application/WebhookSignatureValidator';
import { PublicationResolverService } from '../application/PublicationResolverService';

@Controller('webhooks')
export class MetaWebhookController {
  private readonly logger = new Logger(MetaWebhookController.name);

  constructor(
    private readonly signatureValidator: WebhookSignatureValidator,
    private readonly publicationResolver: PublicationResolverService,
  ) {}

  @Get('meta')
  verifyWebhook(@Req() req: Request, @Res() res: Response) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // In a real app this would check ConfigService
    const verifyToken = process.env.META_VERIFY_TOKEN || 'my_secure_token';

    if (mode === 'subscribe' && token === verifyToken) {
      this.logger.log('Webhook verified successfully');
      res.status(HttpStatus.OK).send(challenge);
    } else {
      res.sendStatus(HttpStatus.FORBIDDEN);
    }
  }

  @Post('meta')
  async receiveWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('x-hub-signature-256') signature: string,
    @Body() body: any
  ) {
    // We would ideally need raw body for accurate HMAC signature validation.
    // In NestJS, this requires custom middleware or `req.rawBody`.
    // Assuming req.rawBody is available for this demo.
    const rawPayload = (req as any).rawBody || JSON.stringify(body);

    if (!this.signatureValidator.validateMetaSignature(rawPayload, signature)) {
      return res.status(HttpStatus.UNAUTHORIZED).send('Invalid signature');
    }

    if (body.object === 'page' || body.object === 'instagram') {
      try {
        await this.publicationResolver.resolveMetaFeedback(body);
        res.status(HttpStatus.OK).send('EVENT_RECEIVED');
      } catch (error) {
        this.logger.error('Error resolving webhook payload', error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('ERROR');
      }
    } else {
      res.sendStatus(HttpStatus.NOT_FOUND);
    }
  }
}
