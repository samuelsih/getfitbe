import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { RegisterRequestDTO } from './dto/register.dto';
import { LoginRequestDTO, LoginResultDTO } from './dto/login.dto';
import { InvalidCredentialsError } from '#/exception/invalidCredentials.error';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly repo: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registerUser(dto: RegisterRequestDTO) {
    await this.repo.addUser(dto);
  }

  async getUser(dto: LoginRequestDTO) {
    const loginUser = await this.repo.findUser(dto);
    if (!loginUser) {
      throw new InvalidCredentialsError(dto.email);
    }

    return loginUser;
  }

  async generateJWT(payload: LoginResultDTO) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '1h',
      audience: payload.id,
      issuer: this.configService.get('JWT_ISSUER'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH'),
      expiresIn: '7d',
      audience: payload.id,
      issuer: this.configService.get('JWT_ISSUER'),
    });
    return { accessToken, refreshToken };
  }
}
