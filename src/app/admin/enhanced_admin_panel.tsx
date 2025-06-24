// Enhanced Admin Panel with AI Market Intelligence
// src/app/admin/enhanced-page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  Activity, 
  Target,
  BarChart3,
  Zap,
  Cpu,
  Globe,
  RefreshCw
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';

interface MarketAnalysis {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  priceDirection: 'up' | 'down' | 'sideways';
  volatility: 'low' | 'medium' | 'high';
  recommendations: string[];
}

interface AIInsight {
  id: string;
  type: 'price_alert' | 'market_trend' | 'arbitrage' | 'risk_warning';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  timestamp: Date;
}

interface PerformanceMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export function EnhancedAdminPanel() {
  const [isAIActive, setIsAIActive] = useState(false);
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis | null>(null);
  const [aiInsights, setAIInsights] = useState<AIInsight[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoMode, setAutoMode] = useState(false);

  useEffect(() => {
    // Initialize with mock data
    generateMockData();
    
    // Start auto-refresh if enabled
    let interval: NodeJS.Timeout;
    if (autoMode) {
      interval = setInterval(() => {
        generateMockData();
      }, 30000); // Update every 30 seconds
    }
    
    return () => clearInterval(interval);
  }, [autoMode]);

  const generateMockData = () => {
    // Mock Market Analysis
    const sentiments: ('bullish' | 'bearish' | 'neutral')[] = ['bullish', 'bearish', 'neutral'];
    const priceDirections: ('up' | 'down' | 'sideways')[] = ['up', 'down', 'sideways'];
    const volatilities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
    
    setMarketAnalysis({
      sentiment: sentiments[Math.floor(Math.random() * 3)],
      confidence: 0.7 + Math.random() * 0.3,
      priceDirection: priceDirections[Math.floor(Math.random() * 3)],
      volatility: volatilities[Math.floor(Math.random() * 3)],
      recommendations: [
        'Consider increasing exposure to Bordeaux First Growths',
        'Japanese whisky showing strong momentum',
        'Champagne prices stabilizing after recent volatility',
        'Watch for arbitrage opportunities in Super Tuscans'
      ]
    });

    // Mock Performance Metrics
    setPerformanceMetrics([
      { label: 'Total Volume', value: 2847000, change: 12.5, trend: 'up' },
      { label: 'Active Trades', value: 156, change: -3.2, trend: 'down' },
      { label: 'Avg Price', value: 1247, change: 8.7, trend: 'up' },
      { label: 'Market Cap', value: 45600000, change: 15.3, trend: 'up' }
    ]);

    // Mock AI Insights
    const insights: AIInsight[] = [
      {
        id: '1',
        type: 'price_alert',
        title: 'Price Alert: Lafite Rothschild 2010',
        description: 'Price approaching historical resistance level at $1,320. Consider profit-taking.',
        confidence: 0.87,
        impact: 'high',
        timestamp: new Date()
      },
      {
        id: '2',
        type: 'market_trend',
        title: 'Market Trend: Japanese Whisky Surge',
        description: 'AI detects 23% increase in Japanese whisky trading volume over 7 days.',
        confidence: 0.94,
        impact: 'medium',
        timestamp: new Date(Date.now() - 300000)
      },
      {
        id: '3',
        type: 'arbitrage',
        title: 'Arbitrage Opportunity: Dom Pérignon',
        description: 'Price discrepancy detected between different vintage years.',
        confidence: 0.76,
        impact: 'medium',
        timestamp: new Date(Date.now() - 600000)
      }
    ];
    setAIInsights(insights);
  };

  const runAIAnalysis = async () => {
    setLoading(true);
    setIsAIActive(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    generateMockData();
    setLoading(false);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-400 bg-green-900/30 border-green-500/30';
      case 'bearish': return 'text-red-400 bg-red-900/30 border-red-500/30';
      default: return 'text-yellow-400 bg-yellow-900/30 border-yellow-500/30';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400 bg-red-900/30';
      case 'medium': return 'text-yellow-400 bg-yellow-900/30';
      default: return 'text-blue-400 bg-blue-900/30';
    }
  };

  // Sample chart data
  const priceData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    value: 1285 + Math.sin(i / 4) * 100 + (Math.random() - 0.5) * 50
  }));

  const portfolioData = [
    { name: 'Bordeaux', value: 35, color: '#dc2626' },
    { name: 'Burgundy', value: 25, color: '#7c2d12' },
    { name: 'Champagne', value: 20, color: '#f59e0b' },
    { name: 'Spirits', value: 15, color: '#059669' },
    { name: 'Others', value: 5, color: '#6366f1' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Market Intelligence Hub
            </h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: isAIActive ? 360 : 0 }}
                  transition={{ duration: 2, repeat: isAIActive ? Infinity : 0, ease: "linear" }}
                  className={`w-3 h-3 rounded-full ${isAIActive ? 'bg-purple-500 animate-pulse' : 'bg-gray-500'}`}
                />
                <span>AI Engine: {isAIActive ? 'Active' : 'Standby'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Auto Mode:</span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAutoMode(!autoMode)}
                  className={`w-12 h-6 rounded-full ${autoMode ? 'bg-purple-600' : 'bg-gray-600'} relative`}
                >
                  <motion.div
                    animate={{ x: autoMode ? 24 : 0 }}
                    className="w-6 h-6 bg-white rounded-full absolute top-0"
                  />
                </motion.button>
              </div>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={runAIAnalysis}
            disabled={loading}
            className="ai-button px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Brain className="w-5 h-5" />
            )}
            {loading ? 'Processing...' : 'Run AI Analysis'}
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Analysis */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* AI Insights */}
          <div className="ai-card p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-400" />
              AI Market Analysis
            </h2>
            
            {marketAnalysis && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-3 rounded-lg border ${getSentimentColor(marketAnalysis.sentiment)}`}>
                    <div className="text-xs uppercase tracking-wide">Sentiment</div>
                    <div className="font-bold">{marketAnalysis.sentiment}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-900/30 border border-purple-500/30 text-purple-400">
                    <div className="text-xs uppercase tracking-wide">Confidence</div>
                    <div className="font-bold">{(marketAnalysis.confidence * 100).toFixed(0)}%</div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">AI Recommendations</div>
                  <div className="space-y-1">
                    {marketAnalysis.recommendations.slice(0, 2).map((rec, index) => (
                      <div key={index} className="text-sm">{rec}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Performance Metrics */}
          <div className="ai-card p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-400" />
              Performance Metrics
            </h2>
            
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50"
                >
                  <div>
                    <div className="text-sm text-slate-400">{metric.label}</div>
                    <div className="font-bold">
                      {metric.label.includes('Volume') || metric.label.includes('Cap') 
                        ? `$${(metric.value / 1000000).toFixed(1)}M`
                        : metric.value.toLocaleString()
                      }
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 ${
                    metric.trend === 'up' ? 'text-green-400' : 
                    metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    <TrendingUp className={`w-4 h-4 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                    {Math.abs(metric.change).toFixed(1)}%
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Price Trend */}
          <div className="ai-card p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Market Trend Analysis
            </h2>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceData}>
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: 'white'
                    }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="url(#trendGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Portfolio Distribution */}
          <div className="ai-card p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-yellow-400" />
              Portfolio Distribution
            </h2>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: 'white'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              {portfolioData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* AI Insights Stream */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="ai-card p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-400" />
              Live AI Insights
            </h2>
            
            <div className="space-y-3">
              <AnimatePresence>
                {aiInsights.map((insight) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="insight-card p-4 rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${getImpactColor(insight.impact).split(' ')[1]}`} />
                      <div className="flex-1">
                        <div className="font-semibold text-sm mb-1">{insight.title}</div>
                        <div className="text-xs text-slate-400 mb-2">{insight.description}</div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500">
                            {insight.timestamp.toLocaleTimeString()}
                          </span>
                          <span className="text-xs font-medium">
                            {(insight.confidence * 100).toFixed(0)}% confidence
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="ai-card p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              Quick Actions
            </h2>
            
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full action-button p-3 rounded-lg text-left"
              >
                <div className="font-semibold text-sm">Generate Market Report</div>
                <div className="text-xs text-slate-400">AI-powered comprehensive analysis</div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full action-button p-3 rounded-lg text-left"
              >
                <div className="font-semibold text-sm">Price Optimization</div>
                <div className="text-xs text-slate-400">Automated pricing adjustments</div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full action-button p-3 rounded-lg text-left"
              >
                <div className="font-semibold text-sm">Risk Assessment</div>
                <div className="text-xs text-slate-400">Portfolio risk analysis</div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Additional CSS styles
/*
.ai-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.ai-button {
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  color: white;
  transition: all 0.3s ease;
}

.ai-button:hover {
  background: linear-gradient(135deg, #7c3aed, #9333ea);
  box-shadow: 0 10px 25px rgba(139, 92, 246, 0.3);
}

.ai-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.insight-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.insight-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(139, 92, 246, 0.3);
}

.action-button {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(34, 197, 94, 0.3);
}
*/