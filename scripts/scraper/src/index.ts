import dotenv from 'dotenv';
import { SimpleWineScraper } from './scrapers/simple-scraper';
import { DatabaseManager } from './utils/database';
import { logStats } from './utils/helpers';
import { WineData, ScrapingResult } from './types/wine';

// Load environment variables
dotenv.config({ path: '.env' });

interface ScrapeOptions {
  sources?: ('simple')[];
  queries?: string[];
  maxResults?: number;
  insertToDB?: boolean;
}

class WineScrapeManager {
  private dbManager: DatabaseManager;
  private sellerId: string | null = null;

  constructor() {
    this.dbManager = new DatabaseManager();
  }

  async scrapeAll(options: ScrapeOptions = {}): Promise<void> {
    const {
      sources = ['simple'],
      queries = [
        'bordeaux wine',
        'burgundy wine', 
        'napa valley cabernet',
        'champagne',
        'barolo wine',
        'rioja wine',
        'single malt whisky',
        'bourbon whiskey'
      ],
      maxResults = 50,
      insertToDB = true
    } = options;

    console.log('🍷 Starting Wine Data Scraping...\n');
    console.log(`Sources: ${sources.join(', ')}`);
    console.log(`Queries: ${queries.join(', ')}`);
    console.log(`Max Results: ${maxResults}`);
    console.log(`Insert to DB: ${insertToDB}\n`);

    const allWines: WineData[] = [];
    const allStats = { attempted: 0, successful: 0, failed: 0 };

    // Setup seller for database insertion
    if (insertToDB) {
      try {
        this.sellerId = await this.dbManager.findOrCreateSeller(
          'Wine Scraper Bot',
          'SCRAPER-001'
        );
        console.log(`✓ Seller ID: ${this.sellerId}\n`);
      } catch (error) {
        console.error('Failed to setup seller:', error);
        return;
      }
    }

    // Scrape from each source
    for (const source of sources) {
      console.log(`\n📡 Scraping from ${source.toUpperCase()}...`);
      
      for (const query of queries) {
        console.log(`\n🔍 Query: "${query}"`);
        
        let result: ScrapingResult;
        
        try {
          if (source === 'simple') {
            const scraper = new SimpleWineScraper({ maxPages: 2, delay: 1000 });
            result = await scraper.generateSampleData(query);
          } else {
            continue;
          }

          if (result.success && result.data) {
            allWines.push(...result.data);
            if (result.stats) {
              allStats.attempted += result.stats.attempted;
              allStats.successful += result.stats.successful;
              allStats.failed += result.stats.failed;
            }
            
            console.log(`✅ ${result.data.length} wines scraped from ${source}`);
            
            // Insert to database if enabled
            if (insertToDB && this.sellerId && result.data.length > 0) {
              const dbResult = await this.dbManager.insertWineData(result.data, this.sellerId);
              console.log(`💾 Database: ${dbResult.success} inserted, ${dbResult.failed} failed`);
            }
          } else {
            console.log(`❌ Failed to scrape from ${source}: ${result.error}`);
          }

          // Limit total results
          if (allWines.length >= maxResults) {
            console.log(`\n🎯 Reached maximum results limit (${maxResults})`);
            break;
          }

        } catch (error) {
          console.error(`Error scraping ${query} from ${source}:`, error);
          allStats.failed++;
        }
      }
      
      if (allWines.length >= maxResults) break;
    }

    // Final statistics
    console.log('\n' + '='.repeat(50));
    console.log('🎉 SCRAPING COMPLETE');
    console.log('='.repeat(50));
    logStats(allStats);
    console.log(`Total unique wines collected: ${allWines.length}`);
    
    if (!insertToDB) {
      console.log('\n📄 Sample wines scraped:');
      allWines.slice(0, 5).forEach((wine, i) => {
        console.log(`${i + 1}. ${wine.name} - ${wine.producer} (${wine.vintage || 'NV'}) - $${wine.current_price}`);
      });
    }
  }

  async scrapeSpecific(source: 'simple', query: string): Promise<WineData[]> {
    console.log(`🔍 Scraping "${query}" from ${source}...`);
    
    let result: ScrapingResult;
    
    if (source === 'simple') {
      const scraper = new SimpleWineScraper();
      result = await scraper.generateSampleData(query);
    } else {
      throw new Error('Unsupported source');
    }

    if (result.success && result.data) {
      console.log(`✅ Found ${result.data.length} wines`);
      if (result.stats) {
        logStats(result.stats);
      }
      return result.data;
    } else {
      console.log(`❌ Scraping failed: ${result.error}`);
      return [];
    }
  }
}

// CLI functionality
async function main() {
  const args = process.argv.slice(2);
  const manager = new WineScrapeManager();

  if (args.length === 0) {
    // Default: scrape all
    await manager.scrapeAll();
  } else if (args[0] === 'specific' && args.length >= 3) {
    // Specific scraping: node index.js specific simple "bordeaux wine"
    const source = args[1] as 'simple';
    const query = args[2];
    await manager.scrapeSpecific(source, query);
  } else if (args[0] === 'test') {
    // Test mode: scrape without inserting to DB
    await manager.scrapeAll({
      queries: ['bordeaux wine'],
      maxResults: 10,
      insertToDB: false
    });
  } else {
    console.log('Usage:');
    console.log('  npm run dev                           # Scrape all sources');
    console.log('  npm run dev test                      # Test mode (no DB)');
    console.log('  npm run dev specific simple "query"   # Scrape specific source');
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { WineScrapeManager };