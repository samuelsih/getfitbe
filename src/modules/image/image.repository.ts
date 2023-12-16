import { DB } from '#/tables';
import { PostgresErrorCode, isDatabaseError } from '#/tables/error';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectKysely } from 'nestjs-kysely';
import { Logger } from 'winston';

@Injectable()
export class ImageRepository {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectKysely() private readonly db: DB,
  ) {}

  async all(userID: string, page: number) {
    const result = await this.db
      .selectFrom('user_upload_img')
      .where('user_id', '=', userID)
      .select(['id', 'img_url as imgURL', 'created_at as createdAt'])
      .limit(5)
      .orderBy('createdAt desc')
      .offset(5 * (page - 1))
      .execute();

    return result;
  }

  async insert(userID: string, imgURL: string) {
    try {
      await this.db
        .insertInto('user_upload_img')
        .values({
          user_id: userID,
          img_url: imgURL,
        })
        .executeTakeFirstOrThrow();
    } catch (error) {
      if (
        isDatabaseError(error) &&
        error.code === PostgresErrorCode.ForeignKeyViolation
      ) {
        throw new BadRequestException(`Unknown data ${error.column}`);
      }

      this.logger.error(error);
      throw error;
    }
  }
}
