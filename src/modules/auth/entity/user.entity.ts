import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({ example: 'mail@example.com' })
  email: string;

  @ApiProperty({ example: '6f056614-ac7a-4932-862a-ebe72a8544e7' })
  id: string;

  @ApiProperty()
  image?: string;

  @ApiProperty({ example: 'Seseorang' })
  name: string;

  @ApiProperty({ example: null })
  emailVerified?: Date;

  @ApiProperty({ example: 'USER' })
  role: 'TRAINER' | 'USER';

  @ApiProperty({ example: '2023-11-28T14:07:15.863Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-11-28T14:07:15.863Z' })
  updatedAt: Date;

  static create({
    name,
    role,
    email,
    id,
    image,
    emailVerified,
    createdAt,
    updatedAt,
  }: {
    name: string;
    role: 'USER' | 'TRAINER';
    email: string;
    id: string;
    image: string;
    emailVerified: Date;
    createdAt: Date;
    updatedAt: Date;
  }) {
    const user = new User();
    user.createdAt = createdAt;
    user.id = id;
    user.name = name;
    user.email = email;
    user.emailVerified = emailVerified;
    user.role = role;
    user.image = image;
    user.updatedAt = updatedAt;

    return user;
  }
}
