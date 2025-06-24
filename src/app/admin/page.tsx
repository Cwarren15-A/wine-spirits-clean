'use client';

import React, { useState, useEffect } from 'react';
// OpenAI functionality now handled via API routes

interface MarketUpdate {
  timestamp: string;
  updates: Array<{
    productId: string;
    newPrice: number;
    priceChange24h: number;
    marketReason?: string;
    confidence: number;
  }>;
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
  totalProductsUpdated: number;
}

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<MarketUpdate | null>(null);
  const [marketCommentary, setMarketCommentary] = useState('');
  const [error, setError] = useState('');
  const [apiStatus, setApiStatus] = useState<{ openaiConfigured: boolean; model: string } | null>(null);

  // Check API status on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/admin/status')
        .then(res => res.json())
        .then(data => setApiStatus(data))
        .catch(err => console.error('Failed to check API status:', err));
    }
  }, [isAuthenticated]);

  const handlePasswordSubmit = () => {
    // Simple password check - you can change this password
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handlePriceUpdate = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/update-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update prices');
      }

      const update = await response.json();
      setLastUpdate(update);
      
      alert(`Successfully updated ${update.totalProductsUpdated} products with ${update.marketSentiment} sentiment!`);
    } catch (err) {
      setError(`Error updating prices: ${err instanceof Error ? err.message : 'Unknown error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMarketInsights = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/market-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate insights');
      }

      const insights = await response.json();
      setLastUpdate(insights.updates);
      setMarketCommentary(insights.commentary);
      
      alert('Market insights generated successfully!');
    } catch (err) {
      setError(`Error generating insights: ${err instanceof Error ? err.message : 'Unknown error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-600 bg-green-100';
      case 'bearish': return 'text-red-600 bg-red-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  // Password protection screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-wine-50 flex items-center justify-center p-8">
        <div className="card-premium rounded-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-6">🔐</div>
          
          <h1 className="text-3xl font-bold text-wine-900 mb-4">
            Admin Access Required
          </h1>
          
          <p className="text-slate-600 mb-6">
            Please enter the admin password to access the marketplace administration panel.
          </p>
          
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 border border-wine-200 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handlePasswordSubmit}
            className="w-full btn-premium px-6 py-3 rounded-lg font-semibold"
          >
            Access Admin Panel
          </button>
          
          <div className="mt-6 text-xs text-slate-500">
            <p>🔒 Authorized personnel only</p>
            <p>Contact system administrator for access</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-wine-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-premium mb-4">
                🍷 Marketplace Admin Dashboard
              </h1>
              <p className="text-xl text-slate-600">
                AI-powered price updates using configured OpenAI API
              </p>
            </div>
            
            <button
              onClick={() => setIsAuthenticated(false)}
              className="btn-gold px-4 py-2 rounded-lg font-semibold text-sm"
            >
              Logout
            </button>
          </div>
          
          {/* Navigation to New Components */}
          <div className="flex flex-wrap gap-4 mt-6">
            <a 
              href="/admin/enhanced" 
              className="btn-premium px-6 py-3 rounded-lg font-semibold text-sm"
            >
              🧠 Enhanced AI Panel
            </a>
            <a 
              href="/marketplace/trading" 
              className="btn-wine px-6 py-3 rounded-lg font-semibold text-sm"
            >
              📈 Live Trading Floor
            </a>
            <a 
              href="/marketplace" 
              className="btn-gold px-6 py-3 rounded-lg font-semibold text-sm"
            >
              🛒 Marketplace
            </a>
          </div>
        </div>

        {/* API Status */}
        <div className="card-premium rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-wine-800 mb-4">System Status</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">OpenAI API</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                {apiStatus?.openaiConfigured ? `Configured & Ready (${apiStatus.model})` : 'Not Configured'}
              </p>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">Price Engine</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">Ready for Updates</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handlePriceUpdate}
              disabled={loading}
              className="btn-premium px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Prices'}
            </button>
            
            <button
              onClick={handleMarketInsights}
              disabled={loading}
              className="btn-gold px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Market Insights'}
            </button>
          </div>
        </div>

        {/* Market Commentary */}
        {marketCommentary && (
          <div className="card-premium rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold text-wine-800 mb-4">📈 Market Commentary</h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              {marketCommentary}
            </p>
          </div>
        )}

        {/* Last Update Results */}
        {lastUpdate && (
          <div className="card-premium rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold text-wine-800 mb-4">📊 Latest Price Updates</h2>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-wine-800">{lastUpdate.totalProductsUpdated}</div>
                <div className="text-sm text-slate-600">Products Updated</div>
              </div>
              
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className={`text-2xl font-bold capitalize ${getSentimentColor(lastUpdate.marketSentiment).split(' ')[0]}`}>
                  {lastUpdate.marketSentiment}
                </div>
                <div className="text-sm text-slate-600">Market Sentiment</div>
              </div>
              
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-wine-800">
                  {new Date(lastUpdate.timestamp).toLocaleTimeString()}
                </div>
                <div className="text-sm text-slate-600">Last Updated</div>
              </div>
            </div>

            {/* Individual Updates */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-wine-800">Individual Price Changes</h3>
              {lastUpdate.updates.map((update, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-slate-800">Product ID: {update.productId}</div>
                    {update.marketReason && (
                      <div className="text-sm text-slate-600">{update.marketReason}</div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      ${update.newPrice.toLocaleString()}
                    </div>
                    <div className={`text-sm font-medium ${
                      update.priceChange24h > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {update.priceChange24h > 0 ? '+' : ''}{update.priceChange24h.toFixed(2)}%
                    </div>
                  </div>
                  
                  <div className="ml-4 text-right">
                    <div className="text-xs text-slate-500">Confidence</div>
                    <div className="text-sm font-medium">
                      {(update.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="card-premium rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-wine-800 mb-4">🔧 How It Works</h2>
          
          <div className="space-y-4 text-slate-600">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-wine-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <strong>Environment Variables:</strong> OpenAI API key is securely stored in Vercel environment variables
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-wine-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <strong>Update Prices:</strong> AI analyzes current products and generates realistic price movements
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-wine-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <strong>Generate Insights:</strong> Get market commentary and comprehensive analysis
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-wine-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
              <div>
                <strong>Secure Access:</strong> Password-protected admin panel for authorized users only
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">💡 Pro Tips:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Run updates 1-2 times per day for realistic market movement</li>
              <li>• API key is securely managed through environment variables</li>
              <li>• Password: admin123 (change in code for production)</li>
              <li>• All price changes are AI-generated based on market conditions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
