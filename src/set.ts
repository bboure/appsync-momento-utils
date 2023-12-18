import { Context, HTTPRequest } from '@aws-appsync/utils';
import { handleCache } from './utils';

export type SetRequestParams = {
  apiKey: string;
  cacheName: string;
  key: string;
  value: any;
  ttlSeconds?: number;
};

export const setRequest = (
  ctx: Context,
  params: SetRequestParams,
): HTTPRequest => {
  handleCache(ctx);

  const { apiKey, cacheName, key, value, ttlSeconds = 3600 } = params;

  ctx.stash.cacheItem = value;

  return {
    method: 'PUT',
    resourcePath: `/cache/${cacheName}`,
    params: {
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json',
      },
      query: {
        ttl_seconds: ttlSeconds,
        key_base64: util.base64Encode(key),
      },
      body: JSON.stringify(value),
    },
  };
};

export const setResponse = (ctx: Context) => {
  if (ctx.result.statusCode === 204) {
    console.log('item saved to cache');
  } else {
    console.error('saving item to cache failed', ctx.result);
  }

  return ctx.stash.cacheItem;
};
