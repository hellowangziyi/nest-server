import { Expose } from 'class-transformer';

export class Country {
  @Expose({ name: 'id' })
  id: string;

  @Expose({ name: 'country_name' })
  countryName: string;

  @Expose({ name: 'operator' })
  operator: string;

  @Expose({ name: 'country_id' })
  countryId: string;

  @Expose({ name: 'country_sort' })
  countrySort: number;

  @Expose({ name: 'is_popular' })
  // @Type(() => Number)
  isPopular: number;
}
