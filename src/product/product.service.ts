import { PrismaService } from '@/common';
import { Country } from '@/common/models/country';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

export enum Action {
  New,
  SingleDelete,
  BatchDelete,
}

const actionMap = {
  [Action.New]: 0,
  [Action.SingleDelete]: 1,
  [Action.BatchDelete]: 2,
};

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getCountryList() {
    const countries = await this.prisma.product_country_tab.findMany({
      orderBy: {
        country_sort: 'asc',
      },
    });

    return countries.map((country) => plainToClass(Country, country));
  }

  async addPopularCountry(countryIds: number[], email: string) {
    // 限制热门国家为5个
    const count = await this.prisma.product_country_tab.count({
      where: { is_popular: 1 },
    });
    if (count >= 5) throw new Error('最多只能添加5个热门国家');

    const updatePromises = countryIds.map(async (countryId, index) => {
      await this.prisma.product_country_tab.updateMany({
        where: { country_id: countryId },
        data: {
          is_popular: 1,
          gmt_modified: new Date(),
          country_sort: count + index + 1,
          operator: email,
        },
      });
    });
    return Promise.all(updatePromises);
  }

  async deletePopularCountry(countryIds: number[], email: string) {
    await this.prisma.product_country_tab.updateMany({
      where: { country_id: { in: countryIds } },
      data: {
        is_popular: 0,
        gmt_modified: new Date(),
        country_sort: 0,
        operator: email,
      },
    });

    const newPopularCountries = await this.prisma.product_country_tab.findMany({
      where: {
        country_id: { notIn: countryIds },
        is_popular: 1,
      },
    });

    const updatePromises = newPopularCountries.map(
      async ({ country_id }, index) => {
        await this.prisma.product_country_tab.updateMany({
          where: { country_id },
          data: {
            gmt_modified: new Date(),
            country_sort: index + 1,
            operator: email,
          },
        });
      },
    );
    return Promise.all(updatePromises);
  }

  async singleDeletePopularCountry(countryIds: number[], email: string) {
    const records = await this.prisma.product_country_tab.findFirstOrThrow({
      where: { country_id: countryIds[0] },
    });
    await this.prisma.product_country_tab.updateMany({
      where: { country_id: countryIds[0] },
      data: {
        is_popular: 0,
        gmt_modified: new Date(),
        operator: email,
        country_sort: 0,
      },
    });
    await this.prisma.product_country_tab.updateMany({
      where: { country_sort: { gt: records.country_sort }, is_popular: 1 },
      data: {
        country_sort: {
          decrement: 1,
        },
      },
    });
  }

  async changePopularCountry(
    action: Action,
    countryIds: number[],
    email: string,
  ) {
    switch (action) {
      case actionMap[Action.New]:
        await this.addPopularCountry(countryIds, email);
        break;
      case actionMap[Action.SingleDelete]:
        await this.deletePopularCountry(countryIds, email);
        break;
      case actionMap[Action.BatchDelete]:
        await this.deletePopularCountry(countryIds, email);
        break;
      default:
        throw new Error('Incorrect operation type');
    }
  }
  /**
   * @description 修改热门国家排序
   * @memberof ProductService
   */
  async changeSort() {}
}
