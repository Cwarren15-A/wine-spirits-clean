// API library for wine & spirits marketplace

export interface Product {
  id: string;
  name: string;
  type: 'wine' | 'spirits';
  producer: string;
  region: string;
  vintage?: number;
  varietal?: string;
  base_price: number;
  current_price?: number;
  available_quantity: number;
  primary_image_url?: string;
  description?: string;
  tasting_notes?: string;
  investment_potential?: string;
  featured?: boolean;
  investment_grade?: boolean;
  fiveYearPriceChangePct?: number;
  average_rating?: number;
  total_reviews?: number;
  wine_spectator_score?: number;
  robert_parker_score?: number;
  james_suckling_score?: number;
  price_change_24h?: number;
  last_traded_price?: number;
  price_range_52week?: {
    low: number;
    high: number;
  };
  volume_ml?: number;
  alcohol_content?: number;
  rarity_score?: number;
  food_pairings?: string[];
  serving_temperature?: string;
  aging_potential?: string;
  vineyard_location?: string;
  estate_history?: string;
  production_methods?: string;
  certifications?: string[];
  seller: {
    business_name: string;
    verification_status: 'verified' | 'pending' | 'unverified';
    seller_rating: number;
    license_number: string;
    license_state: string;
    years_in_business?: number;
    total_sales?: number;
  };
  slug?: string;
  shipping_restrictions?: string[];
}

export interface OrderBook {
  product_id: string;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  spread: number;
  last_traded_price?: number;
  volume_24h: number;
}

export interface OrderBookEntry {
  price: number;
  quantity: number;
  timestamp: Date;
  user_id?: string;
}

export interface PriceHistory {
  productId: string;
  points: Array<{
    date: string;
    price: number;
    volume?: number;
  }>;
  summary: {
    current: number;
    change24h: number;
    change7d: number;
    change30d: number;
    high52w: number;
    low52w: number;
  };
}

// Mock API functions
export const productApi = {
  async getProduct(id: string): Promise<Product> {
    // In a real app, this would make an HTTP request
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    
    // Import products dynamically to avoid circular dependencies
    const { getFeaturedProducts } = await import('./products');
    const products = getFeaturedProducts();
    const product = products.find(p => p.id === id);
    
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    
    return product;
  },

  async searchProducts(query: string): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const { getFeaturedProducts } = await import('./products');
    const products = getFeaturedProducts();
    
    if (!query) return products.slice(0, 10);
    
    return products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.producer.toLowerCase().includes(query.toLowerCase()) ||
      product.region.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10);
  }
};

export const orderBookApi = {
  async getMarketDepth(productId: string): Promise<OrderBook> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Generate mock order book data
    const generateOrders = (basePrice: number, isBid: boolean): OrderBookEntry[] => {
      const orders: OrderBookEntry[] = [];
      const priceStep = basePrice * 0.005; // 0.5% steps
      
      for (let i = 0; i < 5; i++) {
        const priceOffset = (i + 1) * priceStep;
        const price = isBid ? basePrice - priceOffset : basePrice + priceOffset;
        const quantity = Math.floor(Math.random() * 10) + 1;
        
        orders.push({
          price: Math.round(price * 100) / 100,
          quantity,
          timestamp: new Date(Date.now() - Math.random() * 3600000),
          user_id: `user-${Math.floor(Math.random() * 1000)}`
        });
      }
      
      return orders.sort((a, b) => isBid ? b.price - a.price : a.price - b.price);
    };

    const basePrice = 500 + Math.random() * 1000; // Random base price
    const bids = generateOrders(basePrice, true);
    const asks = generateOrders(basePrice, false);
    const spread = asks[0]?.price - bids[0]?.price;

    return {
      product_id: productId,
      bids,
      asks,
      spread: Math.round(spread * 100) / 100,
      last_traded_price: basePrice,
      volume_24h: Math.floor(Math.random() * 100) + 10
    };
  },

  async placeOrder(orderData: {
    product_id: string;
    user_id: string;
    order_type: 'bid' | 'ask';
    price: number;
    quantity: number;
    age_verified: boolean;
    shipping_state: string;
  }): Promise<{ success: boolean; order_id?: string; message?: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock order validation
    if (!orderData.age_verified) {
      return { success: false, message: 'Age verification required' };
    }
    
    if (orderData.price <= 0 || orderData.quantity <= 0) {
      return { success: false, message: 'Invalid price or quantity' };
    }
    
    // Simulate successful order placement
    return {
      success: true,
      order_id: `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      message: 'Order placed successfully'
    };
  }
};

// Utility functions
export const utils = {
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  },

  formatPercentage(pct: number | undefined): string {
    if (pct === undefined || pct === null || isNaN(pct)) return "N/A";
    const sign = pct >= 0 ? '+' : '';
    return `${sign}${pct.toFixed(2)}%`;
  },

  getProductIcon(type: string): string {
    return type === 'wine' ? '🍷' : '🥃';
  },

  getRatingStars(rating: number | undefined): string {
    if (!rating || isNaN(rating)) return "☆☆☆☆☆";
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + 
           (hasHalfStar ? '☆' : '') + 
           '☆'.repeat(emptyStars);
  },

  formatVolume(volumeMl: number | undefined): string {
    if (!volumeMl) return "N/A";
    if (volumeMl >= 1000) {
      return `${(volumeMl / 1000).toFixed(1)}L`;
    }
    return `${volumeMl}ml`;
  },

  formatAlcoholContent(abv: number | undefined): string {
    if (!abv) return "N/A";
    return `${abv.toFixed(1)}%`;
  },

  getVerificationBadge(status: 'verified' | 'pending' | 'unverified'): string {
    switch (status) {
      case 'verified': return '✅';
      case 'pending': return '⏳';
      case 'unverified': return '❌';
      default: return '❓';
    }
  }
};
