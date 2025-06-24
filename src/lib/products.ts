import { products } from '../../products';
import { type Product } from './api';

export function getFeaturedProducts(): Product[] {
  return products.slice(0, 20).map((product): Product => ({
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
    primary_image_url: `/images/${product.category === 'wine' ? 'wines' : 'spirits'}/${product.slug}.jpg`,
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
}
