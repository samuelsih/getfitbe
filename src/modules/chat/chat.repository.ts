import { DB } from '#/tables';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CreateMessageDTO } from './dto/message.dto';
import { PostgresErrorCode, isDatabaseError } from '#/tables/error';
import { Redis } from 'ioredis';
import { InjectRedis } from '@songkeys/nestjs-redis';

@Injectable()
export class ChatRepository {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectKysely() private readonly db: DB,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async getAllConversations(userID: string) {
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

  async insertMessage(dto: CreateMessageDTO, senderID: string) {
    try {
      const result = await this.db
        .with('inserted', (eb) =>
          eb.insertInto('messages').values({
            content: dto.message,
            conversation_id: dto.conversation_id,
            sender_id: senderID,
          }),
        )
        .selectFrom('conversations')
        .where('conversations.id', '=', dto.conversation_id)
        .select(['id', 'trainer_id as trainerID', 'user_id as userID'])
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
}
