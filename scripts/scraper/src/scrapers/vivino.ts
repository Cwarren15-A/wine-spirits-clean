import { chromium, Browser, Page } from 'playwright';
import { WineData, ScrapingConfig, ScrapingResult } from '../types/wine';
import { delay, getRandomUserAgent, extractNumber, cleanText, parsePrice, determineWineType, extractVarietal } from '../utils/helpers';

export class VivinoScraper {
  private browser: Browser | null = null;
  private config: ScrapingConfig;

  constructor(config: ScrapingConfig = {}) {
    this.config = {
      maxPages: 5,
      delay: 2000,
      headless: true,
      maxConcurrency: 3,
      ...config
    };
  }

  async init(): Promise<void> {
    this.browser = await chromium.launch({
      headless: this.config.headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
  }

  async scrapeSearch(query: string): Promise<ScrapingResult> {
    if (!this.browser) {
      await this.init();
    }

    const stats = { attempted: 0, successful: 0, failed: 0 };
    const wines: WineData[] = [];

    try {
      const page = await this.browser!.newPage();
      await page.setUserAgent(getRandomUserAgent());

      // Navigate to Vivino search
      const searchUrl = `https://www.vivino.com/search/wines?q=${encodeURIComponent(query)}`;
      console.log(`Searching Vivino for: ${query}`);
      
      await page.goto(searchUrl, { waitUntil: 'networkidle' });
      await delay(this.config.delay!);

      // Extract wine listings
      const wineElements = await page.locator('.wine-card').all();
      stats.attempted = wineElements.length;

      console.log(`Found ${wineElements.length} wines on Vivino`);

      for (let i = 0; i < Math.min(wineElements.length, this.config.maxPages! * 20); i++) {
        try {
          const wine = await this.extractWineData(page, wineElements[i]);
          if (wine) {
            wines.push(wine);
            stats.successful++;
          }
        } catch (error) {
          console.error(`Failed to extract wine ${i + 1}:`, error);
          stats.failed++;
        }
      }

      await page.close();
      
      return {
        success: true,
        data: wines,
        stats
      };

    } catch (error) {
      console.error('Vivino scraping error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stats
      };
    }
  }

  private async extractWineData(page: Page, element: any): Promise<WineData | null> {
    try {
      const wineData = await element.evaluate((el: Element) => {
        const nameEl = el.querySelector('.wine-card__name');
        const priceEl = el.querySelector('.wine-card__price');
        const ratingEl = el.querySelector('.average__number');
        const reviewsEl = el.querySelector('.average__stars');
        const imageEl = el.querySelector('.wine-card__image img');
        const regionEl = el.querySelector('.wine-card__region');
        const vintageEl = el.querySelector('.wine-card__vintage');

        return {
          name: nameEl?.textContent?.trim() || '',
          price: priceEl?.textContent?.trim() || '',
          rating: ratingEl?.textContent?.trim() || '',
          reviews: reviewsEl?.getAttribute('aria-label') || '',
          image: imageEl?.getAttribute('src') || '',
          region: regionEl?.textContent?.trim() || '',
          vintage: vintageEl?.textContent?.trim() || ''
        };
      });

      if (!wineData.name) {
        return null;
      }

      const price = parsePrice(wineData.price) || 50; // Default price
      const rating = extractNumber(wineData.rating);
      const vintage = extractNumber(wineData.vintage);
      const reviewCount = extractNumber(wineData.reviews);

      // Extract producer (usually first part of name)
      const nameParts = wineData.name.split(' ');
      const producer = nameParts[0] || 'Unknown Producer';
      
      const wine: WineData = {
        name: cleanText(wineData.name),
        description: `Wine from ${wineData.region}`,
        type: determineWineType(wineData.name),
        varietal: extractVarietal(wineData.name),
        region: cleanText(wineData.region) || 'Unknown Region',
        vintage: vintage || undefined,
        producer: producer,
        alcohol_content: 13.5, // Default for wines
        volume_ml: 750, // Standard wine bottle
        base_price: price,
        current_price: price,
        average_rating: rating || undefined,
        total_reviews: reviewCount || 0,
        primary_image_url: wineData.image || undefined,
        source_url: `https://www.vivino.com/search/wines?q=${encodeURIComponent(wineData.name)}`,
        scraped_at: new Date()
      };

      return wine;

    } catch (error) {
      console.error('Error extracting wine data:', error);
      return null;
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

// Standalone function for quick testing
export async function scrapeVivinoSearch(query: string, config?: ScrapingConfig): Promise<ScrapingResult> {
  const scraper = new VivinoScraper(config);
  try {
    const result = await scraper.scrapeSearch(query);
    await scraper.close();
    return result;
  } catch (error) {
    await scraper.close();
    throw error;
  }
}