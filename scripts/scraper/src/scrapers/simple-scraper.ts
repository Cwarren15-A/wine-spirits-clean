import axios from 'axios';
import * as cheerio from 'cheerio';
import { WineData, ScrapingConfig, ScrapingResult } from '../types/wine';
import { delay, getRandomUserAgent, extractNumber, cleanText, parsePrice, determineWineType, extractVarietal, extractYear } from '../utils/helpers';

export class SimpleWineScraper {
  private config: ScrapingConfig;
  private axiosInstance;

  constructor(config: ScrapingConfig = {}) {
    this.config = {
      maxPages: 3,
      delay: 1500,
      maxConcurrency: 2,
      ...config
    };

    this.axiosInstance = axios.create({
      timeout: 15000,
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      }
    });
  }

  // Sample wine data generator for testing without scraping
  async generateSampleData(category: string = 'wine'): Promise<ScrapingResult> {
    const stats = { attempted: 0, successful: 0, failed: 0 };
    
    const sampleWines: WineData[] = [
      {
        name: 'Château Margaux 2015',
        description: 'Premier Grand Cru Classé from Bordeaux, Margaux appellation',
        type: 'wine',
        varietal: 'Cabernet Sauvignon Blend',
        region: 'Bordeaux, France',
        appellation: 'Margaux',
        vintage: 2015,
        producer: 'Château Margaux',
        alcohol_content: 13.5,
        volume_ml: 750,
        base_price: 850.00,
        current_price: 850.00,
        average_rating: 4.8,
        total_reviews: 245,
        wine_spectator_score: 98,
        robert_parker_score: 96,
        primary_image_url: 'https://example.com/margaux-2015.jpg',
        tasting_notes: 'Complex nose of dark fruits, violets, and cedar. Full-bodied with silky tannins and a long, elegant finish.',
        food_pairings: ['Beef', 'Lamb', 'Aged Cheese'],
        serving_temperature: '16-18°C',
        aging_potential: '30+ years',
        source_url: 'sample-data',
        scraped_at: new Date()
      },
      {
        name: 'Dom Pérignon 2013',
        description: 'Prestigious Champagne from Épernay',
        type: 'wine',
        varietal: 'Champagne',
        region: 'Champagne, France',
        vintage: 2013,
        producer: 'Dom Pérignon',
        alcohol_content: 12.5,
        volume_ml: 750,
        base_price: 250.00,
        current_price: 250.00,
        average_rating: 4.6,
        total_reviews: 189,
        wine_spectator_score: 95,
        primary_image_url: 'https://example.com/dom-perignon-2013.jpg',
        tasting_notes: 'Fresh and vibrant with notes of citrus, brioche, and mineral complexity.',
        food_pairings: ['Seafood', 'Caviar', 'Light Appetizers'],
        serving_temperature: '6-8°C',
        source_url: 'sample-data',
        scraped_at: new Date()
      },
      {
        name: 'Caymus Cabernet Sauvignon 2020',
        description: 'Napa Valley Cabernet Sauvignon',
        type: 'wine',
        varietal: 'Cabernet Sauvignon',
        region: 'Napa Valley, California',
        vintage: 2020,
        producer: 'Caymus Vineyards',
        alcohol_content: 14.5,
        volume_ml: 750,
        base_price: 85.00,
        current_price: 85.00,
        average_rating: 4.3,
        total_reviews: 324,
        wine_spectator_score: 90,
        primary_image_url: 'https://example.com/caymus-2020.jpg',
        tasting_notes: 'Rich and concentrated with dark berry flavors, vanilla, and soft tannins.',
        food_pairings: ['Grilled Beef', 'BBQ', 'Dark Chocolate'],
        serving_temperature: '16-18°C',
        aging_potential: '10-15 years',
        source_url: 'sample-data',
        scraped_at: new Date()
      },
      {
        name: 'Macallan 18 Year Single Malt',
        description: 'Premium Speyside Single Malt Scotch Whisky',
        type: 'spirits',
        varietal: 'Single Malt Scotch',
        region: 'Speyside, Scotland',
        producer: 'The Macallan',
        alcohol_content: 43.0,
        volume_ml: 700,
        base_price: 450.00,
        current_price: 450.00,
        average_rating: 4.7,
        total_reviews: 156,
        primary_image_url: 'https://example.com/macallan-18.jpg',
        tasting_notes: 'Rich sherry influence with notes of dried fruits, chocolate, and spice.',
        serving_temperature: 'Room temperature',
        aging_potential: 'Ready to drink',
        source_url: 'sample-data',
        scraped_at: new Date()
      },
      {
        name: 'Opus One 2018',
        description: 'Napa Valley Bordeaux-style blend',
        type: 'wine',
        varietal: 'Cabernet Sauvignon Blend',
        region: 'Napa Valley, California',
        vintage: 2018,
        producer: 'Opus One',
        alcohol_content: 14.5,
        volume_ml: 750,
        base_price: 400.00,
        current_price: 400.00,
        average_rating: 4.5,
        total_reviews: 98,
        wine_spectator_score: 94,
        robert_parker_score: 96,
        primary_image_url: 'https://example.com/opus-one-2018.jpg',
        tasting_notes: 'Elegant and powerful with layers of dark fruit, cedar, and graphite.',
        food_pairings: ['Prime Rib', 'Lamb', 'Strong Cheese'],
        serving_temperature: '16-18°C',
        aging_potential: '20+ years',
        source_url: 'sample-data',
        scraped_at: new Date()
      }
    ];

    stats.attempted = sampleWines.length;
    stats.successful = sampleWines.length;
    stats.failed = 0;

    console.log(`✅ Generated ${sampleWines.length} sample wines`);

    return {
      success: true,
      data: sampleWines,
      stats
    };
  }

  // Basic wine database scraper (educational purposes)
  async scrapeWineDatabase(): Promise<ScrapingResult> {
    const stats = { attempted: 0, successful: 0, failed: 0 };
    const wines: WineData[] = [];

    try {
      // This is a simplified example - in practice you'd need to respect robots.txt
      // and terms of service of any website you scrape
      console.log('⚠️  Using sample data instead of live scraping for demonstration');
      
      // Generate sample data instead of actual scraping
      return await this.generateSampleData();
      
    } catch (error) {
      console.error('Scraping error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stats
      };
    }
  }

  // You could add more specific scrapers here for sites that allow it
  async scrapePublicWineData(): Promise<ScrapingResult> {
    // This would implement actual scraping for sites that explicitly allow it
    // For now, return sample data
    return await this.generateSampleData();
  }
}

// Standalone function for quick testing
export async function scrapeSimpleWineData(config?: ScrapingConfig): Promise<ScrapingResult> {
  const scraper = new SimpleWineScraper(config);
  return await scraper.generateSampleData();
}