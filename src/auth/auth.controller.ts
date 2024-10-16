import { Controller, Post, Body, Get, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/login')
  async login(@Body() body: { credential: string }) {
    const profile = await this.jwtService.decode(body.credential);

    console.log(profile);

    const jwtPayload = {
      name: profile.name,
      email: profile.email,
    };

    const token = this.jwtService.sign(jwtPayload);
    return {
      code: 0,
      data: {
        token,
        user: { ...jwtPayload },
      },
      message: 'login success',
    };
  }

  @Get('check_logined')
  async checkLogined(@Headers('authorization') authHeader: string) {
    // 通常 Authorization 头包含 "Bearer <token>"
    const token = authHeader?.split(' ')[1]; // 提取 token
    const decode = await this.authService.validateToken(token);
    console.log(decode);
    return {
      code: 0,
      message: 'success',
      data: {
        ...decode,
      },
    };
  }
}
