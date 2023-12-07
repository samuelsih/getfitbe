import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import Pusher from 'pusher';
import { Logger } from 'winston';

export interface MessageTrigger {
  conversationID: string;
  event: string;
  data: any;
}

@Injectable()
export class MessagingService {
  private readonly pusher: Pusher;

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    const pusher = new Pusher({
      appId: this.configService.get('PUSHER_APP_ID'),
      key: this.configService.get('PUSHER_APP_KEY'),
      secret: this.configService.get('PUSHER_APP_SECRET'),
      host: this.configService.get('PUSHER_APP_HOST'),
      port: this.configService.get('PUSHER_APP_PORT'),
      useTLS: false,
    });

    this.pusher = pusher;
  }

  @OnEvent('chat', { async: true })
  async trigger({ conversationID, event, data }: MessageTrigger) {
    try {
      await this.pusher.trigger(conversationID, event, data);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
