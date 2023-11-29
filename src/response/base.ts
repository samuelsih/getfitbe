import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse<T = void> {
  @ApiProperty()
  code: number;

  @ApiProperty()
  message: string;

  data?: T;

  constructor(code: number, message: string, data?: T) {
    this.code = code;
    this.message = message;
    this.data = data;
  }
}
