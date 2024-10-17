import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('country/getAllCountry')
  async getCountryList() {
    const countries = await this.productService.getCountryList();
    console.log('countries1', countries);
    return {
      code: 0,
      message: 'Success',
      data: {
        countries,
      },
    };
  }
}
