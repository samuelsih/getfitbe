import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDTO } from './dto/register.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { LoginRequestDTO } from './dto/login.dto';
import { BaseResponse } from '#/response/base';
import { JwtGuard } from '#/guard/jwt.guard';
import { Request } from 'express';
import { FormDataRequest } from 'nestjs-form-data';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly event: EventEmitter2,
  ) {}

  @Post('user/register')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: RegisterRequestDTO })
  async registerAsUser(@Body() dto: RegisterRequestDTO) {
    const userID = await this.authService.registerUser(dto);
    this.event.emit('user.registered', userID);
    return new BaseResponse(201, 'Registered');
  }

  @Post('user/login')
  @HttpCode(200)
  @ApiBody({ type: LoginRequestDTO })
  async loginAsUser(@Body() dto: LoginRequestDTO) {
    const user = await this.authService.getUser(dto);
    const jwt = await this.authService.generateJWT(user);

    return new BaseResponse(200, 'OK', { user, jwt });
  }

  @UseGuards(JwtGuard)
  @Get('/me')
  @ApiBearerAuth()
  async whoami(@Req() request: Request) {
    return new BaseResponse(200, 'OK', request['user'] || request['trainer']);
  }
}
