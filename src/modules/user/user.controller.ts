import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '#/guard/jwt.guard';
import { UpdateDTO } from './dto/update.dto';
import { BaseResponse } from '#/response/base';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
}
