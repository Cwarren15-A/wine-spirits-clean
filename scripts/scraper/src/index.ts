import dotenv from 'dotenv';
import { SimpleWineScraper } from './scrapers/simple-scraper';
import { DatabaseManager } from './utils/database';
import { logStats } from './utils/helpers';
import { WineData, ScrapingResult } from './types/wine';
import { generateLargeDataset } from './scrapers/ai-data-generator';

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
  const command = args[0];
  const subCommand = args[1];
  const param = args[2];

  const dbManager = new DatabaseManager();

  switch (command) {
    case 'test':
      console.log('🧪 Testing database connection...');
      const testResult = await dbManager.testConnection();
      if (testResult.success) {
        console.log('✅ Database connection successful');
      } else {
        console.error('❌ Database connection failed:', testResult.error);
      }
      break;

    case 'count':
      console.log('📊 Counting products in database...');
      const count = await dbManager.getProductCount();
      console.log(`📊 Total products in database: ${count}`);
      break;

    case 'sample':
      const sampleCount = parseInt(param) || 10;
      console.log(`📋 Fetching ${sampleCount} sample products...`);
      const samples = await dbManager.getSampleProducts(sampleCount);
      console.log('📋 Sample products:');
      samples.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - ${product.type} - $${product.current_price} (${product.region})`);
      });
      break;

    case 'generate':
      const wineCount = parseInt(args[1]) || 500;
      const spiritsCount = parseInt(args[2]) || 300;
      
      console.log(`🤖 Generating ${wineCount} wines and ${spiritsCount} spirits...`);
      
      // First clear existing AI-generated data
      console.log('🧹 Clearing existing AI-generated products...');
      await dbManager.clearAIGeneratedProducts();
      
      // Generate new data
      const generatedData = await generateLargeDataset(wineCount, spiritsCount);
      
      console.log(`💾 Inserting ${generatedData.length} products into database...`);
      
      // Create a default seller if needed
      const sellerId = await dbManager.ensureDefaultSeller();
      
      // Insert the data
      const result = await dbManager.insertWineData(generatedData, sellerId);
      
      console.log(`✅ Successfully inserted ${result.success} products`);
      if (result.failed > 0) {
        console.log(`⚠️  Failed to insert ${result.failed} products`);
      }
      
      console.log('\n🍷 LARGE DATASET GENERATION COMPLETE');
      console.log(`=== STATS ===`);
      console.log(`✅ Generated: ${generatedData.length} products`);
      console.log(`✅ Inserted: ${result.success} products`);
      console.log(`❌ Failed: ${result.failed} products`);
      break;

    case 'scrape':
      const scraper = new SimpleWineScraper();
      
      console.log('🕷️  Starting wine scraping...');
      
      const scrapingResult = await scraper.generateSampleData();
      
      if (scrapingResult.success && scrapingResult.data) {
        console.log(`💾 Inserting ${scrapingResult.data.length} scraped products...`);
        
        const sellerId = await dbManager.ensureDefaultSeller();
        const insertResult = await dbManager.insertWineData(scrapingResult.data, sellerId);
        
        console.log(`✅ Successfully inserted ${insertResult.success} products`);
        if (insertResult.failed > 0) {
          console.log(`⚠️  Failed to insert ${insertResult.failed} products`);
        }
      } else {
        console.error('❌ Scraping failed:', scrapingResult.error);
      }
      break;

    case 'clear':
      if (subCommand === 'all') {
        console.log('🗑️  Clearing ALL products from database...');
        await dbManager.clearAllProducts();
        console.log('✅ All products cleared');
      } else if (subCommand === 'ai') {
        console.log('🗑️  Clearing AI-generated products from database...');
        await dbManager.clearAIGeneratedProducts();
        console.log('✅ AI-generated products cleared');
      } else {
        console.log('Usage: npm run dev clear [all|ai]');
      }
      break;

    default:
      console.log('🍷 Wine & Spirits Scraper');
      console.log('');
      console.log('Available commands:');
      console.log('  test                    - Test database connection');
      console.log('  count                   - Count products in database');
      console.log('  sample [number]         - Show sample products');
      console.log('  generate [wines] [spirits] - Generate large realistic dataset');
      console.log('    Example: generate 1000 500  (1000 wines, 500 spirits)');
      console.log('  scrape                  - Run basic scraper');
      console.log('  clear all              - Clear all products');
      console.log('  clear ai               - Clear only AI-generated products');
      console.log('');
      console.log('Examples:');
      console.log('  npm run dev test');
      console.log('  npm run dev generate 1000 500');
      console.log('  npm run dev count');
      break;
  }

  process.exit(0);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { WineScrapeManager };