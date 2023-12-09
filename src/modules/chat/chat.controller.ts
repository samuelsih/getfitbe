import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JWTRole } from '#/decorator/roles.decorator';
import { Role, RolesGuard } from '#/guard/role.guard';
import { JwtGuard } from '#/guard/jwt.guard';
import { Request } from 'express';
import { BaseResponse } from '#/response/base';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateMessageDTO } from './dto/message.dto';

@Controller('chat')
@ApiTags('Chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/list/user')
  @JWTRole(Role.User)
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth()
  async getAvailableChatsForUser(@Req() request: Request) {
    const user = request['user'];
    const result = await this.chatService.getListTrainers(user.id);
    return new BaseResponse(200, 'OK', result);
  }

  @Get('/list/trainer')
  @JWTRole(Role.Trainer)
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth()
  async getAvailableChatsForTrainer(@Req() request: Request) {
    const trainer = request['user'];
    const result = await this.chatService.getListUsers(trainer.id);
    return new BaseResponse(200, 'OK', result);
  }

  @Get('/message/:conversationID')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async getMessageList(
    @Req() request: Request,
    @Param('conversationID') conversationID: string,
  ) {
    const user = request['user'];
    const result = await this.chatService.findAllMessages(
      user.id,
      conversationID,
    );
    return new BaseResponse(200, 'OK', result);
  }

  @Post('/message')
  @UseGuards(JwtGuard)
  @ApiBody({ type: CreateMessageDTO })
  @ApiBearerAuth()
  async createMessage(@Req() request: Request, @Body() dto: CreateMessageDTO) {
    const user = request['user'];
    await this.chatService.addMessage(dto, user.id);
    return new BaseResponse(200, 'OK');
  }
}
