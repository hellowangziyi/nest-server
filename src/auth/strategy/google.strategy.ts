import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import type { VerifyCallback } from 'passport-google-oauth20';

export const GOOGLE_STRATEGY = 'google';

/**
 * @description 策略负责验证提取到的 JWT 是否有效，会解码令牌并提取用户信息（如用户 ID）
 * @export
 * @class GoogleStrategy
 * @extends {PassportStrategy(
 *   Strategy,
 *   GOOGLE_STRATEGY,
 * )}
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  GOOGLE_STRATEGY,
) {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
      scope: ['email', 'profile'],
      response_type: 'token',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    console.log('profile!!', profile);
    const user = {
      email: emails.value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos.value,
      accessToken,
    };
    done(null, user);
  }
}
