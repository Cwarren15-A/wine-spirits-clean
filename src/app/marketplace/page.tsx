import React, { Suspense } from 'react';
import { MarketplaceClient } from './marketplace-client';

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-wine-50">
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-wine-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🍷</div>
            <div className="text-xl text-slate-600">Loading marketplace...</div>
          </div>
        </div>
      }>
        <MarketplaceClient />
      </Suspense>
    </div>
  );
} 