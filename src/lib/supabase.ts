import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Product {
  id: string
  name: string
  description: string
  type: 'wine' | 'spirits' | 'beer' | 'sake'
  varietal: string
  region: string
  appellation?: string
  vintage?: number
  producer: string
  alcohol_content: number
  volume_ml: number
  base_price: number
  current_price: number
  price_change_24h: number
  market_cap?: number
  
  // Quality & Ratings
  average_rating?: number
  total_reviews: number
  wine_spectator_score?: number
  robert_parker_score?: number
  james_suckling_score?: number
  
  // Visual & Media
  primary_image_url?: string
  image_urls: string[]
  
  // Product Details
  tasting_notes?: string
  food_pairings?: string[]
  serving_temperature?: string
  aging_potential?: string
  harvest_method?: string
  fermentation_process?: string
  
  // Trading Information
  available_quantity: number
  minimum_order_quantity: number
  last_traded_price?: number
  volume_traded_24h?: number
  
  // Seller Information
  seller_id: string
  
  // Compliance & Legal
  requires_adult_signature: boolean
  shipping_restrictions?: string[]
  tax_information?: string
  compliance_notes?: string
  ttb_approved: boolean
  
  // Metadata
  created_at: string
  updated_at: string
  featured?: boolean
  rarity_score?: number
  investment_grade?: boolean
}

export interface OrderBookEntry {
  id: string
  product_id: string
  user_id: string
  order_type: 'bid' | 'ask'
  price: number
  quantity: number
  created_at: string
  status: 'active' | 'filled' | 'cancelled'
}

export interface PriceHistory {
  id: string
  product_id: string
  price: number
  timestamp: string
  volume?: number
}

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  age_verified: boolean
  created_at: string
  updated_at: string
}

// Supabase Database Operations
export class SupabaseService {
  
  // Product Operations
  static async getProducts(limit = 100) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(limit)
    
    if (error) throw error
    return data
  }
  
  static async getProduct(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }
  
  static async searchProducts(query: string, filters?: any) {
    let queryBuilder = supabase
      .from('products')
      .select('*')
    
    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%,producer.ilike.%${query}%`)
    }
    
    if (filters?.type) {
      queryBuilder = queryBuilder.eq('type', filters.type)
    }
    
    if (filters?.region) {
      queryBuilder = queryBuilder.ilike('region', `%${filters.region}%`)
    }
    
    if (filters?.priceMin) {
      queryBuilder = queryBuilder.gte('current_price', filters.priceMin)
    }
    
    if (filters?.priceMax) {
      queryBuilder = queryBuilder.lte('current_price', filters.priceMax)
    }
    
    const { data, error } = await queryBuilder
    
    if (error) throw error
    return data
  }
  
  static async updateProductPrice(productId: string, newPrice: number, priceChange24h: number) {
    const { data, error } = await supabase
      .from('products')
      .update({ 
        current_price: newPrice,
        price_change_24h: priceChange24h,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)
      .select()
    
    if (error) throw error
    return data
  }
  
  // Order Book Operations
  static async getOrderBook(productId: string) {
    const { data, error } = await supabase
      .from('order_book_entries')
      .select('*')
      .eq('product_id', productId)
      .eq('status', 'active')
      .order('price', { ascending: false })
    
    if (error) throw error
    
    const bids = data.filter(entry => entry.order_type === 'bid')
    const asks = data.filter(entry => entry.order_type === 'ask')
    
    return { bids, asks }
  }
  
  static async placeOrder(order: Omit<OrderBookEntry, 'id' | 'created_at' | 'status'>) {
    const { data, error } = await supabase
      .from('order_book_entries')
      .insert({
        ...order,
        status: 'active',
        created_at: new Date().toISOString()
      })
      .select()
    
    if (error) throw error
    return data
  }
  
  // Price History Operations
  static async getPriceHistory(productId: string, days = 30) {
    const fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - days)
    
    const { data, error } = await supabase
      .from('price_history')
      .select('*')
      .eq('product_id', productId)
      .gte('timestamp', fromDate.toISOString())
      .order('timestamp', { ascending: true })
    
    if (error) throw error
    return data
  }
  
  static async addPricePoint(productId: string, price: number, volume?: number) {
    const { data, error } = await supabase
      .from('price_history')
      .insert({
        product_id: productId,
        price,
        volume,
        timestamp: new Date().toISOString()
      })
      .select()
    
    if (error) throw error
    return data
  }
  
  // Real-time Subscriptions
  static subscribeToOrderBook(productId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`order_book_${productId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_book_entries',
          filter: `product_id=eq.${productId}`
        },
        callback
      )
      .subscribe()
  }
  
  static subscribeToPriceUpdates(callback: (payload: any) => void) {
    return supabase
      .channel('price_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products'
        },
        callback
      )
      .subscribe()
  }
} 