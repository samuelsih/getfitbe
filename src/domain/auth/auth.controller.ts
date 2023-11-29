import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDTO } from './dto/register.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginRequestDTO } from './dto/login.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('user/register')
  @ApiBody({ type: RegisterRequestDTO })
  async registerAsUser(@Body() dto: RegisterRequestDTO) {
    await this.authService.registerUser(dto);
    return {
      code: 201,
      message: 'Registered',
    };
  }

  @Post('user/login')
  @ApiBody({ type: LoginRequestDTO })
  async loginAsUser(@Body() dto: LoginRequestDTO) {
    const user = await this.authService.getUser(dto);
    const jwt = await this.authService.generateJWT(user);

    return {
      code: 200,
      message: 'OK',
      data: { user, accessToken: jwt },
    };
  }
}
