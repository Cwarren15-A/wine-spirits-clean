'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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

interface ProductSearchProps {
  initialProducts: Product[];
  initialFilters: InitialFilters;
}

export function ProductSearch({ initialProducts, initialFilters }: ProductSearchProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filters, setFilters] = useState(initialFilters);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    applyFilters();
  }, [filters, searchQuery, initialProducts]);

  const applyFilters = () => {
    let filtered = initialProducts;
    console.log('🔍 Applying filters to', initialProducts.length, 'products');
    console.log('📋 Current filters:', filters);
    console.log('🔎 Search query:', searchQuery);

    // Check if any filters are actually set
    const hasActiveFilters = searchQuery || 
      filters.type || 
      filters.region || 
      filters.varietal || 
      filters.priceMin || 
      filters.priceMax || 
      filters.vintage || 
      filters.rating;

    console.log('🎯 Has active filters:', hasActiveFilters);

    // If no filters are set, show all products
    if (!hasActiveFilters) {
      console.log('✅ No filters active, showing all', initialProducts.length, 'products');
      setProducts(initialProducts);
      return;
    }

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.producer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.region.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.type) {
      filtered = filtered.filter(product => product.type === filters.type);
    }
    if (filters.region) {
      filtered = filtered.filter(product => 
        product.region.toLowerCase().includes(filters.region.toLowerCase())
      );
    }
    if (filters.varietal) {
      filtered = filtered.filter(product => 
        product.varietal?.toLowerCase().includes(filters.varietal.toLowerCase())
      );
    }
    if (filters.priceMin) {
      const min = parseFloat(filters.priceMin);
      filtered = filtered.filter(product => (product.current_price || product.base_price) >= min);
    }
    if (filters.priceMax) {
      const max = parseFloat(filters.priceMax);
      filtered = filtered.filter(product => (product.current_price || product.base_price) <= max);
    }
    if (filters.vintage) {
      filtered = filtered.filter(product => product.vintage?.toString() === filters.vintage);
    }
    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter(product => (product.average_rating || 0) >= minRating);
    }

    console.log('Filtered to', filtered.length, 'products');
    setProducts(filtered);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getProductIcon = (type: string) => {
    return type === 'wine' ? '🍷' : '🥃';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-wine-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search wines, spirits, producers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 text-lg rounded-xl border border-wine-200 focus:outline-none focus:ring-2 focus:ring-wine-500 focus:border-transparent"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-wine-400">🔍</div>
          </div>
        </div>

        <div className="mb-8 p-6 bg-white rounded-xl shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wine-500"
              >
                <option value="">All Types</option>
                <option value="wine">Wine</option>
                <option value="spirits">Spirits</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Region</label>
              <input
                type="text"
                placeholder="e.g. Bordeaux"
                value={filters.region}
                onChange={(e) => setFilters({...filters, region: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wine-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Min Price</label>
              <input
                type="number"
                placeholder="$0"
                value={filters.priceMin}
                onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wine-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Max Price</label>
              <input
                type="number"
                placeholder="$10000"
                value={filters.priceMax}
                onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wine-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Vintage</label>
              <input
                type="number"
                placeholder="2020"
                value={filters.vintage}
                onChange={(e) => setFilters({...filters, vintage: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wine-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Varietal</label>
              <input
                type="text"
                placeholder="e.g. Cabernet"
                value={filters.varietal}
                onChange={(e) => setFilters({...filters, varietal: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wine-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Min Rating</label>
              <select
                value={filters.rating}
                onChange={(e) => setFilters({...filters, rating: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wine-500"
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
                <option value="3.0">3.0+ Stars</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-wine-900">
            {products.length} {products.length === 1 ? 'Product' : 'Products'} Found
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/marketplace/product/${product.id}`}>
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                <div className="aspect-square bg-gradient-to-br from-wine-100 to-gold-100 relative flex items-center justify-center">
                  {product.primary_image_url ? (
                    <img
                      src={product.primary_image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-6xl">{getProductIcon(product.type)}</div>
                  )}
                  
                  {product.featured && (
                    <div className="absolute top-3 left-3 bg-gold-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      ⭐ FEATURED
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="font-bold text-wine-900 line-clamp-2 group-hover:text-wine-700">
                      {product.name}
                    </h3>
                    <p className="text-sm text-wine-600">
                      {product.producer} • {product.vintage || 'NV'}
                    </p>
                    <p className="text-sm text-slate-600">
                      {product.region}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xl font-bold text-wine-900">
                        {formatPrice(product.current_price || product.base_price)}
                      </div>
                      {product.average_rating && (
                        <div className="text-sm text-gold-500">
                          ⭐ {product.average_rating.toFixed(1)}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      {product.available_quantity <= 5 && (
                        <div className="text-xs text-red-600 font-medium">
                          Only {product.available_quantity} left!
                        </div>
                      )}
                      <div className="text-xs text-slate-500">
                        {product.available_quantity} available
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No products found</h3>
            <p className="text-slate-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
