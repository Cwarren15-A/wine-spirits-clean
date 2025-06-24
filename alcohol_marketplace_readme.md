# Wine & Spirits Market Trader

A compliant alcohol marketplace platform that facilitates transactions between licensed sellers and verified buyers, never taking title to alcohol inventory.

## Project Overview

This platform operates as a neutral Third-Party Provider (TPP) under TTB Circular 2023-1 and California ABC guidelines, enabling licensed wineries, distilleries, and retailers to sell directly to consumers while maintaining full regulatory compliance.

### Key Compliance Features

- **No Title Transfer**: Marketplace never takes possession of alcohol inventory
- **Split-Payment Flow**: Seller receives funds first, marketplace fee deducted after
- **Age Verification**: KYC + ID verification for all buyers (21+)
- **Adult Signature Delivery**: Required for all shipments
- **50-State Compliance**: Real-time shipping eligibility checking
- **License Verification**: Automated seller permit validation

## Development Phases

### Phase 1: Product Discovery & Regulatory Blueprint
- [x] Compile 50-state shipping matrix from [Sovos 2025 DtC report](https://sovos.com/shipcompliant/content-library/wine-dtc-report/)
- [x] Summarize TTB Circular 2023-1 and CA ABC marketplace memo
- [x] Draft Terms of Service & Responsible-Seller Agreement benchmarked against eBay wine policy

### Phase 2: Tech Stack & Architecture
- [x] **Frontend:** Next.js 15 / React 19
- [x] **Backend:** NestJS microservices
- [x] **Database:** PostgreSQL + ClickHouse
- [x] **Payments:** Stripe Connect
- [x] Generate skeleton with `create-next-app`
- [x] Set up monorepo (Nx/Turborepo)
- [x] Build Tailwind + Radix UI kit

### Phase 3: Marketplace Engine
- [ ] **Order Book Service** (WebSocket-based)
  - [ ] Real-time bid/ask matching
  - [ ] Price-time priority algorithm
  - [ ] Market depth visualization
- [ ] **Product Catalog Service**
  - [ ] Wine/spirits taxonomy (varietal, region, vintage)
  - [ ] SKU normalization and de-duplication
  - [ ] Image processing and storage
- [ ] **Search & Discovery**
  - [ ] Elasticsearch integration
  - [ ] Faceted search (price, region, vintage, rating)
  - [ ] Recommendation engine

### Phase 4: Compliance & Identity
- [ ] **Age Verification Service**
  - [ ] Persona API integration for KYC
  - [ ] Government ID scanning and validation
  - [ ] SSN verification for high-value transactions
- [ ] **License Verification Service**
  - [ ] TTB permit OCR and validation
  - [ ] State license cross-checking
  - [ ] Automated compliance scoring
- [ ] **Risk & Fraud Detection**
  - [ ] Behavioral analytics
  - [ ] Geolocation validation
  - [ ] Transaction monitoring

### Phase 5: Logistics & Fulfillment
- [ ] **Shipping Service**
  - [ ] UPS/FedEx alcohol program integration
  - [ ] Adult signature requirement enforcement
  - [ ] Real-time tracking and notifications
- [ ] **Tax Service**
  - [ ] Automated excise tax calculation
  - [ ] Sales tax by jurisdiction
  - [ ] Quarterly compliance reporting
- [ ] **Inventory Management**
  - [ ] Real-time stock levels
  - [ ] Allocation and reservation system
  - [ ] Seller dashboard and analytics

### Phase 6: Advanced Trading Features
- [ ] **Options & Futures**
  - [ ] Pre-arrival wine trading
  - [ ] Warehouse receipt tokenization
  - [ ] Settlement and delivery coordination
- [ ] **Auction Platform**
  - [ ] Timed auction engine
  - [ ] Bidding strategies and automation
  - [ ] Authentication and provenance tracking
- [ ] **Portfolio Management**
  - [ ] Collection tracking and valuation
  - [ ] Insurance integration
  - [ ] Exit liquidity tools

### Phase 7: Analytics & Intelligence
- [ ] **Market Data Service**
  - [ ] Real-time pricing indices
  - [ ] Historical trend analysis
  - [ ] Volatility and liquidity metrics
- [ ] **Business Intelligence**
  - [ ] Seller performance dashboards
  - [ ] Buyer behavior analytics
  - [ ] Market microstructure analysis
- [ ] **API & Data Products**
  - [ ] RESTful API for third-party integration
  - [ ] Real-time data feeds
  - [ ] White-label marketplace solutions

## Technical Architecture

### Microservices Design
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Auth Service  │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│   (JWT + OAuth) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
        ┌───────▼──────┐ ┌────▼────┐ ┌─────▼─────┐
        │ Order Book   │ │Product  │ │ Payment   │
        │ Service      │ │Catalog  │ │ Service   │
        │ (WebSocket)  │ │Service  │ │ (Stripe)  │
        └──────────────┘ └─────────┘ └───────────┘
                │             │             │
        ┌───────▼──────┐ ┌────▼────┐ ┌─────▼─────┐
        │ PostgreSQL   │ │Elasticsearch│ │ClickHouse│
        │ (OLTP)       │ │ (Search)│ │ (Analytics)│
        └──────────────┘ └─────────┘ └───────────┘
```

### Database Strategy

**PostgreSQL** (Primary OLTP)
- User accounts and KYC data
- Product catalog and inventory
- Orders and transactions
- Shipping and logistics

**ClickHouse** (Analytics OLAP)
- Order book events and market data
- User behavior and engagement metrics
- Business intelligence and reporting
- Real-time dashboards

**Elasticsearch** (Search & Discovery)
- Product search and filtering
- Auto-complete and suggestions
- Faceted navigation
- Content indexing

### Security & Compliance

**Data Protection**
- End-to-end encryption for PII
- GDPR/CCPA compliance framework
- Regular security audits and penetration testing
- SOC 2 Type II certification path

**Regulatory Compliance**
- TTB reporting and record-keeping
- State-by-state compliance monitoring
- Automated license validation
- Anti-money laundering (AML) checks

## Market Opportunity

### Total Addressable Market (TAM)
- US wine market: $70B annually
- Spirits market: $90B annually
- Direct-to-consumer segment: $3.5B (growing 15% YoY)

### Business Model
- **Transaction Fees**: 3-5% of gross merchandise value
- **Subscription Tiers**: Premium seller tools and analytics
- **Data Products**: Market intelligence and API access
- **White-Label Solutions**: B2B marketplace licensing

### Competitive Landscape
- **Traditional**: eBay (limited alcohol), Wine.com (retail)
- **B2B**: SevenFifty, LibDib, Provi
- **Direct**: Vivino (reviews + marketplace), WineBid (auctions)
- **Opportunity**: No compliant P2P trading platform exists

## Go-to-Market Strategy

### Phase 1: Seller Onboarding (Months 1-6)
- Target 50 licensed sellers across CA, NY, WA
- Focus on boutique wineries and craft distilleries
- Provide free onboarding and compliance consulting

### Phase 2: Buyer Acquisition (Months 6-12)
- Launch with 500+ SKUs and competitive pricing
- Content marketing and wine education
- Influencer partnerships and tastings

### Phase 3: Market Expansion (Year 2)
- Add 25+ states with favorable DtC laws
- Introduce auction and futures trading
- Launch mobile apps and API platform

## Funding Requirements

### Seed Round ($2M)
- Team hiring (10 engineers + compliance)
- Initial product development (Phases 1-3)
- Legal and regulatory setup

### Series A ($10M)
- Market expansion and scale
- Advanced trading features (Phases 4-6)
- Sales and marketing acceleration

### Series B ($25M)
- National expansion (all 50 states)
- International market entry
- M&A and strategic partnerships

## Team & Hiring Plan

### Core Team (6-12 months)
- **CTO**: Platform architecture and technical leadership
- **CPO**: Product strategy and user experience
- **Head of Compliance**: Regulatory expertise and risk management
- **Engineering Manager**: Team leadership and delivery
- **Senior Engineers**: (4x) Full-stack, DevOps, data

### Expanded Team (12-24 months)
- **VP of Sales**: Seller acquisition and relationships
- **Head of Marketing**: Brand building and customer acquisition
- **Data Scientists**: (2x) Analytics and machine learning
- **QA Engineers**: (2x) Testing and quality assurance
- **Customer Success**: Support and seller services

## Success Metrics

### Product KPIs
- Monthly Active Sellers: 100+ by Month 12
- Monthly Active Buyers: 1,000+ by Month 12
- Gross Merchandise Value: $1M+ by Month 18
- Take Rate: 4% average across all transactions

### Financial KPIs
- Monthly Recurring Revenue: $50K+ by Month 18
- Customer Acquisition Cost: <$100 for buyers, <$500 for sellers
- Lifetime Value: >$1,000 for buyers, >$5,000 for sellers
- Unit Economics: Positive contribution margin by Month 12

### Compliance KPIs
- Zero regulatory violations or fines
- 100% age verification compliance
- <0.1% fraudulent transactions
- 99.9% uptime for compliance systems

---

**Current Status**: Phase 2 Complete ✅  
**Next Milestone**: Phase 3 - Marketplace Engine Development  
**Timeline**: 6-month development cycle per phase  
**Investment**: Seeking seed funding for Phases 3-5
