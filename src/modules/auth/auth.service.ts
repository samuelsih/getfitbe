import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import {
  RegisterRequestDTO,
  RegisterRequestWithImgURLDTO,
} from './dto/register.dto';
import { LoginRequestDTO } from './dto/login.dto';
import { InvalidCredentialsError } from '#/exception/invalidCredentials.error';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { User } from './entity/user.entity';
import { ImageService } from '../image/image.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly repo: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly imgService: ImageService,
  ) {}

  async registerUser(dto: RegisterRequestDTO, bucketName: string) {
    if (!dto.avatar) {
      const result = await this.repo.addUser(dto);
      return result;
    }

    const img = await this.imgService.uploadImage(dto.avatar, bucketName);
    const withImgDTO = RegisterRequestWithImgURLDTO.create(
      dto.name,
      dto.email,
      dto.password,
      img.imgURL,
    );

    const result = await this.repo.addUser(withImgDTO, true);
    return result;
  }

  async getUser(dto: LoginRequestDTO) {
    const loginUser = await this.repo.findUser(dto);
    if (!loginUser) {
      throw new InvalidCredentialsError(dto.email);
    }

    return loginUser;
  }

  async generateJWT(payload: User) {
    const accessToken = await this.jwtService.signAsync(payload, {
      subject: payload.id,
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '1h',
      issuer: this.configService.get('JWT_ISSUER'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      subject: payload.id,
      secret: this.configService.get('JWT_REFRESH'),
      expiresIn: '7d',
      issuer: this.configService.get('JWT_ISSUER'),
    });
    return { accessToken, refreshToken };
  }

  @OnEvent('user.registered', { async: true })
  async handleUserOnRegistered(user: User) {
    await this.repo.addUserToConversation(user.id);
  }
}
