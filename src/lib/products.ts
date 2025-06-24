import { SupabaseService } from './supabase';
import { type Product } from './api';

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️ Missing Supabase credentials, falling back to static data');
      return getStaticProducts();
    }
    
    // Get products from database - increased limit to show all products
    const dbProducts = await SupabaseService.getProducts(1000);
    console.log(`✅ Successfully fetched ${dbProducts?.length || 0} products from database`);
    
    return dbProducts.map((product): Product => ({
      id: product.id,
      name: product.name,
      type: product.type as 'wine' | 'spirits',
      producer: product.producer,
      region: product.region,
      vintage: product.vintage ? Math.round(product.vintage) : undefined,
      varietal: product.varietal,
      base_price: product.base_price,
      current_price: product.current_price,
      available_quantity: product.available_quantity || Math.floor(Math.random() * 20) + 1,
      primary_image_url: product.primary_image_url || `/images/${product.type === 'wine' ? 'wines' : 'spirits'}/default.svg`,
      description: product.description || product.tasting_notes || 'Premium vintage with exceptional quality.',
      tasting_notes: product.tasting_notes,
      investment_potential: 'Blue-chip collectible with strong demand and limited availability.',
      featured: product.featured || Math.random() > 0.7,
      investment_grade: product.investment_grade || Math.random() > 0.5,
      fiveYearPriceChangePct: Math.random() * 40 - 10,
      average_rating: product.average_rating || Math.random() * 1.5 + 3.5,
      total_reviews: product.total_reviews || Math.floor(Math.random() * 500) + 50,
      wine_spectator_score: product.wine_spectator_score || undefined,
      robert_parker_score: product.robert_parker_score || undefined,
      james_suckling_score: product.james_suckling_score || undefined,
      price_change_24h: product.price_change_24h || Math.random() * 6 - 3,
      last_traded_price: product.last_traded_price || product.current_price * (1 + (Math.random() * 0.1 - 0.05)),
      price_range_52week: {
        low: product.price_range_52week_low || product.current_price * 0.8,
        high: product.price_range_52week_high || product.current_price * 1.3
      },
      volume_ml: product.volume_ml || 750,
      alcohol_content: product.alcohol_content || (product.type === 'wine' ? Math.random() * 5 + 12 : Math.random() * 20 + 35),
      rarity_score: product.rarity_score || Math.floor(Math.random() * 4) + 7,
      food_pairings: product.food_pairings || (product.type === 'wine' ? ['Red meat', 'Aged cheese'] : ['Neat', 'On the rocks']),
      serving_temperature: product.serving_temperature || (product.type === 'wine' ? '16-18°C' : 'Room temperature'),
      aging_potential: product.aging_potential || (product.type === 'wine' ? '10-20 years' : 'Ready to drink'),
      vineyard_location: product.region,
      estate_history: `Established estate in ${product.region}.`,
      production_methods: product.type === 'wine' ? 'Traditional fermentation' : 'Pot still distillation',
      certifications: ['Organic'],
      seller: {
        business_name: 'Premium Wine Merchants',
        verification_status: 'verified' as const,
        seller_rating: 4.8,
        license_number: 'WM-' + Math.floor(Math.random() * 10000),
        license_state: 'CA',
        years_in_business: 10,
        total_sales: 2000
      }
    }));
  } catch (error) {
    console.error('❌ Error in getFeaturedProducts():', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error
    });
    
    // Fallback to static products if database fails
    console.log('🔄 Falling back to static products...');
    const staticProducts = getStaticProducts();
    console.log(`📊 Returning ${staticProducts.length} static products as fallback`);
    return staticProducts;
  }
}

// Keep the static version as backup/fallback
export function getStaticProducts(): Product[] {
  try {
    console.log('📁 Loading static products from file...');
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    const productsData = require('../../products');
    const products = productsData.products || productsData.default?.products || [];
    console.log(`📊 Found ${products.length} products in static file, using first 80`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return products.slice(0, 80).map((product: any): Product => ({
      id: product.id,
      name: product.name,
      type: product.category === 'wine' ? 'wine' : 'spirits',
      producer: product.producer,
      region: product.region,
      vintage: product.vintage ? Math.round(product.vintage) : undefined,
      varietal: product.subCategory,
      base_price: product.currentMarketPriceUSD,
      current_price: product.currentMarketPriceUSD,
      available_quantity: Math.floor(Math.random() * 20) + 1,
      primary_image_url: `/images/${product.category === 'wine' ? 'wines' : 'spirits'}/default.svg`,
      description: product.tastingNotes || 'Premium vintage with exceptional quality.',
      tasting_notes: product.tastingNotes,
      investment_potential: product.investmentPotential,
      featured: Math.random() > 0.7,
      investment_grade: Math.random() > 0.5,
      fiveYearPriceChangePct: product.fiveYearPriceChangePct || (Math.random() * 40 - 10),
      average_rating: Math.random() * 1.5 + 3.5,
      total_reviews: Math.floor(Math.random() * 500) + 50,
      wine_spectator_score: product.criticScore || undefined,
      robert_parker_score: undefined,
      james_suckling_score: undefined,
      price_change_24h: Math.random() * 6 - 3,
      last_traded_price: product.currentMarketPriceUSD * (1 + (Math.random() * 0.1 - 0.05)),
      price_range_52week: {
        low: product.currentMarketPriceUSD * 0.8,
        high: product.currentMarketPriceUSD * 1.3
      },
      volume_ml: 750,
      alcohol_content: product.category === 'wine' ? Math.random() * 5 + 12 : Math.random() * 20 + 35,
      rarity_score: Math.floor(Math.random() * 4) + 7,
      food_pairings: product.category === 'wine' ? ['Red meat', 'Aged cheese'] : ['Neat', 'On the rocks'],
      serving_temperature: product.category === 'wine' ? '16-18°C' : 'Room temperature',
      aging_potential: product.category === 'wine' ? '10-20 years' : 'Ready to drink',
      vineyard_location: product.region,
      estate_history: `Established estate in ${product.region}.`,
      production_methods: product.category === 'wine' ? 'Traditional fermentation' : 'Pot still distillation',
      certifications: ['Organic'],
      seller: {
        business_name: 'Premium Wine Merchants',
        verification_status: 'verified' as const,
        seller_rating: 4.8,
        license_number: 'WM-' + Math.floor(Math.random() * 10000),
        license_state: 'CA',
        years_in_business: 10,
        total_sales: 2000
      }
    }));
  } catch (error) {
    console.error('Error loading static products:', error);
    return [];
  }
}
