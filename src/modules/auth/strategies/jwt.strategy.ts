import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../models/jwt.payload';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate({ id, login, iat }: JwtPayload) {
    const currentTime = Date.now();
    const isTokenStale =
      currentTime - iat * 1000 > +this.configService.get('TOKEN_LIFETIME');

    if (isTokenStale) {
      throw new UnauthorizedException();
    }
    return { id: id, login: login };
  }
}
