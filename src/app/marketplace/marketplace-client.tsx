'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductSearch } from '@/components/marketplace/product-search';
import { getFeaturedProducts } from '@/lib/products';
import { type Product } from '@/lib/api';

interface InitialFilters {
  type: string;
  region: string;
  varietal: string;
  priceMin: string;
  priceMax: string;
  vintage: string;
  rating: string;
}

export function MarketplaceClient() {
  const searchParams = useSearchParams();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [initialFilters, setInitialFilters] = useState<InitialFilters | null>(null);

  useEffect(() => {
    // Get featured products for initial display
    async function loadProducts() {
      try {
        const products = await getFeaturedProducts();
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Failed to load products:', error);
        // Fall back to empty array if database fails
        setFeaturedProducts([]);
      }
    }
    
    loadProducts();

    // Extract URL parameters for initial filters
    const filters: InitialFilters = {
      type: searchParams.get('type') || '',
      region: searchParams.get('region') || '',
      varietal: searchParams.get('varietal') || '',
      priceMin: searchParams.get('priceMin') || '',
      priceMax: searchParams.get('priceMax') || '',
      vintage: searchParams.get('vintage') || '',
      rating: searchParams.get('rating') || '',
    };

    console.log('🌐 URL search params:', {
      type: searchParams.get('type'),
      region: searchParams.get('region'),
      varietal: searchParams.get('varietal'),
      priceMin: searchParams.get('priceMin'),
      priceMax: searchParams.get('priceMax'),
      vintage: searchParams.get('vintage'),
      rating: searchParams.get('rating'),
    });
    console.log('🎛️ Initial filters being set:', filters);

    setInitialFilters(filters);
  }, [searchParams]);

  if (!initialFilters) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-wine-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🍷</div>
          <div className="text-xl text-slate-600">Loading marketplace...</div>
        </div>
      </div>
    );
  }
  
  return (
    <ProductSearch 
      initialProducts={featuredProducts} 
      initialFilters={initialFilters}
    />
  );
} 