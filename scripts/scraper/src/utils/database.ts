import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { WineData } from '../types/wine';
import { v4 as uuidv4 } from 'uuid';

export class DatabaseManager {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials in environment variables');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async insertWineData(wines: WineData[], sellerId: string): Promise<{ success: number, failed: number }> {
    let success = 0;
    let failed = 0;

    for (const wine of wines) {
      try {
        const productData = {
          id: uuidv4(),
          name: wine.name,
          description: wine.description,
          type: wine.type,
          varietal: wine.varietal,
          region: wine.region,
          appellation: wine.appellation,
          vintage: wine.vintage,
          producer: wine.producer,
          alcohol_content: wine.alcohol_content,
          volume_ml: wine.volume_ml,
          base_price: wine.base_price,
          current_price: wine.current_price,
          average_rating: wine.average_rating,
          total_reviews: wine.total_reviews || 0,
          wine_spectator_score: wine.wine_spectator_score,
          robert_parker_score: wine.robert_parker_score,
          james_suckling_score: wine.james_suckling_score,
          primary_image_url: wine.primary_image_url,
          image_urls: wine.image_urls || [],
          tasting_notes: wine.tasting_notes,
          food_pairings: wine.food_pairings || [],
          serving_temperature: wine.serving_temperature,
          aging_potential: wine.aging_potential,
          seller_id: sellerId,
          available_quantity: 1,
          slug: this.generateSlug(wine.name, wine.producer, wine.vintage),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { error } = await this.supabase
          .from('products')
          .insert(productData);

        if (error) {
          console.error(`Failed to insert ${wine.name}:`, error);
          failed++;
        } else {
          console.log(`✓ Inserted: ${wine.name}`);
          success++;
        }
      } catch (error) {
        console.error(`Error processing ${wine.name}:`, error);
        failed++;
      }
    }

    return { success, failed };
  }

  async findOrCreateSeller(businessName: string, licenseNumber: string): Promise<string> {
    // Check if seller exists
    const { data: existingSeller, error: selectError } = await this.supabase
      .from('sellers')
      .select('id')
      .eq('license_number', licenseNumber)
      .maybeSingle();

    if (selectError) {
      console.error('Error checking existing seller:', selectError);
    }

    if (existingSeller) {
      return existingSeller.id;
    }

    // Create new seller without user_id (make it nullable in the schema or use a special approach)
    const sellerId = uuidv4();
    const { error } = await this.supabase
      .from('sellers')
      .insert({
        id: sellerId,
        user_id: null, // Set to null for scraped data
        business_name: businessName,
        license_number: licenseNumber,
        license_state: 'CA', // Default state
        verification_status: 'unverified', // Mark as unverified for scraped data
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      throw new Error(`Failed to create seller: ${error.message}`);
    }

    console.log(`✓ Created seller: ${businessName} (${licenseNumber})`);
    return sellerId;
  }

  async updatePriceHistory(productId: string, price: number, volume: number = 0): Promise<void> {
    const { error } = await this.supabase
      .from('price_history')
      .insert({
        id: uuidv4(),
        product_id: productId,
        price: price,
        volume: volume,
        high: price,
        low: price,
        open: price,
        close: price,
        timestamp: new Date().toISOString(),
        source: 'scraper'
      });

    if (error) {
      console.error('Failed to insert price history:', error);
    }
  }

  private generateSlug(name: string, producer: string, vintage?: number): string {
    const base = `${producer} ${name} ${vintage || ''}`.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .replace(/^-|-$/g, '');
    
    return `${base}-${Date.now()}`;
  }
}