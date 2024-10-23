import { SetMetadata } from '@nestjs/common';

/**
 * 使用 @Public 装饰器不用验证TOKEN
 */
export const IS_PUBLIC_KEY = 'isPublic';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
