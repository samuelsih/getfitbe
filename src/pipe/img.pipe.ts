import {
  HttpStatus,
  ParseFilePipeBuilder,
  UnprocessableEntityException,
} from '@nestjs/common';

const fiveMB = 1000 * 5000;

export const requiredImg = new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: '.(png|jpeg|jpg)',
  })
  .addMaxSizeValidator({ maxSize: fiveMB })
  .build({
    exceptionFactory: (error: string) => {
      return new UnprocessableEntityException([
        {
          field: 'image',
          error: [error.replace(/Validation failed \(/, '').slice(0, -1)],
        },
      ]);
    },
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    fileIsRequired: true,
  });

export const optionalImg = new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: '.(png|jpeg|jpg)',
  })
  .addMaxSizeValidator({ maxSize: fiveMB })
  .build({
    exceptionFactory: (error: string) => {
      return new UnprocessableEntityException([
        {
          field: 'image',
          error: [error.replace(/Validation failed \(/, '').slice(0, -1)],
        },
      ]);
    },
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    fileIsRequired: false,
  });
