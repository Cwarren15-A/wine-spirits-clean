'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { productApi, orderBookApi, utils, type Product, type OrderBook, type PriceHistory } from '@/lib/api';
import { getPriceHistory, calculatePriceChange } from '@/lib/price-service';
import { PriceSparkline } from '@/components/ui/PriceSparkline';
import { TrendBadge } from '@/components/ui/TrendBadge';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [orderType, setOrderType] = useState<'bid' | 'ask'>('bid');
  const [orderPrice, setOrderPrice] = useState('');
  const [orderQuantity, setOrderQuantity] = useState('1');

  useEffect(() => {
    loadProductData();
  }, [productId]);

  const loadProductData = async () => {
    setLoading(true);
    try {
      const [productData, orderBookData] = await Promise.all([
        productApi.getProduct(productId),
        orderBookApi.getMarketDepth(productId)
      ]);
      
      setProduct(productData);
      setOrderBook(orderBookData);

      // Load price history if product exists
      if (productData && productData.slug) {
        try {
          const history = await getPriceHistory(
            productData.id,
            productData.slug,
            productData.type as "wine" | "spirits"
          );
          setPriceHistory(history);
        } catch (error) {
          console.warn('Failed to load price history:', error);
        }
      }
    } catch (error) {
      console.error('Error loading product data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!product) return;
    
    try {
      const orderData = {
        product_id: productId,
        user_id: 'demo-user', // In real app, get from auth
        order_type: orderType,
        price: parseFloat(orderPrice),
        quantity: parseInt(orderQuantity),
        age_verified: true,
        shipping_state: 'CA'
      };

      const result = await orderBookApi.placeOrder(orderData);
      if (result.success) {
        alert('Order placed successfully!');
        loadProductData(); // Refresh order book
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-wine-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🍷</div>
          <div className="text-xl text-slate-600">Loading product details...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-wine-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Product Not Found</h1>
          <p className="text-slate-600 mb-4">The product you're looking for doesn't exist.</p>
          <Link href="/marketplace" className="btn-premium px-6 py-3 rounded-lg font-semibold">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const currentPrice = product.current_price || product.base_price;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-wine-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="text-sm text-slate-600">
            <Link href="/" className="hover:text-wine-600">Home</Link>
            {' > '}
            <Link href="/marketplace" className="hover:text-wine-600">Marketplace</Link>
            {' > '}
            <span className="text-wine-600">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Product Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Header */}
            <div className="card-premium rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-wine-100 to-gold-100 rounded-lg flex items-center justify-center">
                    {product.primary_image_url ? (
                      <img
                        src={product.primary_image_url}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`text-8xl ${product.primary_image_url ? 'hidden' : ''}`}>
                      {utils.getProductIcon(product.type)}
                    </div>
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.featured && (
                      <span className="bg-gold-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        ⭐ FEATURED
                      </span>
                    )}
                    {product.investment_grade && (
                      <span className="bg-wine-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        💎 INVESTMENT GRADE
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-wine-600 font-medium">
                        {product.type.toUpperCase()} • {product.vintage || 'NV'}
                      </span>
                      {product.price_change_24h && (
                        <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                          product.price_change_24h > 0 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}>
                          {utils.formatPercentage(product.price_change_24h)}
                        </span>
                      )}
                    </div>
                    
                    <h1 className="text-3xl font-bold text-wine-900 mb-2">
                      {product.name}
                    </h1>
                    
                    <p className="text-lg text-wine-700 mb-4">
                      {product.producer} • {product.region}
                    </p>

                    <p className="text-slate-600 mb-6">
                      {product.description}
                    </p>
                  </div>

                  {/* Investment Performance */}
                  {product.fiveYearPriceChangePct !== undefined && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-wine-50 rounded-lg border border-emerald-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-wine-800">Investment Performance</h3>
                        <TrendBadge pct={product.fiveYearPriceChangePct} size="lg" />
                      </div>
                      
                      {/* Price History Chart */}
                      {priceHistory && priceHistory.points.length > 0 && (
                        <div className="mb-3">
                          <div className="text-xs text-slate-600 mb-2">Price History (60 days)</div>
                          <PriceSparkline 
                            data={priceHistory.points.map((p: any) => p.price)} 
                            className="h-16"
                          />
                        </div>
                      )}
                      
                      <div className="text-sm text-slate-600">
                        5-year compound annual growth rate: {((Math.pow(1 + (product.fiveYearPriceChangePct / 100), 1/5) - 1) * 100).toFixed(1)}%
                      </div>
                    </div>
                  )}

                  {/* Ratings & Scores */}
                  {(product.average_rating || product.wine_spectator_score || product.robert_parker_score) && (
                    <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                      <h3 className="font-semibold text-wine-800 mb-3">Ratings & Scores</h3>
                      {product.average_rating && (
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-gold-500">
                            {utils.getRatingStars(product.average_rating)}
                          </span>
                          <span className="font-medium">
                            {product.average_rating.toFixed(1)} ({product.total_reviews} reviews)
                          </span>
                        </div>
                      )}
                      
                      <div className="flex gap-4 text-sm">
                        {product.wine_spectator_score && (
                          <span className="font-medium">Wine Spectator: {product.wine_spectator_score}</span>
                        )}
                        {product.robert_parker_score && (
                          <span className="font-medium">Robert Parker: {product.robert_parker_score}</span>
                        )}
                        {product.james_suckling_score && (
                          <span className="font-medium">James Suckling: {product.james_suckling_score}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Key Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Varietal:</span>
                      <div className="font-medium">{product.varietal}</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Volume:</span>
                      <div className="font-medium">{utils.formatVolume(product.volume_ml)}</div>
                    </div>
                    <div>
                      <span className="text-slate-600">ABV:</span>
                      <div className="font-medium">{utils.formatAlcoholContent(product.alcohol_content)}</div>
                    </div>
                    {product.rarity_score && (
                      <div>
                        <span className="text-slate-600">Rarity Score:</span>
                        <div className="font-medium text-wine-600">{product.rarity_score}/10</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="card-premium rounded-xl overflow-hidden">
              <div className="border-b">
                <nav className="flex">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'tasting', label: 'Tasting Notes' },
                    { id: 'provenance', label: 'Provenance' },
                    { id: 'seller', label: 'Seller Info' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-wine-600 text-wine-600'
                          : 'border-transparent text-slate-600 hover:text-wine-600'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {product.tasting_notes && (
                      <div>
                        <h3 className="font-semibold text-wine-800 mb-2">Tasting Notes</h3>
                        <p className="text-slate-600">{product.tasting_notes}</p>
                      </div>
                    )}

                    {product.food_pairings && product.food_pairings.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-wine-800 mb-2">Food Pairings</h3>
                        <div className="flex flex-wrap gap-2">
                          {product.food_pairings.map((pairing, index) => (
                            <span key={index} className="bg-wine-100 text-wine-700 px-3 py-1 rounded-full text-sm">
                              {pairing}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                      {product.serving_temperature && (
                        <div>
                          <h3 className="font-semibold text-wine-800 mb-2">Serving Temperature</h3>
                          <p className="text-slate-600">{product.serving_temperature}</p>
                        </div>
                      )}

                      {product.aging_potential && (
                        <div>
                          <h3 className="font-semibold text-wine-800 mb-2">Aging Potential</h3>
                          <p className="text-slate-600">{product.aging_potential}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'tasting' && (
                  <div className="space-y-4">
                    {product.tasting_notes ? (
                      <p className="text-slate-600 text-lg leading-relaxed">{product.tasting_notes}</p>
                    ) : (
                      <p className="text-slate-500 italic">No detailed tasting notes available.</p>
                    )}
                  </div>
                )}

                {activeTab === 'provenance' && (
                  <div className="space-y-6">
                    {product.vineyard_location && (
                      <div>
                        <h3 className="font-semibold text-wine-800 mb-2">Vineyard Location</h3>
                        <p className="text-slate-600">{product.vineyard_location}</p>
                      </div>
                    )}

                    {product.estate_history && (
                      <div>
                        <h3 className="font-semibold text-wine-800 mb-2">Estate History</h3>
                        <p className="text-slate-600">{product.estate_history}</p>
                      </div>
                    )}

                    {product.production_methods && (
                      <div>
                        <h3 className="font-semibold text-wine-800 mb-2">Production Methods</h3>
                        <p className="text-slate-600">{product.production_methods}</p>
                      </div>
                    )}

                    {product.certifications && product.certifications.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-wine-800 mb-2">Certifications</h3>
                        <div className="flex flex-wrap gap-2">
                          {product.certifications.map((cert, index) => (
                            <span key={index} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                              ✓ {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'seller' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-wine-100 rounded-full flex items-center justify-center text-2xl">
                        🏪
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-wine-800">{product.seller.business_name}</h3>
                        <p className="text-slate-600">
                          {utils.getVerificationBadge(product.seller.verification_status)} 
                          {product.seller.verification_status === 'verified' ? ' Verified Seller' : ' Pending Verification'}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-wine-800 mb-2">Seller Rating</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">⭐</span>
                          <span className="text-xl font-bold">{product.seller.seller_rating}/5.0</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-wine-800 mb-2">License Info</h4>
                        <p className="text-slate-600">{product.seller.license_number}</p>
                        <p className="text-slate-600">{product.seller.license_state}</p>
                      </div>

                      {product.seller.years_in_business && (
                        <div>
                          <h4 className="font-semibold text-wine-800 mb-2">Experience</h4>
                          <p className="text-slate-600">{product.seller.years_in_business} years in business</p>
                        </div>
                      )}

                      {product.seller.total_sales && (
                        <div>
                          <h4 className="font-semibold text-wine-800 mb-2">Total Sales</h4>
                          <p className="text-slate-600">{product.seller.total_sales.toLocaleString()} transactions</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Order Book & Trading */}
          <div className="space-y-6">
            {/* Price & Order */}
            <div className="card-premium rounded-xl p-6">
              <div className="mb-6">
                <div className="text-3xl font-bold text-wine-900 mb-2">
                  {utils.formatPrice(currentPrice)}
                </div>
                {product.current_price && product.current_price !== product.base_price && (
                  <div className="text-lg text-slate-500 line-through">
                    {utils.formatPrice(product.base_price)}
                  </div>
                )}
                
                {product.last_traded_price && (
                  <div className="text-sm text-slate-600 mt-2">
                    Last traded: {utils.formatPrice(product.last_traded_price)}
                  </div>
                )}

                {product.price_range_52week && (
                  <div className="text-sm text-slate-600 mt-1">
                    52-week range: {utils.formatPrice(product.price_range_52week.low)} - {utils.formatPrice(product.price_range_52week.high)}
                  </div>
                )}
              </div>

              {/* Availability */}
              <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Available:</span>
                  <span className={`font-bold ${
                    product.available_quantity <= 5 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {product.available_quantity} {product.available_quantity === 1 ? 'bottle' : 'bottles'}
                  </span>
                </div>
                {product.available_quantity <= 5 && (
                  <div className="text-sm text-red-600">⚠️ Limited availability - act fast!</div>
                )}
              </div>

              {/* Order Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Order Type</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setOrderType('bid')}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                        orderType === 'bid' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => setOrderType('ask')}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                        orderType === 'ask' 
                          ? 'bg-red-500 text-white' 
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      Sell
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Price per bottle</label>
                  <input
                    type="number"
                    value={orderPrice}
                    onChange={(e) => setOrderPrice(e.target.value)}
                    placeholder={currentPrice.toString()}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-wine-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(e.target.value)}
                    min="1"
                    max={product.available_quantity}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-wine-500"
                  />
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={!orderPrice || !orderQuantity}
                  className="w-full btn-premium py-3 rounded-lg font-semibold disabled:opacity-50"
                >
                  Place {orderType === 'bid' ? 'Buy' : 'Sell'} Order
                </button>

                <div className="text-xs text-slate-500 text-center">
                  Total: {orderPrice && orderQuantity ? utils.formatPrice(parseFloat(orderPrice) * parseInt(orderQuantity)) : '$0.00'}
                </div>
              </div>
            </div>

            {/* Order Book */}
            {orderBook && (
              <div className="card-premium rounded-xl p-6">
                <h3 className="text-lg font-semibold text-wine-800 mb-4">Market Depth</h3>
                
                <div className="space-y-4">
                  {/* Asks (Sell Orders) */}
                  <div>
                    <h4 className="text-sm font-medium text-red-600 mb-2">Sell Orders</h4>
                    <div className="space-y-1">
                      {orderBook.asks.map((ask, index) => (
                        <div key={index} className="flex justify-between items-center text-sm py-1 px-2 bg-red-50 rounded">
                          <span className="text-red-600">{utils.formatPrice(ask.price)}</span>
                          <span className="text-slate-600">{ask.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Current Price */}
                  <div className="text-center py-2 border-y border-slate-200">
                    <div className="text-lg font-bold text-wine-900">
                      {utils.formatPrice(currentPrice)}
                    </div>
                    <div className="text-xs text-slate-500">Current Price</div>
                  </div>

                  {/* Bids (Buy Orders) */}
                  <div>
                    <h4 className="text-sm font-medium text-green-600 mb-2">Buy Orders</h4>
                    <div className="space-y-1">
                      {orderBook.bids.map((bid, index) => (
                        <div key={index} className="flex justify-between items-center text-sm py-1 px-2 bg-green-50 rounded">
                          <span className="text-green-600">{utils.formatPrice(bid.price)}</span>
                          <span className="text-slate-600">{bid.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Compliance Notice */}
            <div className="card-premium rounded-xl p-6 bg-blue-50 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">🛡️ Compliance Notice</h3>
              <div className="text-sm text-blue-700 space-y-2">
                <p>✓ TTB Compliant Transaction</p>
                <p>✓ Age Verification Required (21+)</p>
                <p>✓ Adult Signature on Delivery</p>
                {product.shipping_restrictions && product.shipping_restrictions.length > 0 && (
                  <div>
                    <p className="font-medium">Shipping Restrictions:</p>
                    <ul className="list-disc list-inside ml-2">
                      {product.shipping_restrictions.map((restriction, index) => (
                        <li key={index}>{restriction}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 