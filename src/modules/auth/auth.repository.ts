import { DB } from '#/tables';
import { Inject, Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { RegisterRequestDTO } from './dto/register.dto';
import { sql } from 'kysely';
import { AlreadyExistsError } from '#/exception/alreadyExists.error';
import { LoginRequestDTO } from './dto/login.dto';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { User } from './entity/user.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectKysely() private readonly db: DB,
  ) {}

  async addUser(dto: RegisterRequestDTO) {
    try {
      const result = await this.db
        .insertInto('users')
        .values({
          name: dto.name,
          email: dto.email,
          password: sql`crypt(${dto.password}, gen_salt('bf'))`,
          role: 'USER',
        })
        .returning([
          'id',
          'name',
          'email',
          'image',
          'email_verified as emailVerified',
          'role',
          'created_at as createdAt',
          'updated_at as updatedAt',
        ])
        .executeTakeFirstOrThrow();

      this.logger.debug({ mode: 'repository.addUser', data: result });

      return result;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('unique constraint')) {
          throw new AlreadyExistsError('email');
        }
      }

      throw error;
    }
  }

  async findUser(dto: LoginRequestDTO) {
    const result = await this.db
      .selectFrom('users')
      .where('email', '=', dto.email)
      .where('password', '=', sql`crypt(${dto.password}, password)`)
      .select([
        'id',
        'name',
        'email',
        'image',
        'email_verified as emailVerified',
        'role',
        'created_at as createdAt',
        'updated_at as updatedAt',
      ])
      .executeTakeFirst();

    this.logger.debug({ mode: 'repository.findUser', data: result });
    return result as User;
  }

  async addUserToConversation(userID: string) {
    const trainers = await this.db
      .selectFrom('users')
      .where('role', '=', 'TRAINER')
      .selectAll()
      .execute();

    const inserted = [];
    trainers.forEach((trainer) => {
      inserted.push({
        user_id: userID,
        trainer_id: trainer.id,
      });
    });

    await this.db
      .insertInto('conversations')
      .values(inserted)
      .executeTakeFirstOrThrow();
  }

  async searchAllConversationTrainer(userID: string) {
    const result = await this.db
      .selectFrom('users')
      .innerJoin('conversations', 'users.id', 'conversations.user_id')
      .where('users.role', '=', 'TRAINER')
      .where('conversations.user_id', '=', userID)
      .select([
        'conversations.id as conversationID',
        'users.id',
        'users.name',
        'users.email',
        'users.image',
        'users.email_verified as emailVerified',
        'users.role',
        'users.created_at as createdAt',
        'users.updated_at as updatedAt',
      ])
      .execute();

    return result;
  }
}
