import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import Pusher from 'pusher';

export interface MessageTrigger {
  conversationID: string;
  event: string;
  data: any;
}

@Injectable()
export class MessagingService {
  private readonly pusher: Pusher;

  constructor(private readonly configService: ConfigService) {
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

  @OnEvent('chat')
  trigger({ conversationID, event, data }: MessageTrigger) {
    this.pusher.trigger(conversationID, event, data);
  }
}
