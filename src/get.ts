import { Context, HTTPRequest } from '@aws-appsync/utils';

export type GetRequestParams = {
  apiKey: string;
  cacheName: string;
  key: string;
};

export const getRequest = (
  ctx: Context,
  params: GetRequestParams,
): HTTPRequest => {
  const { apiKey, cacheName, key } = params;

  return {
    method: 'GET',
    resourcePath: `/cache/${cacheName}`,
    params: {
      headers: {
        Authorization: apiKey,
      },
      query: {
        key_base64: util.base64Encode(key),
      },
    },
  };
};

export const getResponse = <Type extends any>(ctx: Context): Type | null => {
  if (ctx.result.statusCode == 200) {
    if (ctx.result.body) {
      console.log('cache hit');
      const value = JSON.parse(ctx.result.body);
      // Store the value in the stash so we can return early later
      ctx.stash.cacheItem = value;

      return value;
    } else {
      console.error('missing value');
    }
  } else if (ctx.result.statusCode == 404) {
    console.log('cache miss');
  } else {
    console.error('cache get failed', ctx.result);
  }

  return null;
};
