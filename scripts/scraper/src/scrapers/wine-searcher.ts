import axios from 'axios';
import * as cheerio from 'cheerio';
import { WineData, ScrapingConfig, ScrapingResult } from '../types/wine';
import { delay, getRandomUserAgent, extractNumber, cleanText, parsePrice, determineWineType, extractVarietal, extractYear } from '../utils/helpers';

export class WineSearcherScraper {
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
      timeout: 10000,
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

  async scrapeSearch(query: string): Promise<ScrapingResult> {
    const stats = { attempted: 0, successful: 0, failed: 0 };
    const wines: WineData[] = [];

    try {
      // Wine-Searcher search URL
      const searchUrl = `https://www.wine-searcher.com/find/${encodeURIComponent(query)}`;
      console.log(`Searching Wine-Searcher for: ${query}`);

      const response = await this.axiosInstance.get(searchUrl);
      const $ = cheerio.load(response.data);

      // Find wine listings
      const wineElements = $('.result-row, .wine-card, .search-result').slice(0, this.config.maxPages! * 10).toArray();
      stats.attempted = wineElements.length;

      console.log(`Found ${wineElements.length} wines on Wine-Searcher`);

      for (let i = 0; i < wineElements.length; i++) {
        try {
          const wine = await this.extractWineData($, $(wineElements[i]));
          if (wine) {
            wines.push(wine);
            stats.successful++;
          }
          
          // Add delay between extractions
          if (i < wineElements.length - 1) {
            await delay(this.config.delay! / 2);
          }
        } catch (error) {
          console.error(`Failed to extract wine ${i + 1}:`, error);
          stats.failed++;
        }
      }

      return {
        success: true,
        data: wines,
        stats
      };

    } catch (error) {
      console.error('Wine-Searcher scraping error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stats
      };
    }
  }

  private async extractWineData($: cheerio.CheerioAPI, element: any): Promise<WineData | null> {
    try {
      // Extract basic information
      const nameElement = element.find('.wine-name, .result-name, h3 a, .wine-title').first();
      const priceElement = element.find('.price, .wine-price, .result-price').first();
      const regionElement = element.find('.region, .wine-region, .result-region').first();
      const vintageElement = element.find('.vintage, .wine-vintage, .year').first();
      const imageElement = element.find('img').first();

      const name = cleanText(nameElement.text() || '');
      const priceText = priceElement.text() || '';
      const region = cleanText(regionElement.text() || '');
      const vintageText = vintageElement.text() || '';

      if (!name) {
        return null;
      }

      // Parse extracted data
      const price = parsePrice(priceText) || 45; // Default price
      const vintage = extractYear(vintageText) || extractYear(name);
      const imageUrl = imageElement.attr('src') || imageElement.attr('data-src');

      // Extract producer (usually first part of name)
      const nameParts = name.split(' ');
      const producer = nameParts[0] || 'Unknown Producer';

      const wine: WineData = {
        name: name,
        description: `${determineWineType(name)} from ${region || 'Unknown Region'}`,
        type: determineWineType(name),
        varietal: extractVarietal(name),
        region: region || 'Unknown Region',
        vintage: vintage || undefined,
        producer: producer,
        alcohol_content: 13.0, // Default for wines
        volume_ml: 750, // Standard wine bottle
        base_price: price,
        current_price: price,
        primary_image_url: imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `https:${imageUrl}`) : undefined,
        source_url: `https://www.wine-searcher.com/find/${encodeURIComponent(name)}`,
        scraped_at: new Date()
      };

      return wine;

    } catch (error) {
      console.error('Error extracting wine data:', error);
      return null;
    }
  }

  async scrapeWineDetails(wineUrl: string): Promise<Partial<WineData> | null> {
    try {
      await delay(this.config.delay!);
      
      const response = await this.axiosInstance.get(wineUrl);
      const $ = cheerio.load(response.data);

      // Extract detailed information
      const tastingNotes = $('.tasting-notes, .wine-description, .description').first().text();
      const alcoholContent = $('.alcohol, .abv').first().text();
      const foodPairings = $('.food-pairing, .pairing').map((_, el) => $(el).text()).get();

      return {
        tasting_notes: tastingNotes ? cleanText(tastingNotes) : undefined,
        alcohol_content: extractNumber(alcoholContent) || 13.0,
        food_pairings: foodPairings.length > 0 ? foodPairings : undefined
      };

    } catch (error) {
      console.error('Error extracting wine details:', error);
      return null;
    }
  }
}

// Standalone function for quick testing
export async function scrapeWineSearcher(query: string, config?: ScrapingConfig): Promise<ScrapingResult> {
  const scraper = new WineSearcherScraper(config);
  return await scraper.scrapeSearch(query);
}