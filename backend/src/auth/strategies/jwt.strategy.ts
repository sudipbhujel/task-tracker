import { UserDocument } from '@/user/schemas/user.schema';
import { UserService } from '@/user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

export type User = UserDocument;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
  ) {
    const jwtSecret = configService.get('JWT_SECRET'),
      jwtCookieName = configService.get('JWT_COOKIE_NAME');
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => this.extractJwtFromCookie(req, jwtCookieName),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('token'),
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  private extractJwtFromCookie(req: Request, cookieName: string) {
    return req.cookies?.[cookieName];
  }

  async validate(payload: any): Promise<User> {
    const { sub: id } = payload;
    const user = await this.userService.findById(id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
