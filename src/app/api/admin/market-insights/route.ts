import { NextResponse } from 'next/server';

// Mock market insights - in real app this would use OpenAI API
function generateMarketInsights() {
  const sentiments = ['bullish', 'bearish', 'neutral'] as const;
  const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
  
  const marketReasons = [
    'Strong demand from collectors',
    'Limited supply from producer',
    'Favorable weather conditions',
    'Economic uncertainty affecting luxury markets',
    'Celebrity endorsement impact',
    'Vintage receiving high critic scores'
  ];

  const products = Array.from({ length: 8 }, (_, i) => ({
    productId: `product_${i + 1}`,
    newPrice: Math.floor(Math.random() * 5000) + 500,
    priceChange24h: (Math.random() - 0.5) * 10, // -5% to +5%
    marketReason: marketReasons[Math.floor(Math.random() * marketReasons.length)],
    confidence: Math.random() * 0.3 + 0.7 // 70% to 100% confidence
  }));

  const commentaries = {
    bullish: "The premium wine and spirits market is experiencing strong upward momentum driven by increasing demand from high-net-worth collectors and limited supply from prestigious producers. Favorable auction results and positive critical reviews are supporting price appreciation across blue-chip vintages.",
    bearish: "Market sentiment has shifted to a more cautious stance as economic headwinds and rising interest rates impact luxury spending. Collectors are becoming more selective, focusing on proven blue-chip investments while avoiding speculative positions.",
    neutral: "The market is showing signs of stabilization after recent volatility. While some segments remain strong, others are experiencing cooling demand. Investors are taking a wait-and-see approach, focusing on quality over quantity in their acquisition strategies."
  };

  return {
    updates: {
      timestamp: new Date().toISOString(),
      updates: products,
      marketSentiment: sentiment,
      totalProductsUpdated: products.length
    },
    commentary: commentaries[sentiment]
  };
}

export async function POST() {
  try {
    // In a real app, this would call OpenAI API for insights
    // For now, generate mock insights
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate AI processing
    
    const insights = generateMarketInsights();
    
    console.log('Generated market insights:', insights);
    
    return NextResponse.json({
      success: true,
      ...insights,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error generating market insights:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to generate market insights',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Market insights API endpoint',
    methods: ['POST'],
    description: 'Use POST to generate AI-powered market insights and price updates'
  });
} 