export const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export const getRandomUserAgent = (): string => {
  const userAgents = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0'
  ];
  return userAgents[Math.floor(Math.random() * userAgents.length)];
};

export const extractNumber = (str: string): number | null => {
  const match = str.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
};

export const extractYear = (str: string): number | null => {
  const match = str.match(/\b(19|20)\d{2}\b/);
  return match ? parseInt(match[0]) : null;
};

export const cleanText = (text: string): string => {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, ' ')
    .trim();
};

export const extractAlcoholContent = (str: string): number | null => {
  const match = str.match(/(\d+(?:\.\d+)?)\s*%/);
  return match ? parseFloat(match[1]) : null;
};

export const extractVolumeML = (str: string): number | null => {
  const match = str.match(/(\d+(?:\.\d+)?)\s*(ml|mL|ML)/);
  if (match) {
    return parseFloat(match[1]);
  }
  
  // Check for liters and convert
  const literMatch = str.match(/(\d+(?:\.\d+)?)\s*(l|L|liter|Liter)/);
  if (literMatch) {
    return parseFloat(literMatch[1]) * 1000;
  }
  
  // Common wine bottle sizes
  if (str.includes('750ml') || str.includes('standard')) return 750;
  if (str.includes('1.5L') || str.includes('magnum')) return 1500;
  if (str.includes('375ml') || str.includes('half')) return 375;
  
  return 750; // Default wine bottle size
};

export const parsePrice = (priceStr: string): number | null => {
  const cleaned = priceStr.replace(/[^\d.]/g, '');
  const price = parseFloat(cleaned);
  return isNaN(price) ? null : price;
};

export const determineWineType = (name: string, description: string = ''): 'wine' | 'spirits' | 'beer' | 'sake' => {
  const text = `${name} ${description}`.toLowerCase();
  
  if (text.includes('whiskey') || text.includes('whisky') || text.includes('vodka') || 
      text.includes('gin') || text.includes('rum') || text.includes('tequila') ||
      text.includes('bourbon') || text.includes('scotch') || text.includes('brandy') ||
      text.includes('cognac')) {
    return 'spirits';
  }
  
  if (text.includes('beer') || text.includes('ale') || text.includes('lager') || 
      text.includes('stout') || text.includes('porter')) {
    return 'beer';
  }
  
  if (text.includes('sake') || text.includes('junmai') || text.includes('daiginjo')) {
    return 'sake';
  }
  
  return 'wine';
};

export const extractVarietal = (name: string, description: string = ''): string => {
  const text = `${name} ${description}`.toLowerCase();
  
  const varietals = [
    'cabernet sauvignon', 'merlot', 'pinot noir', 'chardonnay', 'sauvignon blanc',
    'riesling', 'pinot grigio', 'syrah', 'malbec', 'zinfandel', 'sangiovese',
    'tempranillo', 'grenache', 'nebbiolo', 'barbera', 'chianti', 'bordeaux',
    'burgundy', 'champagne', 'prosecco', 'rosé', 'red blend', 'white blend'
  ];
  
  for (const varietal of varietals) {
    if (text.includes(varietal)) {
      return varietal.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
  }
  
  return 'Red Wine'; // Default
};

export const logStats = (stats: { attempted: number; successful: number; failed: number }) => {
  console.log('\n=== Scraping Statistics ===');
  console.log(`Attempted: ${stats.attempted}`);
  console.log(`Successful: ${stats.successful}`);
  console.log(`Failed: ${stats.failed}`);
  console.log(`Success Rate: ${((stats.successful / stats.attempted) * 100).toFixed(1)}%`);
  console.log('==========================\n');
};