export interface PricePoint {
  date: string;
  price: number;
  volume?: number;
}

export interface PriceHistory {
  productId: string;
  points: PricePoint[];
  summary: {
    current: number;
    change24h: number;
    change7d: number;
    change30d: number;
    high52w: number;
    low52w: number;
  };
}

export async function getPriceHistory(
  productId: string,
  productSlug: string,
  productType: "wine" | "spirits"
): Promise<PriceHistory> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const basePrice = getBasePriceForProduct(productId);
  const points: PricePoint[] = [];
  const today = new Date();
  
  for (let i = 59; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const volatility = productType === "wine" ? 0.02 : 0.03;
    const randomChange = (Math.random() - 0.5) * 2 * volatility;
    const trendFactor = Math.sin(i / 10) * 0.01;
    
    const priceMultiplier = 1 + randomChange + trendFactor;
    const price = Math.round(basePrice * priceMultiplier * 100) / 100;
    
    points.push({
      date: date.toISOString().split('T')[0],
      price,
      volume: Math.floor(Math.random() * 10) + 1
    });
  }

  const prices = points.map(p => p.price);
  const current = prices[prices.length - 1];
  const price24hAgo = prices[prices.length - 2] || current;
  const price7dAgo = prices[prices.length - 8] || current;
  const price30dAgo = prices[prices.length - 31] || current;
  
  return {
    productId,
    points,
    summary: {
      current,
      change24h: ((current - price24hAgo) / price24hAgo) * 100,
      change7d: ((current - price7dAgo) / price7dAgo) * 100,
      change30d: ((current - price30dAgo) / price30dAgo) * 100,
      high52w: Math.max(...prices),
      low52w: Math.min(...prices)
    }
  };
}

export function calculatePriceChange(current: number, previous: number): {
  amount: number;
  percentage: number;
  direction: 'up' | 'down' | 'flat';
} {
  const amount = current - previous;
  const percentage = previous !== 0 ? (amount / previous) * 100 : 0;
  
  let direction: 'up' | 'down' | 'flat' = 'flat';
  if (amount > 0) direction = 'up';
  else if (amount < 0) direction = 'down';
  
  return { amount, percentage, direction };
}

function getBasePriceForProduct(productId: string): number {
  const hash = productId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const min = 50;
  const max = 5000;
  return min + (Math.abs(hash) % (max - min));
}
