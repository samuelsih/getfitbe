import { DB } from '#/tables';
import { Inject, Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class ChatRepository {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectKysely() private readonly db: DB,
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
}
