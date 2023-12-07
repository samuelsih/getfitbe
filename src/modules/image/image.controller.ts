import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ImageService } from './image.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BaseResponse } from '#/response/base';
import { ConfigService } from '@nestjs/config';
import { UploadImageDTO } from './dto/upload.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { JWTRole } from '#/decorator/roles.decorator';
import { Role, RolesGuard } from '#/guard/role.guard';
import { JwtGuard } from '#/guard/jwt.guard';
import { Request } from 'express';

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
  @ApiBearerAuth()
  async upload(@Req() request: Request, @Body() uploadImgDTO: UploadImageDTO) {
    const img = await this.imageService.uploadImage(
      uploadImgDTO.image,
      this.configService.get('MINIO_BUCKET_IMG'),
    );

    await this.imageService.insertImage(request.user.id, img.imgURL);

    return new BaseResponse(201, 'Uploaded', {
      imgURL: img.imgURL,
    });
  }

  @JWTRole(Role.User)
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/list')
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', example: 1 })
  async findAll(@Req() request: Request, @Query('page') page: number = 1) {
    const result = await this.imageService.getAll(request.user.id, page);
    return new BaseResponse(200, 'OK', result);
  }
}
