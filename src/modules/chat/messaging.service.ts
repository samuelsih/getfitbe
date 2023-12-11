import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import Pusher, { UserChannelData } from 'pusher';
import { Logger } from 'winston';
import { User } from '../auth/entity/user.entity';

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

  async auth(socketID: string, user: User, callback: string) {
    const { id, ...rest } = user;

    const request: UserChannelData = {
      id: id,
      user_info: rest,
    };

    const authenticatedUser = this.pusher.authenticateUser(socketID, request);
    if (authenticatedUser.auth === '' || authenticatedUser.user_data === '') {
      return null;
    }

    const response = JSON.stringify(authenticatedUser);

    const cb = callback.replace(/\\"/g, '') + '(' + response + ');';

    return cb;
  }
}
