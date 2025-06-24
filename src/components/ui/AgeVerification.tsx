'use client';

import React, { useState, useEffect } from 'react';

interface AgeVerificationProps {
  onVerified: () => void;
}

export function AgeVerification({ onVerified }: AgeVerificationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [birthYear, setBirthYear] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user has already verified their age in this session
    const isVerified = sessionStorage.getItem('ageVerified');
    if (isVerified === 'true') {
      onVerified();
    } else {
      setIsOpen(true);
    }
  }, [onVerified]);

  const handleVerification = () => {
    setError('');
    
    if (!birthYear) {
      setError('Please enter your birth year');
      return;
    }
    
    const currentYear = new Date().getFullYear();
    const age = currentYear - parseInt(birthYear);
    
    if (age < 21) {
      setError('You must be 21 or older to access this site');
      return;
    }
    
    if (age > 120) {
      setError('Please enter a valid birth year');
      return;
    }
    
    // Store verification in session storage
    sessionStorage.setItem('ageVerified', 'true');
    setIsOpen(false);
    onVerified();
  };

  const handleDecline = () => {
    // Redirect to a general information page or external site
    window.location.href = 'https://www.ttb.gov/';
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">��</div>
          <h2 className="text-2xl font-bold text-wine-800 mb-2">
            Age Verification Required
          </h2>
          <p className="text-slate-600 text-sm">
            You must be 21 or older to access this marketplace
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Birth Year
            </label>
            <input
              type="number"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              placeholder="YYYY"
              min="1900"
              max={new Date().getFullYear()}
              className="w-full px-4 py-3 border border-wine-200 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent text-center text-lg"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleVerification}
              className="w-full bg-wine-600 hover:bg-wine-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              I am 21 or older
            </button>
            
            <button
              onClick={handleDecline}
              className="w-full border border-wine-200 hover:bg-wine-50 text-wine-600 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              I am under 21
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            By accessing this site, you certify that you are of legal drinking age 
            in your jurisdiction and agree to our terms of service.
          </p>
        </div>
      </div>
    </div>
  );
}
