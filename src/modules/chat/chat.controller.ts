import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JWTRole } from '#/decorator/roles.decorator';
import { Role, RolesGuard } from '#/guard/role.guard';
import { JwtGuard } from '#/guard/jwt.guard';
import { Request } from 'express';
import { BaseResponse } from '#/response/base';
import { ApiTags } from '@nestjs/swagger';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateMessageDTO } from './dto/message.dto';

@Controller('chat')
@ApiTags('Chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly event: EventEmitter2,
  ) {}

  @Get('/list')
  @JWTRole(Role.User)
  @UseGuards(JwtGuard, RolesGuard)
  async getAvailableChats(@Req() request: Request) {
    const user = request['user'];
    const result = await this.chatService.getListTrainers(user.id);
    return new BaseResponse(200, 'OK', result);
  }

  @Post('/message')
  async createMessage(@Body() dto: CreateMessageDTO) {}

  @Get('/test')
  test() {
    this.event.emit('chat', {
      conversationID: '123',
      event: 'apa',
      data: 'fooo',
    });
  }
}
