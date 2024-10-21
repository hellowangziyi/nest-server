import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Token } from '@/common';
import { JwtAuthGuard } from './guard/jwt.guard';
import { UserInfo } from '@/common/models';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/login')
  async login(@Body() body: { credential: string }) {
    if (!body.credential) {
      return new ForbiddenException('User information is abnormal');
    }

    const profile = await this.jwtService.decode(body.credential);

    console.log(profile);

    const jwtPayload: UserInfo = {
      name: profile.name,
      email: profile.email,
      picture: profile.picture,
    };

    const token = this.jwtService.sign({ ...jwtPayload });

    return { token, user: { ...jwtPayload } };
  }

  /**
   * @description 使用token装饰器，jwt strategy会将用户信息放入request.user，不用手动解析token即可直接获取
   * @param {UserInfo} user
   * @return {*}
   * @memberof AuthController
   */
  @Get('check_logined')
  @UseGuards(JwtAuthGuard)
  async checkLogined(@Token() user: UserInfo) {
    return user;
  }

  // async checkLogined(@Headers('authorization') authHeader: string) {
  // 通常 Authorization 头包含 "Bearer <token>"
  // const token = authHeader?.split(' ')[1]; // 提取 token
  // const decode = await this.authService.validateToken(token);
  //   return {
  //     code: 0,
  //     message: 'success',
  //     data: { ...decode },
  //   };
  // }
}
