import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectKysely } from 'nestjs-kysely';
import { DB } from '#/tables';
import { UpdateDTO } from './dto/update.dto';
import { PostgresErrorCode, isDatabaseError } from '#/tables/error';

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
}
