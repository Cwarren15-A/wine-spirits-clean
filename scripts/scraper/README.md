# Wine & Spirits Data Scraper

A comprehensive web scraper for collecting wine and spirits data from multiple sources to populate your marketplace database.

## Features

- **Multiple Sources**: Scrapes from Vivino and Wine-Searcher
- **Smart Data Extraction**: Automatically extracts wine details, ratings, prices, and images
- **Database Integration**: Direct integration with your Supabase database
- **Configurable**: Customizable scraping parameters and rate limiting
- **Error Handling**: Robust error handling and retry mechanisms
- **Type Safety**: Full TypeScript implementation

## Supported Sources

### Vivino
- Wine ratings and reviews
- Pricing information
- Wine images and descriptions
- User ratings and review counts

### Wine-Searcher
- Price comparisons
- Wine availability
- Regional information
- Detailed wine specifications

## Installation

```bash
cd scripts/scraper
npm install
```

## Configuration

1. Copy the environment file:
```bash
cp .env.example .env
```

2. Add your Supabase credentials:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Usage

### Basic Scraping

```bash
# Scrape from all sources with default queries
npm run dev

# Test mode (scrape without saving to database)
npm run dev test

# Scrape specific source and query
npm run dev specific vivino "bordeaux wine"
npm run dev specific wine-searcher "napa valley cabernet"

# Build and run compiled version
npm run build
npm start
```

### Programmatic Usage

```typescript
import { WineScrapeManager } from './src/index';

const manager = new WineScrapeManager();

// Scrape with custom options
await manager.scrapeAll({
  sources: ['vivino'],
  queries: ['champagne', 'burgundy'],
  maxResults: 100,
  insertToDB: true
});

// Scrape specific source
const wines = await manager.scrapeSpecific('vivino', 'barolo wine');
```

## Data Structure

The scraper extracts the following data for each wine:

```typescript
interface WineData {
  name: string;
  description?: string;
  type: 'wine' | 'spirits' | 'beer' | 'sake';
  varietal: string;
  region: string;
  vintage?: number;
  producer: string;
  alcohol_content: number;
  volume_ml: number;
  base_price: number;
  current_price: number;
  
  // Ratings and reviews
  average_rating?: number;
  total_reviews?: number;
  wine_spectator_score?: number;
  
  // Media
  primary_image_url?: string;
  image_urls?: string[];
  
  // Details
  tasting_notes?: string;
  food_pairings?: string[];
  
  // Metadata
  source_url?: string;
  scraped_at: Date;
}
```

## Default Search Queries

The scraper includes these default queries:
- bordeaux wine
- burgundy wine
- napa valley cabernet
- champagne
- barolo wine
- rioja wine
- single malt whisky
- bourbon whiskey

## Configuration Options

```typescript
interface ScrapingConfig {
  maxPages?: number;        // Maximum pages to scrape per query
  delay?: number;           // Delay between requests (ms)
  userAgent?: string;       // Custom user agent
  headless?: boolean;       // Run browser in headless mode
  maxConcurrency?: number;  // Maximum concurrent scrapers
}
```

## Rate Limiting & Ethics

- Built-in delays between requests (configurable)
- Respects robots.txt when possible
- Randomized user agents
- Configurable concurrency limits
- Error handling for rate limiting

## Database Integration

The scraper automatically:
- Creates seller records for scraped data
- Inserts products into your products table
- Updates price history
- Handles duplicate detection via unique constraints

## Error Handling

- Graceful handling of network errors
- Retry mechanisms for failed requests
- Detailed logging of success/failure rates
- Continues scraping if individual items fail

## Monitoring

The scraper provides detailed statistics:
- Total attempts vs successful extractions
- Success rates per source
- Database insertion results
- Sample of scraped data

## Legal Considerations

- Check website terms of service before scraping
- Respect rate limits and server resources
- Consider using official APIs when available
- This tool is for educational/personal use

## Troubleshooting

### Common Issues

1. **Supabase Connection Errors**
   - Verify your environment variables
   - Check service role key permissions

2. **Scraping Failures**
   - Websites may have changed their structure
   - Try reducing concurrency or increasing delays
   - Check if you're being rate limited

3. **Memory Issues**
   - Reduce maxPages or maxConcurrency
   - Run in headless mode
   - Process smaller batches

### Debug Mode

Run with verbose logging:
```bash
DEBUG=* npm run dev
```

## Contributing

Feel free to add new scrapers for additional sources:

1. Create a new scraper in `src/scrapers/`
2. Implement the `ScrapingResult` interface
3. Add it to the main scraper manager
4. Update the README with the new source

## License

This project is for educational purposes. Please respect website terms of service and use responsibly.