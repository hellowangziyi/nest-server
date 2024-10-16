import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * @jwt认证登录
   * @param user
   */
  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      code: 200,
      data: {
        // id: user.id,
        username: user.username,
      },
      token: this.jwtService.sign(payload),
    };
  }

  async validateToken(token: string) {
    const decoded = this.jwtService.verify(token);
    return decoded;
  }
}
