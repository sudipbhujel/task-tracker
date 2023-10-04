import { UserDocument } from '@/user/schemas/user.schema';
import {
  createParamDecorator,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

export type User = UserDocument;

export const UserContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (!request.user) {
      console.warn('Forgot to use UserGuard');

      return null;
    }

    return request.user;
  },
);
