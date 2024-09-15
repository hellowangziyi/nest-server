import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  // @Post('/login')
  // async login(@Body() user: any) {
  //   return await this.authService.login(user);
  // }
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
}
