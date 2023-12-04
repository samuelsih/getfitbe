import { DB } from '#/tables';
import { Inject, Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { RegisterRequestDTO } from './dto/register.dto';
import { sql } from 'kysely';
import { AlreadyExistsError } from '#/exception/alreadyExists.error';
import { LoginRequestDTO, LoginResultDTO } from './dto/login.dto';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

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
          'email_verified',
          'role',
          'created_at',
          'updated_at',
        ])
        .executeTakeFirstOrThrow();

      this.logger.debug({ mode: 'repository.addUser', data: result });
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
      .where('role', '=', 'USER')
      .where('password', '=', sql`crypt(${dto.password}, password)`)
      .select([
        'id',
        'name',
        'email',
        'image',
        'role',
        'created_at as createdAt',
        'updated_at as updatedAt',
      ])
      .executeTakeFirst();

    this.logger.debug({ mode: 'repository.findUser', data: result });
    return result as LoginResultDTO;
  }
}