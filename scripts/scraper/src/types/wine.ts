export interface WineData {
  name: string;
  description?: string;
  type: 'wine' | 'spirits' | 'beer' | 'sake';
  varietal: string;
  region: string;
  appellation?: string;
  vintage?: number;
  producer: string;
  alcohol_content: number;
  volume_ml: number;
  base_price: number;
  current_price: number;
  
  // Quality & Ratings
  average_rating?: number;
  total_reviews?: number;
  wine_spectator_score?: number;
  robert_parker_score?: number;
  james_suckling_score?: number;
  
  // Visual & Media
  primary_image_url?: string;
  image_urls?: string[];
  
  // Product Details
  tasting_notes?: string;
  food_pairings?: string[];
  serving_temperature?: string;
  aging_potential?: string;
  
  // Additional metadata
  source_url?: string;
  scraped_at: Date;
}

export interface ScrapingConfig {
  maxPages?: number;
  delay?: number;
  userAgent?: string;
  headless?: boolean;
  maxConcurrency?: number;
}

export interface ScrapingResult {
  success: boolean;
  data?: WineData[];
  error?: string;
  stats?: {
    attempted: number;
    successful: number;
    failed: number;
  };
}