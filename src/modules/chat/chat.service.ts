import { Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { CreateMessageDTO } from './dto/message.dto';

@Injectable()
export class ChatService {
  constructor(private readonly repo: ChatRepository) {}

  async getListTrainers(userID: string) {
    const result = await this.repo.getAllConversations(userID);
    return result;
  }

  async addMessage(dto: CreateMessageDTO, senderID: string) {
    await this.repo.insertMessage(dto, senderID);
  }
}
