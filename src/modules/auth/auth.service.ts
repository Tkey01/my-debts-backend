import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth-dto';
import { compare } from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser({ login, password }: AuthDto) {
    const user = await this.userService.findOne(login);
    if (user) {
      const isMatch = await compare(password, user.password);
      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: User) {
    const payload = { login: user.login, id: user.id };
    return {
      id: user.id,
      login: user.login,
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
      }),
    };
  }
}
