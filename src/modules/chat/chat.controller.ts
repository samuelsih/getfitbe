import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JWTRole } from '#/decorator/roles.decorator';
import { Role, RolesGuard } from '#/guard/role.guard';
import { JwtGuard } from '#/guard/jwt.guard';
import { Request } from 'express';
import { BaseResponse } from '#/response/base';
import { ApiTags } from '@nestjs/swagger';

@Controller('chat')
@ApiTags('Chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/list')
  @JWTRole(Role.User)
  @UseGuards(JwtGuard, RolesGuard)
  async getAvailableChats(@Req() request: Request) {
    const user = request['user'];
    const result = await this.chatService.getListTrainers(user.id);
    return new BaseResponse(200, 'OK', result);
  }
}
