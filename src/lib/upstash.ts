import { Redis } from '@upstash/redis'

// Initialize Upstash Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Cache key constants
export const CACHE_KEYS = {
  PRODUCTS: 'products:all',
  PRODUCT: (id: string) => `product:${id}`,
  PRODUCT_PRICES: (id: string) => `prices:${id}`,
  ORDER_BOOK: (id: string) => `orderbook:${id}`,
  SEARCH_RESULTS: (query: string, filters: string) => `search:${query}:${filters}`,
  PRICE_HISTORY: (id: string, days: number) => `history:${id}:${days}`,
  MARKET_DATA: 'market:data',
  USER_SESSION: (id: string) => `session:${id}`,
  RATE_LIMIT: (ip: string, endpoint: string) => `rate:${ip}:${endpoint}`,
} as const

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
  PRODUCTS: 300, // 5 minutes
  PRODUCT: 60, // 1 minute
  PRICES: 30, // 30 seconds
  ORDER_BOOK: 10, // 10 seconds
  SEARCH: 120, // 2 minutes
  PRICE_HISTORY: 600, // 10 minutes
  MARKET_DATA: 60, // 1 minute
  SESSION: 86400, // 24 hours
} as const

export class CacheService {
  
  // Product Caching
  static async cacheProducts(products: any[]) {
    await redis.setex(CACHE_KEYS.PRODUCTS, CACHE_TTL.PRODUCTS, JSON.stringify(products))
  }
  
  static async getCachedProducts() {
    const cached = await redis.get(CACHE_KEYS.PRODUCTS)
    return cached ? JSON.parse(cached as string) : null
  }
  
  static async cacheProduct(id: string, product: any) {
    await redis.setex(CACHE_KEYS.PRODUCT(id), CACHE_TTL.PRODUCT, JSON.stringify(product))
  }
  
  static async getCachedProduct(id: string) {
    const cached = await redis.get(CACHE_KEYS.PRODUCT(id))
    return cached ? JSON.parse(cached as string) : null
  }
  
  // Price Caching
  static async cachePrices(productId: string, prices: any) {
    await redis.setex(CACHE_KEYS.PRODUCT_PRICES(productId), CACHE_TTL.PRICES, JSON.stringify(prices))
  }
  
  static async getCachedPrices(productId: string) {
    const cached = await redis.get(CACHE_KEYS.PRODUCT_PRICES(productId))
    return cached ? JSON.parse(cached as string) : null
  }
  
  // Order Book Caching
  static async cacheOrderBook(productId: string, orderBook: any) {
    await redis.setex(CACHE_KEYS.ORDER_BOOK(productId), CACHE_TTL.ORDER_BOOK, JSON.stringify(orderBook))
  }
  
  static async getCachedOrderBook(productId: string) {
    const cached = await redis.get(CACHE_KEYS.ORDER_BOOK(productId))
    return cached ? JSON.parse(cached as string) : null
  }
  
  // Search Results Caching
  static async cacheSearchResults(query: string, filters: any, results: any) {
    const filterKey = JSON.stringify(filters)
    await redis.setex(
      CACHE_KEYS.SEARCH_RESULTS(query, filterKey), 
      CACHE_TTL.SEARCH, 
      JSON.stringify(results)
    )
  }
  
  static async getCachedSearchResults(query: string, filters: any) {
    const filterKey = JSON.stringify(filters)
    const cached = await redis.get(CACHE_KEYS.SEARCH_RESULTS(query, filterKey))
    return cached ? JSON.parse(cached as string) : null
  }
  
  // Price History Caching
  static async cachePriceHistory(productId: string, days: number, history: any) {
    await redis.setex(
      CACHE_KEYS.PRICE_HISTORY(productId, days), 
      CACHE_TTL.PRICE_HISTORY, 
      JSON.stringify(history)
    )
  }
  
  static async getCachedPriceHistory(productId: string, days: number) {
    const cached = await redis.get(CACHE_KEYS.PRICE_HISTORY(productId, days))
    return cached ? JSON.parse(cached as string) : null
  }
  
  // Market Data Caching
  static async cacheMarketData(data: any) {
    await redis.setex(CACHE_KEYS.MARKET_DATA, CACHE_TTL.MARKET_DATA, JSON.stringify(data))
  }
  
  static async getCachedMarketData() {
    const cached = await redis.get(CACHE_KEYS.MARKET_DATA)
    return cached ? JSON.parse(cached as string) : null
  }
  
  // Cache Invalidation
  static async invalidateProductCache(productId?: string) {
    const promises = [
      redis.del(CACHE_KEYS.PRODUCTS),
      redis.del(CACHE_KEYS.MARKET_DATA)
    ]
    
    if (productId) {
      promises.push(
        redis.del(CACHE_KEYS.PRODUCT(productId)),
        redis.del(CACHE_KEYS.PRODUCT_PRICES(productId)),
        redis.del(CACHE_KEYS.ORDER_BOOK(productId))
      )
    }
    
    await Promise.all(promises)
  }
  
  static async invalidateSearchCache() {
    // Get all search cache keys and delete them
    const keys = await redis.keys('search:*')
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  }
}

export class RateLimitService {
  
  // Rate limiting
  static async checkRateLimit(
    identifier: string, 
    endpoint: string, 
    limit = 100, 
    windowSeconds = 3600
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = CACHE_KEYS.RATE_LIMIT(identifier, endpoint)
    const current = await redis.get(key)
    
    if (!current) {
      await redis.setex(key, windowSeconds, '1')
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: Date.now() + (windowSeconds * 1000)
      }
    }
    
    const count = parseInt(current as string)
    if (count >= limit) {
      const ttl = await redis.ttl(key)
      return {
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + (ttl * 1000)
      }
    }
    
    await redis.incr(key)
    const ttl = await redis.ttl(key)
    
    return {
      allowed: true,
      remaining: limit - count - 1,
      resetTime: Date.now() + (ttl * 1000)
    }
  }
}

export class SessionService {
  
  // Session Management
  static async setSession(userId: string, sessionData: any) {
    await redis.setex(
      CACHE_KEYS.USER_SESSION(userId), 
      CACHE_TTL.SESSION, 
      JSON.stringify(sessionData)
    )
  }
  
  static async getSession(userId: string) {
    const cached = await redis.get(CACHE_KEYS.USER_SESSION(userId))
    return cached ? JSON.parse(cached as string) : null
  }
  
  static async deleteSession(userId: string) {
    await redis.del(CACHE_KEYS.USER_SESSION(userId))
  }
  
  static async extendSession(userId: string) {
    const session = await this.getSession(userId)
    if (session) {
      await this.setSession(userId, session)
      return true
    }
    return false
  }
}

// Real-time data pipeline
export class RealTimeService {
  
  // Publish price updates
  static async publishPriceUpdate(productId: string, priceData: any) {
    await redis.publish(`price:${productId}`, JSON.stringify(priceData))
    await redis.publish('price:all', JSON.stringify({ productId, ...priceData }))
  }
  
  // Publish order book updates
  static async publishOrderBookUpdate(productId: string, orderBookData: any) {
    await redis.publish(`orderbook:${productId}`, JSON.stringify(orderBookData))
  }
  
  // Publish market updates
  static async publishMarketUpdate(marketData: any) {
    await redis.publish('market:updates', JSON.stringify(marketData))
  }
} 