-- Wine & Spirits Marketplace Database Schema
-- Run this in your Supabase SQL Editor to create all necessary tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  age_verified BOOLEAN DEFAULT FALSE,
  phone TEXT,
  address JSONB,
  verification_documents JSONB,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sellers table
CREATE TABLE public.sellers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  business_name TEXT NOT NULL,
  license_number TEXT UNIQUE NOT NULL,
  license_state TEXT NOT NULL,
  verification_status TEXT CHECK (verification_status IN ('verified', 'pending', 'unverified')) DEFAULT 'pending',
  seller_rating DECIMAL(3,2) DEFAULT 0.00,
  total_sales INTEGER DEFAULT 0,
  years_in_business INTEGER,
  business_address JSONB,
  tax_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('wine', 'spirits', 'beer', 'sake')) NOT NULL,
  varietal TEXT NOT NULL,
  region TEXT NOT NULL,
  appellation TEXT,
  vintage INTEGER,
  producer TEXT NOT NULL,
  alcohol_content DECIMAL(4,2) NOT NULL,
  volume_ml INTEGER NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  current_price DECIMAL(10,2) NOT NULL,
  price_change_24h DECIMAL(8,4) DEFAULT 0,
  market_cap DECIMAL(15,2),
  
  -- Quality & Ratings
  average_rating DECIMAL(3,2),
  total_reviews INTEGER DEFAULT 0,
  wine_spectator_score INTEGER,
  robert_parker_score INTEGER,
  james_suckling_score INTEGER,
  
  -- Visual & Media
  primary_image_url TEXT,
  image_urls TEXT[] DEFAULT '{}',
  
  -- Product Details
  tasting_notes TEXT,
  food_pairings TEXT[] DEFAULT '{}',
  serving_temperature TEXT,
  aging_potential TEXT,
  harvest_method TEXT,
  fermentation_process TEXT,
  
  -- Provenance & Authentication
  vineyard_location TEXT,
  estate_history TEXT,
  production_methods TEXT,
  sustainability_practices TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  
  -- Trading Information
  available_quantity INTEGER NOT NULL DEFAULT 0,
  minimum_order_quantity INTEGER DEFAULT 1,
  last_traded_price DECIMAL(10,2),
  price_range_52week_low DECIMAL(10,2),
  price_range_52week_high DECIMAL(10,2),
  volume_traded_24h INTEGER DEFAULT 0,
  
  -- Seller Information
  seller_id UUID REFERENCES public.sellers(id) NOT NULL,
  
  -- Compliance & Legal
  requires_adult_signature BOOLEAN DEFAULT TRUE,
  shipping_restrictions TEXT[] DEFAULT '{}',
  tax_information TEXT,
  compliance_notes TEXT,
  ttb_approved BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  featured BOOLEAN DEFAULT FALSE,
  rarity_score INTEGER CHECK (rarity_score >= 1 AND rarity_score <= 10),
  investment_grade BOOLEAN DEFAULT FALSE,
  slug TEXT UNIQUE,
  search_vector tsvector,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order book entries table
CREATE TABLE public.order_book_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) NOT NULL,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  order_type TEXT CHECK (order_type IN ('bid', 'ask')) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  original_quantity INTEGER NOT NULL,
  status TEXT CHECK (status IN ('active', 'filled', 'cancelled', 'partial')) DEFAULT 'active',
  expires_at TIMESTAMP WITH TIME ZONE,
  filled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) NOT NULL,
  buyer_id UUID REFERENCES public.users(id) NOT NULL,
  seller_id UUID REFERENCES public.users(id) NOT NULL,
  buy_order_id UUID REFERENCES public.order_book_entries(id),
  sell_order_id UUID REFERENCES public.order_book_entries(id),
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  fees DECIMAL(10,2) DEFAULT 0,
  status TEXT CHECK (status IN ('pending', 'completed', 'cancelled', 'failed')) DEFAULT 'pending',
  settlement_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Price history table
CREATE TABLE public.price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  volume INTEGER DEFAULT 0,
  high DECIMAL(10,2),
  low DECIMAL(10,2),
  open DECIMAL(10,2),
  close DECIMAL(10,2),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT DEFAULT 'marketplace'
);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) NOT NULL,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title TEXT,
  comment TEXT,
  verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

-- Watchlists table
CREATE TABLE public.watchlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  notes TEXT,
  target_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- User portfolios table
CREATE TABLE public.portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  average_cost DECIMAL(10,2) NOT NULL,
  total_cost DECIMAL(12,2) NOT NULL,
  notes TEXT,
  storage_location TEXT,
  insurance_value DECIMAL(12,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market analytics table
CREATE TABLE public.market_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  total_volume DECIMAL(15,2) DEFAULT 0,
  total_transactions INTEGER DEFAULT 0,
  average_price DECIMAL(10,2) DEFAULT 0,
  top_gainers JSONB DEFAULT '[]',
  top_losers JSONB DEFAULT '[]',
  market_sentiment TEXT CHECK (market_sentiment IN ('bullish', 'bearish', 'neutral')),
  volatility_index DECIMAL(5,4) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date)
);

-- AI predictions table
CREATE TABLE public.ai_predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) NOT NULL,
  prediction_type TEXT CHECK (prediction_type IN ('price', 'sentiment', 'recommendation')) NOT NULL,
  timeframe TEXT NOT NULL,
  predicted_value DECIMAL(10,2),
  confidence DECIMAL(4,3) CHECK (confidence >= 0 AND confidence <= 1),
  factors JSONB DEFAULT '{}',
  model_version TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_type ON public.products(type);
CREATE INDEX idx_products_region ON public.products(region);
CREATE INDEX idx_products_producer ON public.products(producer);
CREATE INDEX idx_products_vintage ON public.products(vintage);
CREATE INDEX idx_products_current_price ON public.products(current_price);
CREATE INDEX idx_products_featured ON public.products(featured);
CREATE INDEX idx_products_search_vector ON public.products USING gin(search_vector);
CREATE INDEX idx_products_slug ON public.products(slug);

CREATE INDEX idx_order_book_product_id ON public.order_book_entries(product_id);
CREATE INDEX idx_order_book_user_id ON public.order_book_entries(user_id);
CREATE INDEX idx_order_book_status ON public.order_book_entries(status);
CREATE INDEX idx_order_book_price ON public.order_book_entries(price);

CREATE INDEX idx_price_history_product_id ON public.price_history(product_id);
CREATE INDEX idx_price_history_timestamp ON public.price_history(timestamp);

CREATE INDEX idx_transactions_product_id ON public.transactions(product_id);
CREATE INDEX idx_transactions_buyer_id ON public.transactions(buyer_id);
CREATE INDEX idx_transactions_seller_id ON public.transactions(seller_id);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at);

-- Create full-text search function
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', 
    COALESCE(NEW.name, '') || ' ' ||
    COALESCE(NEW.description, '') || ' ' ||
    COALESCE(NEW.producer, '') || ' ' ||
    COALESCE(NEW.region, '') || ' ' ||
    COALESCE(NEW.varietal, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for search vector updates
CREATE TRIGGER update_products_search_vector
  BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sellers_updated_at BEFORE UPDATE ON public.sellers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_order_book_entries_updated_at BEFORE UPDATE ON public.order_book_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON public.portfolios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_book_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Products are readable by everyone, but only sellers can modify their own
CREATE POLICY "Products are readable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Sellers can insert their own products" ON public.products FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.sellers WHERE user_id = auth.uid() AND id = seller_id)
);
CREATE POLICY "Sellers can update their own products" ON public.products FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.sellers WHERE user_id = auth.uid() AND id = seller_id)
);

-- Order book entries
CREATE POLICY "Users can read all order book entries" ON public.order_book_entries FOR SELECT USING (true);
CREATE POLICY "Users can insert their own orders" ON public.order_book_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own orders" ON public.order_book_entries FOR UPDATE USING (auth.uid() = user_id);

-- Transactions are readable by involved parties
CREATE POLICY "Users can read their transactions" ON public.transactions FOR SELECT USING (
  auth.uid() = buyer_id OR auth.uid() = seller_id
);

-- Reviews
CREATE POLICY "Reviews are readable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert their own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

-- Watchlists
CREATE POLICY "Users can manage their watchlists" ON public.watchlists FOR ALL USING (auth.uid() = user_id);

-- Portfolios
CREATE POLICY "Users can manage their portfolios" ON public.portfolios FOR ALL USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Create some initial data (optional)
INSERT INTO public.market_analytics (date, market_sentiment) VALUES (CURRENT_DATE, 'neutral') ON CONFLICT DO NOTHING; 