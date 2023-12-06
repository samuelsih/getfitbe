import { Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ChatService {
  constructor(
    private readonly repo: ChatRepository,
    private readonly event: EventEmitter2,
  ) {}

  async getListTrainers(userID: string) {
    const result = await this.repo.getAllConversations(userID);
    return result;
  }
}
