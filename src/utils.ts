import { Context } from '@aws-appsync/utils';

export const handleCache = (ctx: Context) => {
  if (ctx.stash.cacheItem !== undefined) {
    // If we have a cache hit, we can return early
    runtime.earlyReturn(ctx.stash.cacheItem);
  }
};
