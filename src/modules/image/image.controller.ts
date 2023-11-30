import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ImageService } from './image.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from '#/response/base';
import { ConfigService } from '@nestjs/config';
import { UploadImageDTO } from './dto/upload.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { JWTRole } from '#/decorator/roles.decorator';
import { Role, RolesGuard } from '#/guard/role.guard';
import { JwtGuard } from '#/guard/jwt.guard';

@Controller('image')
@ApiTags('Upload Image')
export class ImageController {
  constructor(
    private readonly imageService: ImageService,
    private readonly configService: ConfigService,
  ) {}

  @JWTRole(Role.User)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('upload')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadImageDTO })
  async upload(@Body() uploadImgDTO: UploadImageDTO) {
    const imgURL = await this.imageService.uploadImage(
      uploadImgDTO.image,
      this.configService.get('MINIO_BUCKET_IMG'),
    );

    return new BaseResponse(201, 'Uploaded', { imgURL });
  }
}
