import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UpdateDTO } from './dto/update.dto';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly repo: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async updateUser(userID: string, dto: UpdateDTO) {
    const result = await this.repo.update(userID, dto);
    const updatedUser = result as User;
    const newJWT = await this.authService.generateJWT(updatedUser);

    return { updatedUser, newJWT };
  }
}
