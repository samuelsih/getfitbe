import { ROLES_KEY, Role as UserRole } from '#/guard/role.guard';
import { SetMetadata } from '@nestjs/common';

export const JWTRole = (role: UserRole) => SetMetadata(ROLES_KEY, role);
