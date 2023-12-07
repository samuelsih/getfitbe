import { DB } from '#/tables';
import { Inject, Injectable } from '@nestjs/common';
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
      .select(['id', 'img_url as imgURL'])
      .limit(5)
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
      this.logger.error(error);
    }
  }
}
