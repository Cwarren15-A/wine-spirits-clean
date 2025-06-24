'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AgeVerification } from '@/components/ui/AgeVerification';
import { Navigation } from '@/components/ui/Navigation';

export default function Home() {
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const renderHomeSection = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-wine-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-premium">
            Premium Wine & Spirits Marketplace
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Connect with licensed sellers and discover exceptional wines and spirits. 
            Experience transparent pricing, real-time trading, and full regulatory compliance.
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-6 mb-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              TTB Compliant
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              50-State Licensed
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Age Verified (21+)
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setActiveTab('collection')}
              className="btn-premium px-10 py-4 rounded-full text-lg font-semibold shadow-lg"
            >
              Browse Collection
            </button>
            
            <Link href="/admin">
              <button className="btn-gold px-6 py-4 rounded-full text-lg font-semibold shadow-lg">
                Admin Panel
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-premium mb-16">
            Why Choose Our Platform?
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="card-premium rounded-xl p-6 h-full">
              <div className="text-4xl mb-4">🍷</div>
              <h3 className="text-xl font-bold text-wine-800 mb-3">
                Curated Product Catalog
              </h3>
              <p className="text-slate-600 text-sm">
                Browse premium wines and spirits from verified, licensed sellers with detailed provenance.
              </p>
            </div>
            
            <div className="card-premium rounded-xl p-6 h-full">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-wine-800 mb-3">
                Real-Time Order Book
              </h3>
              <p className="text-slate-600 text-sm">
                Experience transparent trading with our advanced order matching system.
              </p>
            </div>
            
            <div className="card-premium rounded-xl p-6 h-full">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-wine-800 mb-3">
                Full Compliance
              </h3>
              <p className="text-slate-600 text-sm">
                Every transaction is fully compliant with TTB regulations and state laws.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderAboutSection = () => (
    <div className="min-h-screen bg-gradient-to-br from-wine-50 to-gold-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold text-center text-premium mb-16">
          About Premium Spirits
        </h1>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-wine-800 mb-6">Our Mission</h2>
            <p className="text-lg text-slate-700 mb-6">
              We&apos;re revolutionizing the way collectors, connoisseurs, and industry professionals 
              trade premium wines and spirits. Our platform ensures transparency, authenticity, 
              and full regulatory compliance for every transaction.
            </p>
            <p className="text-lg text-slate-700">
              Built on cutting-edge technology and deep industry expertise, we provide a secure 
              marketplace where quality meets trust.
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-9xl mb-6">🍷</div>
            <p className="text-xl text-wine-600 font-medium">
              Connecting collectors worldwide since 2024
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-wine-800 mb-3">Premium Quality</h3>
            <p className="text-slate-600">
              Every bottle is verified for authenticity and provenance by our expert team.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-wine-800 mb-3">Secure Trading</h3>
            <p className="text-slate-600">
              Advanced encryption and secure payment processing protect every transaction.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-bold text-wine-800 mb-3">Global Network</h3>
            <p className="text-slate-600">
              Connect with sellers and buyers from around the world in our trusted marketplace.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-wine-800 mb-8">Regulatory Compliance</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-wine-700 mb-4">🏛️ TTB Compliance</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Third-Party Provider (TPP) certification</li>
                <li>• Federal excise tax compliance</li>
                <li>• Interstate shipping regulations</li>
                <li>• Product label verification</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-wine-700 mb-4">📋 State Compliance</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• 50-state shipping matrix</li>
                <li>• Age verification (21+)</li>
                <li>• Adult signature delivery</li>
                <li>• State tax collection</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContactSection = () => (
    <div className="min-h-screen bg-gradient-to-br from-gold-50 to-wine-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold text-center text-premium mb-16">
          Contact Us
        </h1>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-wine-800 mb-8">Get In Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">📧</div>
                <div>
                  <h3 className="text-xl font-semibold text-wine-700 mb-2">Email</h3>
                  <p className="text-slate-600">support@premiumspirits.com</p>
                  <p className="text-slate-600">sales@premiumspirits.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="text-3xl">📞</div>
                <div>
                  <h3 className="text-xl font-semibold text-wine-700 mb-2">Phone</h3>
                  <p className="text-slate-600">+1 (555) 123-4567</p>
                  <p className="text-sm text-slate-500">Monday - Friday, 9 AM - 6 PM EST</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="text-3xl">🏢</div>
                <div>
                  <h3 className="text-xl font-semibold text-wine-700 mb-2">Address</h3>
                  <p className="text-slate-600">
                    123 Premium Way<br />
                    Collector&apos;s District<br />
                    San Francisco, CA 94105
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="text-3xl">🕒</div>
                <div>
                  <h3 className="text-xl font-semibold text-wine-700 mb-2">Business Hours</h3>
                  <p className="text-slate-600">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 4:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-wine-800 mb-6">Send us a Message</h3>
            
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-wine-200 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-wine-200 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                <select className="w-full px-4 py-3 border border-wine-200 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent">
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Seller Application</option>
                  <option>Partnership Opportunities</option>
                  <option>Compliance Questions</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-wine-200 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full btn-premium px-6 py-3 rounded-lg font-semibold"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCollectionSection = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-wine-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold text-center text-premium mb-16">
          Browse Our Collection
        </h1>
        
        <div className="text-center mb-12">
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Discover exceptional wines and spirits from verified sellers worldwide. 
            Our curated collection features investment-grade bottles with transparent pricing.
          </p>
          
          <Link href="/marketplace">
            <button className="btn-premium px-10 py-4 rounded-full text-lg font-semibold shadow-lg">
              Enter Marketplace
            </button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="card-premium rounded-xl p-6 text-center">
            <div className="text-6xl mb-4">🍷</div>
            <h3 className="text-xl font-bold text-wine-800 mb-3">Premium Wines</h3>
            <p className="text-slate-600 mb-4">
              Bordeaux, Burgundy, Champagne, and rare vintages from legendary producers.
            </p>
            <div className="text-sm text-slate-500">
              Price range: $150 - $75,000
            </div>
          </div>
          
          <div className="card-premium rounded-xl p-6 text-center">
            <div className="text-6xl mb-4">🥃</div>
            <h3 className="text-xl font-bold text-wine-800 mb-3">Rare Spirits</h3>
            <p className="text-slate-600 mb-4">
              Single malt whiskies, aged cognacs, and limited edition spirits.
            </p>
            <div className="text-sm text-slate-500">
              Price range: $135 - $135,000
            </div>
          </div>
          
          <div className="card-premium rounded-xl p-6 text-center">
            <div className="text-6xl mb-4">💎</div>
            <h3 className="text-xl font-bold text-wine-800 mb-3">Investment Grade</h3>
            <p className="text-slate-600 mb-4">
              Collectible bottles with proven track records and strong market performance.
            </p>
            <div className="text-sm text-slate-500">
              5-year returns: -15% to +180%
            </div>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-wine-800 mb-8">Featured Categories</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/marketplace?type=wine&region=france">
              <div className="text-center p-4 border border-wine-200 rounded-lg hover:bg-wine-50 transition-colors cursor-pointer">
                <div className="text-3xl mb-2">🇫🇷</div>
                <h4 className="font-semibold text-wine-700">French Wines</h4>
                <p className="text-sm text-slate-600">15 products</p>
              </div>
            </Link>
            
            <Link href="/marketplace?type=wine&varietal=champagne">
              <div className="text-center p-4 border border-wine-200 rounded-lg hover:bg-wine-50 transition-colors cursor-pointer">
                <div className="text-3xl mb-2">🥂</div>
                <h4 className="font-semibold text-wine-700">Champagne</h4>
                <p className="text-sm text-slate-600">8 products</p>
              </div>
            </Link>
            
            <Link href="/marketplace?type=spirits&region=scotland">
              <div className="text-center p-4 border border-wine-200 rounded-lg hover:bg-wine-50 transition-colors cursor-pointer">
                <div className="text-3xl mb-2">🏴󠁧󠁢󠁳󠁣󠁴󠁿</div>
                <h4 className="font-semibold text-wine-700">Scotch Whisky</h4>
                <p className="text-sm text-slate-600">10 products</p>
              </div>
            </Link>
            
            <Link href="/marketplace?type=spirits&varietal=cognac">
              <div className="text-center p-4 border border-wine-200 rounded-lg hover:bg-wine-50 transition-colors cursor-pointer">
                <div className="text-3xl mb-2">🍯</div>
                <h4 className="font-semibold text-wine-700">Cognac</h4>
                <p className="text-sm text-slate-600">4 products</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (activeTab) {
      case 'about':
        return renderAboutSection();
      case 'contact':
        return renderContactSection();
      case 'collection':
        return renderCollectionSection();
      default:
        return renderHomeSection();
    }
  };

  return (
    <>
      <AgeVerification onVerified={() => setIsAgeVerified(true)} />
      
      {isAgeVerified && (
        <div className="min-h-screen">
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
          {renderCurrentSection()}
        </div>
      )}
    </>
  );
}
