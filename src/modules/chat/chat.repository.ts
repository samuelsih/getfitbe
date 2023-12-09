import { DB } from '#/tables';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CreateMessageDTO } from './dto/message.dto';
import { PostgresErrorCode, isDatabaseError } from '#/tables/error';

@Injectable()
export class ChatRepository {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectKysely() private readonly db: DB,
  ) {}

  async getAllConversationsForUser(userID: string) {
    const result = await this.db
      .selectFrom('conversations')
      .innerJoin('users', 'conversations.trainer_id', 'users.id')
      .where('conversations.user_id', '=', userID)
      .select([
        'conversations.id as conversationID',
        'users.id as trainerID',
        'users.name as trainerName',
        'users.email as trainerEmail',
        'users.image as image',
      ])
      .execute();

    this.logger.debug({ result: result });

    return result;
  }

  async getAllConversationsForTrainer(userID: string) {
    const result = await this.db
      .selectFrom('conversations')
      .innerJoin('users', 'conversations.user_id', 'users.id')
      .where('conversations.trainer_id', '=', userID)
      .select([
        'conversations.id as conversationID',
        'users.id as userID',
        'users.name as userName',
        'users.image as userImage',
      ])
      .execute();

    return result;
  }

  async insertMessage(dto: CreateMessageDTO, senderID: string) {
    try {
      const result = await this.db
        .with('inserted', (eb) =>
          eb
            .insertInto('messages')
            .values({
              content: dto.message,
              conversation_id: dto.conversation_id,
              sender_id: senderID,
            })
            .returningAll(),
        )
        .selectFrom('conversations')
        .innerJoin('inserted', 'conversation_id', 'inserted.conversation_id')
        .where('conversations.id', '=', dto.conversation_id)
        .select([
          'conversations.id as conversationID',
          'conversations.trainer_id as trainerID',
          'conversations.user_id as userID',
          'inserted.id as messageID',
          'inserted.content as messageContent',
          'inserted.created_at as messageCreatedAt',
        ])
        .executeTakeFirstOrThrow();

      return result;
    } catch (error) {
      if (
        isDatabaseError(error) &&
        error.code === PostgresErrorCode.ForeignKeyViolation
      ) {
        throw new BadRequestException(`Unknown data ${error.column}`);
      }

      throw error;
    }
  }

  async getAllMessages(userID: string, conversationID: string) {
    const result = await this.db
      .selectFrom('messages')
      .where('conversation_id', '=', conversationID)
      .orderBy('created_at desc')
      .select([
        'id',
        'sender_id as senderID',
        'content',
        'created_at as createdAt',
      ])
      .execute();

    return result;
  }
}
