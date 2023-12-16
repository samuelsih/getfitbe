import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectKysely } from 'nestjs-kysely';
import { DB } from '#/tables';
import { UpdateDTO } from './dto/update.dto';
import { PostgresErrorCode, isDatabaseError } from '#/tables/error';
import {
  RegisterTrainerDTO,
  RegisterTrainerWithImgURLDTO,
} from './dto/trainer.dto';
import { sql } from 'kysely';
import { AlreadyExistsError } from '#/exception/alreadyExists.error';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectKysely() private readonly db: DB,
  ) {}

  async update(userID: string, dto: UpdateDTO) {
    const toUpdate = {};
    if (dto.name) {
      Object.assign(toUpdate, { name: dto.name });
    }

    if (dto.bio) {
      Object.assign(toUpdate, { bio: dto.bio });
    }
    try {
      const result = await this.db
        .updateTable('users')
        .where('id', '=', userID)
        .set(toUpdate)
        .returning([
          'id',
          'name',
          'email',
          'image',
          'email_verified as emailVerified',
          'bio',
          'role',
          'created_at as createdAt',
          'updated_at as updatedAt',
        ])
        .executeTakeFirstOrThrow();

      return result;
    } catch (error) {
      if (
        isDatabaseError(error) &&
        error.code === PostgresErrorCode.ForeignKeyViolation
      ) {
        throw new BadRequestException(`Unknown user`);
      }

      this.logger.error(error);
      throw error;
    }
  }

  async insertTrainer(
    dto: RegisterTrainerDTO | RegisterTrainerWithImgURLDTO,
    withImg: boolean = false,
  ) {
    if (withImg) {
      return this.addTrainerWithImg(dto as RegisterTrainerWithImgURLDTO);
    }

    try {
      const result = await this.db
        .insertInto('users')
        .values({
          name: dto.name,
          email: dto.email,
          password: sql`crypt(${dto.password}, gen_salt('bf'))`,
          role: 'TRAINER',
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

      this.logger.debug({ mode: 'repository.addTrainerWithImg', data: result });

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

  private async addTrainerWithImg(dto: RegisterTrainerWithImgURLDTO) {
    try {
      const result = await this.db
        .insertInto('users')
        .values({
          name: dto.name,
          email: dto.email,
          password: sql`crypt(${dto.password}, gen_salt('bf'))`,
          role: 'TRAINER',
          image: dto.avatar,
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

      this.logger.debug({ mode: 'repository.addTrainerWithImg', data: result });

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

  async addConversation(trainerID: string) {
    await sql`
      INSERT INTO conversations (user_id, trainer_id)
      SELECT id as user_id, ${trainerID} as trainer_id
      FROM users
      WHERE users.role = 'USER'
    `.execute(this.db);
  }
}
