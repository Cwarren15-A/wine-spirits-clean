'use client';

import React from 'react';
import Link from 'next/link';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'collection', label: 'Collection', icon: '🍷' },
    { id: 'about', label: 'About', icon: 'ℹ️' },
    { id: 'contact', label: 'Contact', icon: '📞' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-wine-200 z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-2xl">🍷</div>
            <span className="text-xl font-bold text-wine-800">Premium Spirits</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-wine-100 text-wine-700'
                    : 'text-slate-600 hover:text-wine-600 hover:bg-wine-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/marketplace">
              <button className="hidden sm:block bg-wine-600 hover:bg-wine-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                Marketplace
              </button>
            </Link>
            
            <Link href="/admin">
              <button className="bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                Admin
              </button>
            </Link>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-wine-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-wine-200">
          <div className="py-2 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-wine-100 text-wine-700'
                    : 'text-slate-600 hover:text-wine-600 hover:bg-wine-50'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </button>
            ))}
            
            <div className="pt-2 border-t border-wine-100">
              <Link href="/marketplace">
                <button className="w-full bg-wine-600 hover:bg-wine-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors">
                  Enter Marketplace
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
