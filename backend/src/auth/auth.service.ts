import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { User } from './guards/jwt-auth.guard';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private userService: UserService,
  ) {}

  private hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  private comparePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  private authenticateRequest(request: Request, jwt: string) {
    const { res } = request;
    const expireTimeSpanInDays = parseInt(
      this.configService.get<string>('JWT_EXPIRATION_TIME'),
      10,
    );
    res.cookie(this.configService.get('JWT_COOKIE_NAME'), jwt, {
      httpOnly: true,
      expires: new Date(
        new Date().getTime() + expireTimeSpanInDays * 24 * 60 * 60 * 1000,
      ),
    });
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (!user) return null;

    if (user && this.comparePassword(pass, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async register(request: Request, user: Partial<User>) {
    const _user = await this.userService.findByEmail(user.email);

    if (_user) {
      throw new HttpException('User already exists.', 400);
    }

    // Hash password
    const hashedPassword = user.password
      ? this.hashPassword(user.password)
      : null;

    const registeredUser = await this.userService.create({
      ...user,
      password: hashedPassword,
    });

    const payload = {
      username: registeredUser?.email,
      sub: registeredUser.id,
    };
    const jwt = this.jwtService.sign(payload);

    this.authenticateRequest(request, jwt);

    return {
      ...registeredUser,
      token: jwt,
    } as User & { token: string };
  }

  async login(request: Request, user: User) {
    const payload = { email: user?.email, sub: user.id };

    const jwt = this.jwtService.sign(payload);

    const _user = await this.userService.findByEmail(user.email);

    this.authenticateRequest(request, jwt);

    if (!_user) {
      throw new HttpException('User not found', 404);
    }

    return {
      ..._user,
      token: jwt,
    } as User & { token: string };
  }

  async logout(request: Request) {
    const { res } = request;
    res.clearCookie(this.configService.get('JWT_COOKIE_NAME'));
  }
}
