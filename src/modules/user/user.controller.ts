import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '#/guard/jwt.guard';
import { UpdateDTO } from './dto/update.dto';
import { BaseResponse } from '#/response/base';
import { FormDataRequest } from 'nestjs-form-data';
import { RegisterTrainerDTO } from './dto/trainer.dto';
import { ConfigService } from '@nestjs/config';
import { Role, RolesGuard } from '#/guard/role.guard';
import { JWTRole } from '#/decorator/roles.decorator';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Patch('/update')
  @UseGuards(JwtGuard)
  @ApiBody({ type: UpdateDTO })
  @ApiBearerAuth()
  async createMessage(@Req() request: Request, @Body() dto: UpdateDTO) {
    const user = request['user'];
    const { updatedUser, newJWT } = await this.userService.updateUser(
      user.id,
      dto,
    );

    return new BaseResponse(200, 'OK', {
      user: updatedUser,
      jwt: newJWT,
    });
  }

  @Post('trainer')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: RegisterTrainerDTO })
  async addCustomTrainer(@Body() dto: RegisterTrainerDTO) {
    const bucketName = this.configService.get('MINIO_BUCKET_PROFILE_IMG');
    const result = await this.userService.addTrainer(dto, bucketName);
    await this.userService.addConversation(result.id);
    return new BaseResponse(200, 'OK', result);
  }

  @Get('user/all')
  @JWTRole(Role.Trainer)
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth()
  async getAllUser() {
    const result = await this.userService.all();
    return new BaseResponse(200, 'OK', result);
  }

  @Get('user/:userID')
  @JWTRole(Role.Trainer)
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth()
  async getDetailUser(@Param('userID') userID: string) {
    const result = await this.userService.detailUser(userID);
    return new BaseResponse(200, 'OK', result);
  }
}
