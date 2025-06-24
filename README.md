# 🍷 Wine & Spirits Market Trader

A **TTB Circular 2023-1 compliant** alcohol marketplace platform operating as a Third-Party Provider (TPP) under federal and California ABC guidelines. The platform facilitates transactions between licensed sellers and verified buyers without taking title to alcohol inventory.

## 🚀 Live Demo

**Production:** [Coming Soon - Vercel Deployment]  
**Development:** `cd wine-spirits-marketplace && npm run dev`

## 📋 Project Overview

### Compliance Framework
- **TTB Circular 2023-1** - Third-Party Provider regulations
- **California ABC** - State compliance guidelines  
- **Multi-State Shipping** - 50-state shipping matrix
- **Age Verification** - Adult signature delivery required
- **License Verification** - TTB permit validation

### Architecture
- **Frontend:** Next.js 15 + React 19 + TypeScript
- **Backend:** NestJS + TypeScript + PostgreSQL
- **Real-time:** WebSocket (Socket.io) 
- **Payments:** Stripe Connect (split payments)
- **Monorepo:** Nx workspace
- **UI:** Tailwind CSS + Radix UI

## 🎯 Phase 3: Marketplace Engine (COMPLETED)

### ✅ Order Book Service
- Real-time bid/ask matching with WebSocket
- Price-time priority algorithm
- Market depth visualization
- Order execution and status management
- Compliance validation (age verification, shipping states)

### ✅ Product Catalog Service  
- Comprehensive wine/spirits taxonomy
- Automatic SKU generation and normalization
- Product search with advanced filtering
- Duplicate detection and inventory management
- Image processing and storage ready

### ✅ Search & Discovery Service
- Full-text search across products
- Faceted filtering (price, region, vintage, rating)
- Recommendation engine
- Auto-complete suggestions
- Performance-optimized queries

## 🏗️ Installation & Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/[username]/wine-spirits-market-trader.git
cd wine-spirits-market-trader/wine-spirits-marketplace

# Install dependencies
npm install

# Set up environment variables
cp apps/backend/env.example apps/backend/.env
# Configure your database and API keys

# Start development servers
npm run dev
```

### Environment Configuration

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/wine_marketplace"

# JWT & Security
JWT_SECRET="your-jwt-secret"
API_RATE_LIMIT="100"

# Stripe Connect
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# File Upload
MAX_FILE_SIZE="5242880"
UPLOAD_DEST="./uploads"

# WebSocket
WEBSOCKET_PORT="3001"
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start all services
npm run dev:frontend     # Next.js frontend only  
npm run dev:backend      # NestJS backend only

# Building
npm run build           # Build all applications
npm run build:frontend  # Build frontend
npm run build:backend   # Build backend

# Testing
npm run test           # Run all tests
npm run test:e2e       # End-to-end tests
npm run lint           # Lint all code
```

### Project Structure

```
wine-spirits-marketplace/
├── apps/
│   └── backend/          # NestJS API server
│       ├── src/
│       │   ├── entities/           # Database entities
│       │   ├── modules/
│       │   │   ├── order-book/     # Real-time order matching
│       │   │   ├── product-catalog/# Wine/spirits taxonomy
│       │   │   └── search/         # Search & discovery
│       │   └── seeds/              # Sample data
│       └── package.json
├── src/                  # Next.js frontend
│   ├── app/              # App router pages
│   ├── components/       # React components
│   │   ├── marketplace/  # Core marketplace UI
│   │   └── ui/           # Reusable UI components
│   └── lib/              # Utilities
├── public/               # Static assets
└── package.json          # Root package.json
```

## 🎮 API Documentation

### Order Book API
```bash
POST   /api/order-book/orders     # Place bid/ask order
GET    /api/order-book/depth      # Market depth data
GET    /api/order-book/orders     # Order history
DELETE /api/order-book/orders/:id # Cancel order
```

### Product Catalog API  
```bash
GET    /api/products              # Search products
POST   /api/products              # Create product (sellers)
GET    /api/products/:id          # Product details
PUT    /api/products/:id          # Update product
GET    /api/products/taxonomy     # Wine/spirits taxonomy
```

### Search API
```bash
GET    /api/search                # Advanced product search
GET    /api/search/autocomplete   # Search suggestions  
GET    /api/search/recommendations # Personalized recommendations
```

### WebSocket Events
```javascript
// Real-time order book updates
socket.on('order-book-update', (data) => {
  // Handle market depth changes
});

socket.on('order-executed', (data) => {
  // Handle successful order execution
});
```

## 🔐 Compliance & Security

### TTB Circular 2023-1 Compliance
- ✅ No title transfer (TPP model)
- ✅ Split payment processing 
- ✅ Licensed seller verification
- ✅ Adult signature delivery
- ✅ State shipping restrictions
- ✅ Tax compliance integration

### Security Features
- JWT authentication
- Rate limiting (100 req/min)
- Input validation & sanitization
- CORS protection
- Environment variable security
- Secure WebSocket connections

## 🌍 Deployment

### Vercel Deployment (Recommended)

1. **Connect GitHub Repository:**
   ```bash
   # Push to GitHub (if not already done)
   git remote add origin https://github.com/[username]/wine-spirits-market-trader.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Import GitHub repository
   - Configure environment variables
   - Deploy!

3. **Environment Variables in Vercel:**
   ```
   DATABASE_URL
   JWT_SECRET
   STRIPE_SECRET_KEY
   STRIPE_WEBHOOK_SECRET
   ```

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📊 Monitoring & Analytics

- **Real-time Metrics:** Order execution rates, market depth
- **Performance:** API response times, WebSocket latency  
- **Compliance:** License verification rates, shipping validation
- **Business:** Transaction volume, seller onboarding

## 🚦 Phase 4: Next Steps

### Compliance & Identity Management
- [ ] Persona API integration for identity verification
- [ ] Automated license verification system
- [ ] Risk & fraud detection engine
- [ ] Enhanced compliance reporting

### Advanced Features
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-currency support
- [ ] International shipping

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚖️ Legal Disclaimer

This platform facilitates alcohol transactions in compliance with federal and state regulations. Users must:
- Maintain valid alcohol licenses
- Comply with local and state laws
- Verify buyer age and location
- Follow shipping restrictions

**Not legal advice. Consult alcohol beverage attorneys for compliance guidance.**

## 📞 Support

- **Documentation:** [GitHub Wiki](https://github.com/[username]/wine-spirits-market-trader/wiki)
- **Issues:** [GitHub Issues](https://github.com/[username]/wine-spirits-market-trader/issues)  
- **Discussions:** [GitHub Discussions](https://github.com/[username]/wine-spirits-market-trader/discussions)

---

**Built with ❤️ for the compliant alcohol marketplace industry** 