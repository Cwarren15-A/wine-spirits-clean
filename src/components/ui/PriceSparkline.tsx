'use client';

import React from 'react';

interface PriceSparklineProps {
  data: number[];
  className?: string;
  width?: number;
  height?: number;
  color?: string;
  fillColor?: string;
}

export function PriceSparkline({ 
  data, 
  className = '',
  width = 200,
  height = 60,
  color = '#dc2626',
  fillColor = 'rgba(220, 38, 38, 0.1)'
}: PriceSparklineProps) {
  if (!data || data.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
        <span className="text-gray-400 text-sm">No data</span>
      </div>
    );
  }

  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue;
  
  if (range === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
        <svg width={width} height={height} className="w-full h-full">
          <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke={color} strokeWidth="2" />
        </svg>
      </div>
    );
  }

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - minValue) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;
  const isPositive = data[data.length - 1] >= data[0];
  const trendColor = isPositive ? '#059669' : '#dc2626';
  const trendFillColor = isPositive ? 'rgba(5, 150, 105, 0.1)' : 'rgba(220, 38, 38, 0.1)';

  return (
    <div className={`${className}`} style={{ width, height }}>
      <svg width={width} height={height} className="w-full h-full">
        <polygon points={areaPoints} fill={fillColor || trendFillColor} strokeWidth="0" />
        <polyline points={points} fill="none" stroke={color || trendColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle
          cx={((data.length - 1) / (data.length - 1)) * width}
          cy={height - ((data[data.length - 1] - minValue) / range) * height}
          r="3" fill={color || trendColor} stroke="white" strokeWidth="2"
        />
      </svg>
    </div>
  );
}
