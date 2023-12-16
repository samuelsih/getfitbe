import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UpdateDTO } from './dto/update.dto';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/entity/user.entity';
import {
  RegisterTrainerDTO,
  RegisterTrainerWithImgURLDTO,
} from './dto/trainer.dto';
import { ImageService } from '../image/image.service';

@Injectable()
export class UserService {
  constructor(
    private readonly repo: UserRepository,
    private readonly authService: AuthService,
    private readonly imgService: ImageService,
  ) {}

  async updateUser(userID: string, dto: UpdateDTO) {
    const result = await this.repo.update(userID, dto);
    const updatedUser = result as User;
    const newJWT = await this.authService.generateJWT(updatedUser);

    return { updatedUser, newJWT };
  }

  async addTrainer(dto: RegisterTrainerDTO, bucketName: string) {
    if (!dto.avatar) {
      const result = await this.repo.insertTrainer(dto);
      return result;
    }

    const img = await this.imgService.uploadImage(dto.avatar, bucketName);
    const withImgDTO = RegisterTrainerWithImgURLDTO.create(
      dto.name,
      dto.email,
      dto.password,
      img.imgURL,
    );

    const result = await this.repo.insertTrainer(withImgDTO, true);
    return result;
  }

  async addConversation(trainerID: string) {
    await this.repo.addConversation(trainerID);
  }
}
