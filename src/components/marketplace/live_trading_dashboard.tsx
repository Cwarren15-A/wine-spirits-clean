'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PriceSparkline } from '@/components/ui/PriceSparkline';
import { TrendBadge } from '@/components/ui/TrendBadge';

interface TradingData {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  priceHistory: number[];
  lastTraded: Date;
}

export function LiveTradingDashboard() {
  const [tradingData, setTradingData] = useState<TradingData[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [sortBy, setSortBy] = useState('volume');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate real-time trading data
    const generateMockData = (): TradingData[] => {
      const symbols = [
        { name: 'Château Lafite Rothschild 2010', symbol: 'LAF10' },
        { name: 'Dom Pérignon 2013', symbol: 'DP13' },
        { name: 'Macallan 25 Year Old', symbol: 'MAC25' },
        { name: 'Screaming Eagle 2019', symbol: 'SE19' },
        { name: 'Hennessy Paradis', symbol: 'HP' },
        { name: 'Château Margaux 2015', symbol: 'MAR15' },
        { name: 'Opus One 2018', symbol: 'OP18' },
        { name: 'Louis XIII Cognac', symbol: 'L13' }
      ];

      return symbols.map((item, index) => {
        const basePrice = 500 + (index * 200) + Math.random() * 1000;
        const priceChange = (Math.random() - 0.5) * 10;
        const history = Array.from({ length: 24 }, () => 
          basePrice + (Math.random() - 0.5) * 100
        );

        return {
          id: `trading-${index}`,
          name: item.name,
          symbol: item.symbol,
          currentPrice: basePrice,
          priceChange24h: priceChange,
          volume24h: Math.floor(Math.random() * 50) + 10,
          marketCap: basePrice * (Math.floor(Math.random() * 1000) + 100),
          priceHistory: history,
          lastTraded: new Date(Date.now() - Math.random() * 3600000)
        };
      });
    };

    const data = generateMockData();
    setTradingData(data);
    setIsLoading(false);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setTradingData(prev => prev.map(item => ({
        ...item,
        currentPrice: item.currentPrice + (Math.random() - 0.5) * 10,
        priceChange24h: item.priceChange24h + (Math.random() - 0.5) * 2,
        volume24h: Math.max(1, item.volume24h + Math.floor((Math.random() - 0.5) * 5)),
        lastTraded: Math.random() > 0.8 ? new Date() : item.lastTraded
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatVolume = (volume: number) => {
    return volume.toLocaleString();
  };

  const timeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const sortedData = [...tradingData].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return b.currentPrice - a.currentPrice;
      case 'change':
        return Math.abs(b.priceChange24h) - Math.abs(a.priceChange24h);
      case 'volume':
        return b.volume24h - a.volume24h;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-wine-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <div className="text-xl text-slate-600">Loading trading data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-wine-50">
      {/* Header */}
      <div className="bg-white border-b border-wine-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-wine-900">Live Trading Floor</h1>
              <p className="text-slate-600">Real-time market data and trading activity</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href="/marketplace">
                <button className="px-4 py-2 border border-wine-200 text-wine-600 rounded-lg hover:bg-wine-50 transition-colors">
                  Back to Marketplace
                </button>
              </Link>
              
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-slate-600">Live Data</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Market Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-sm text-slate-600 mb-1">Total Volume</div>
            <div className="text-2xl font-bold text-wine-900">
              {formatVolume(tradingData.reduce((sum, item) => sum + item.volume24h, 0))}
            </div>
            <div className="text-sm text-green-600">+12.5% today</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-sm text-slate-600 mb-1">Active Products</div>
            <div className="text-2xl font-bold text-wine-900">{tradingData.length}</div>
            <div className="text-sm text-slate-500">Currently trading</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-sm text-slate-600 mb-1">Avg Price Change</div>
            <div className="text-2xl font-bold text-wine-900">
              <TrendBadge 
                pct={tradingData.reduce((sum, item) => sum + item.priceChange24h, 0) / tradingData.length} 
                size="lg"
              />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-sm text-slate-600 mb-1">Market Status</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-lg font-semibold text-green-600">Open</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-slate-700">Timeframe:</span>
              {['1h', '24h', '7d', '30d'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedTimeframe(period)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    selectedTimeframe === period
                      ? 'bg-wine-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-wine-500"
              >
                <option value="volume">Volume</option>
                <option value="price">Price</option>
                <option value="change">Price Change</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Trading Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-slate-700">Product</th>
                  <th className="text-right p-4 font-semibold text-slate-700">Price</th>
                  <th className="text-right p-4 font-semibold text-slate-700">24h Change</th>
                  <th className="text-right p-4 font-semibold text-slate-700">Volume</th>
                  <th className="text-center p-4 font-semibold text-slate-700">Chart (24h)</th>
                  <th className="text-right p-4 font-semibold text-slate-700">Last Trade</th>
                  <th className="text-center p-4 font-semibold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-b border-slate-100 hover:bg-slate-50 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-slate-25'
                    }`}
                  >
                    <td className="p-4">
                      <div>
                        <div className="font-semibold text-slate-900">{item.symbol}</div>
                        <div className="text-sm text-slate-600 truncate max-w-48">
                          {item.name}
                        </div>
                      </div>
                    </td>
                    
                    <td className="text-right p-4">
                      <div className="font-semibold text-slate-900">
                        {formatPrice(item.currentPrice)}
                      </div>
                    </td>
                    
                    <td className="text-right p-4">
                      <TrendBadge pct={item.priceChange24h} size="sm" />
                    </td>
                    
                    <td className="text-right p-4">
                      <div className="text-slate-900">{formatVolume(item.volume24h)}</div>
                      <div className="text-xs text-slate-500">bottles</div>
                    </td>
                    
                    <td className="text-center p-4">
                      <PriceSparkline
                        data={item.priceHistory}
                        width={80}
                        height={30}
                        className="mx-auto"
                      />
                    </td>
                    
                    <td className="text-right p-4">
                      <div className="text-sm text-slate-600">
                        {timeAgo(item.lastTraded)}
                      </div>
                    </td>
                    
                    <td className="text-center p-4">
                      <Link href={`/marketplace/product/${item.id}`}>
                        <button className="px-3 py-1 bg-wine-600 hover:bg-wine-700 text-white text-sm rounded-lg transition-colors">
                          Trade
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Market data updates every 5 seconds • Prices shown are indicative
          </p>
        </div>
      </div>
    </div>
  );
}
