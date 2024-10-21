import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { UserInfo } from '@/common';
import { Token } from '@/common';
import { JwtAuthGuard } from '@/auth/guard/jwt.guard';
import { Action } from './product.service';

@Controller('product')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('country/getAllCountry')
  async getCountryList() {
    const countries = await this.productService.getCountryList();

    return { countries };
  }

  /**
   * @description 原意是根据action来判断增删改查，但作者认为应该符合RESTful API 设计原则,删除使用DELET方法,修改使用PUT方法
   * @param {{ action: number; countryIds: number[] }} body
   * @param {UserInfo} userInfo
   * @return {*}
   * @memberof ProductController
   */
  @Post('country/changePopular')
  async changePopular(
    @Body() body: { action: Action; countryIds: number[] },
    @Token() userInfo: UserInfo,
  ) {
    const { countryIds, action } = body;

    await this.productService.changePopularCountry(
      action,
      countryIds,
      userInfo.email,
    );
    return null;
  }
}
