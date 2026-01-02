/**
 * Stub for Redis client in extension context
 * Server-only modules are not available in browser
 */

export const getRedisClient = () => {
  throw new Error('Redis is not available in browser extension context')
}

export class RedisWrapper {
  constructor() {
    throw new Error('Redis is not available in browser extension context')
  }
}

export const redisConfig = {
  useLocalRedis: false,
}

