import { PrismaService } from '@/common';
import { Country } from '@/common/models/country';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getCountryList() {
    const countries = await this.prisma.product_country_tab.findMany();
    console.log(
      'coun',
      countries,
      countries.map((country) => plainToClass(Country, country)),
    );
    return countries.map((country) => plainToClass(Country, country));
  }
}
