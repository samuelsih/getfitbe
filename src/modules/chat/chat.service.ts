import { Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { CreateMessageDTO } from './dto/message.dto';
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

  async addMessage(dto: CreateMessageDTO, senderID: string) {
    const conversation = await this.repo.insertMessage(dto, senderID);
    const receiver =
      conversation.userID === senderID ? senderID : conversation.trainerID;

    this.event.emit('chat', {
      conversationID: conversation.conversationID,
      event: 'messages:new',
      data: {
        senderID: senderID,
        receiverID: receiver,
        content: dto.message,
      },
    });
    return conversation;
  }

  async findAllMessages(userID: string, conversationID: string) {
    const result = await this.repo.getAllMessages(userID, conversationID);
    return result;
  }
}
