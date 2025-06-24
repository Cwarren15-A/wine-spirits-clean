import { NextRequest, NextResponse } from 'next/server';
import { SupabaseService } from '@/lib/supabase';
import { CacheService } from '@/lib/upstash';
import { ReplicateAIService } from '@/lib/replicate';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      query, 
      filters = {}, 
      limit = 20, 
      offset = 0, 
      includeRecommendations = false,
      userPreferences = {}
    } = body;

    console.log('🔍 Advanced product search:', { query, filters, limit });

    // 1. Check cache first
    const cacheKey = JSON.stringify({ query, filters, limit, offset });
    let cachedResults = await CacheService.getCachedSearchResults(query || '', filters);
    
    if (cachedResults && !includeRecommendations) {
      console.log('⚡ Returning cached search results');
      return NextResponse.json({
        ...cachedResults,
        cached: true,
        timestamp: new Date().toISOString()
      });
    }

    // 2. Search products in Supabase
    const products = await SupabaseService.searchProducts(query, {
      ...filters,
      limit: limit + offset
    });

    if (!products) {
      return NextResponse.json({
        products: [],
        total: 0,
        facets: {},
        message: 'No products found'
      });
    }

    // Apply pagination
    const paginatedProducts = products.slice(offset, offset + limit);

    // 3. Generate facets for filtering
    const facets = generateSearchFacets(products);

    // 4. Get AI recommendations if requested
    let recommendations = [];
    if (includeRecommendations && userPreferences) {
      try {
        console.log('🤖 Generating AI recommendations...');
        recommendations = await ReplicateAIService.getRecommendations(
          userPreferences, 
          products
        );
      } catch (error) {
        console.error('Recommendation error:', error);
        // Continue without recommendations
      }
    }

    const results = {
      products: paginatedProducts,
      total: products.length,
      facets,
      recommendations,
      query,
      filters,
      limit,
      offset,
      hasRecommendations: recommendations.length > 0,
      timestamp: new Date().toISOString()
    };

    // 5. Cache results (without recommendations for broader reusability)
    if (!includeRecommendations) {
      await CacheService.cacheSearchResults(query || '', filters, {
        products: paginatedProducts,
        total: products.length,
        facets
      });
    }

    return NextResponse.json(results);

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { 
        error: 'Search failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type');
    const region = searchParams.get('region');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const vintage = searchParams.get('vintage');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const filters: any = {};
    if (type) filters.type = type;
    if (region) filters.region = region;
    if (priceMin) filters.priceMin = parseFloat(priceMin);
    if (priceMax) filters.priceMax = parseFloat(priceMax);
    if (vintage) filters.vintage = parseInt(vintage);

    // Use the same logic as POST
    const results = await searchProducts(query, filters, limit, offset);
    return NextResponse.json(results);

  } catch (error) {
    console.error('GET search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}

// Helper function for search logic
async function searchProducts(query: string, filters: any, limit: number, offset: number) {
  // Check cache
  let cachedResults = await CacheService.getCachedSearchResults(query, filters);
  
  if (cachedResults) {
    return {
      ...cachedResults,
      cached: true,
      timestamp: new Date().toISOString()
    };
  }

  // Search database
  const products = await SupabaseService.searchProducts(query, {
    ...filters,
    limit: limit + offset
  });

  if (!products) {
    return {
      products: [],
      total: 0,
      facets: {},
      message: 'No products found'
    };
  }

  const paginatedProducts = products.slice(offset, offset + limit);
  const facets = generateSearchFacets(products);

  const results = {
    products: paginatedProducts,
    total: products.length,
    facets,
    query,
    filters,
    limit,
    offset,
    timestamp: new Date().toISOString()
  };

  // Cache results
  await CacheService.cacheSearchResults(query, filters, {
    products: paginatedProducts,
    total: products.length,
    facets
  });

  return results;
}

// Generate search facets for filtering
function generateSearchFacets(products: any[]) {
  const facets: any = {
    types: {},
    regions: {},
    producers: {},
    vintages: {},
    priceRanges: {},
    ratings: {}
  };

  products.forEach(product => {
    // Type facets
    facets.types[product.type] = (facets.types[product.type] || 0) + 1;
    
    // Region facets
    facets.regions[product.region] = (facets.regions[product.region] || 0) + 1;
    
    // Producer facets
    facets.producers[product.producer] = (facets.producers[product.producer] || 0) + 1;
    
    // Vintage facets
    if (product.vintage) {
      const decade = Math.floor(product.vintage / 10) * 10;
      const vintageRange = `${decade}s`;
      facets.vintages[vintageRange] = (facets.vintages[vintageRange] || 0) + 1;
    }
    
    // Price range facets
    const price = product.current_price || product.base_price;
    let priceRange;
    if (price < 100) priceRange = 'Under $100';
    else if (price < 500) priceRange = '$100 - $500';
    else if (price < 1000) priceRange = '$500 - $1,000';
    else if (price < 2500) priceRange = '$1,000 - $2,500';
    else priceRange = 'Over $2,500';
    
    facets.priceRanges[priceRange] = (facets.priceRanges[priceRange] || 0) + 1;
    
    // Rating facets
    if (product.average_rating) {
      const rating = Math.floor(product.average_rating);
      const ratingRange = `${rating}+ stars`;
      facets.ratings[ratingRange] = (facets.ratings[ratingRange] || 0) + 1;
    }
  });

  // Convert to arrays and sort by count
  Object.keys(facets).forEach(facetType => {
    facets[facetType] = Object.entries(facets[facetType])
      .map(([key, count]) => ({ key, count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 10); // Top 10 for each facet
  });

  return facets;
} 