import { Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { ConfigService } from '@nestjs/config';
import { ulid } from 'ulid';
import { MemoryStoredFile } from 'nestjs-form-data';

@Injectable()
export class ImageService {
  constructor(
    private readonly objectStorage: MinioService,
    private readonly configService: ConfigService,
  ) {}

  async uploadImage(image: MemoryStoredFile, bucketName: string) {
    const filename = ulid();
    const host = this.configService.get('MINIO_ENDPOINT');
    const port = this.configService.get('MINIO_PORT');

    const result = await this.objectStorage.client.putObject(
      bucketName,
      filename.toString(),
      image.buffer,
      image.size,
      {
        'Content-Type': image.mimetype,
        'X-Image-Meta-Size': image.size,
      },
    );

    return {
      filename,
      imgURL: `${host}:${port}/${bucketName}/${filename}`,
      etag: result.etag,
    };
  }
}
