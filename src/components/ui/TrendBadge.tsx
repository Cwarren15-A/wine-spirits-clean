'use client';

import React from 'react';

interface TrendBadgeProps {
  pct: number;
  size?: 'sm' | 'md' | 'lg';
  showArrow?: boolean;
  className?: string;
}

export function TrendBadge({ 
  pct, 
  size = 'md', 
  showArrow = true, 
  className = '' 
}: TrendBadgeProps) {
  const isPositive = pct >= 0;
  const isFlat = Math.abs(pct) < 0.01;
  
  let colorClasses = '';
  if (isFlat) {
    colorClasses = 'bg-gray-100 text-gray-700 border-gray-200';
  } else if (isPositive) {
    colorClasses = 'bg-green-100 text-green-800 border-green-200';
  } else {
    colorClasses = 'bg-red-100 text-red-800 border-red-200';
  }
  
  let sizeClasses = '';
  let textSize = '';
  let iconSize = '';
  
  switch (size) {
    case 'sm':
      sizeClasses = 'px-2 py-1';
      textSize = 'text-xs';
      iconSize = 'text-xs';
      break;
    case 'lg':
      sizeClasses = 'px-4 py-2';
      textSize = 'text-base';
      iconSize = 'text-sm';
      break;
    default:
      sizeClasses = 'px-3 py-1.5';
      textSize = 'text-sm';
      iconSize = 'text-xs';
      break;
  }
  
  let icon = '';
  if (showArrow && !isFlat) {
    icon = isPositive ? '↗' : '↘';
  } else if (isFlat) {
    icon = '→';
  }
  
  const formattedPct = formatPercentage(pct);
  
  return (
    <span className={`
      inline-flex items-center gap-1 rounded-full font-semibold border
      ${sizeClasses} ${colorClasses} ${textSize} ${className}
    `}>
      {showArrow && <span className={iconSize}>{icon}</span>}
      {formattedPct}
    </span>
  );
}

function formatPercentage(pct: number): string {
  const sign = pct >= 0 ? '+' : '';
  
  if (Math.abs(pct) >= 1000) {
    return `${sign}${(pct / 1000).toFixed(1)}k%`;
  } else if (Math.abs(pct) >= 100) {
    return `${sign}${pct.toFixed(0)}%`;
  } else if (Math.abs(pct) >= 10) {
    return `${sign}${pct.toFixed(1)}%`;
  } else {
    return `${sign}${pct.toFixed(2)}%`;
  }
}
