'use client';

import React from 'react';

// ============================================================================
// SharpMoney Branding Watermark for Tool Pages
// ============================================================================
// Subtle branding that shows up in screenshots.
// Includes the logo image and "SharpMoney" text.
// ============================================================================

interface ToolBrandingProps {
  className?: string;
}

export default function ToolBranding({ className = '' }: ToolBrandingProps) {
  return (
    <div className={`flex items-center justify-center gap-2 py-4 opacity-60 ${className}`}>
      <img
        src="/sharpmoney-logo.png"
        alt="SharpMoney"
        className="w-5 h-5 object-contain"
      />
      <span
        className="text-xs font-semibold tracking-widest text-cyan-400 uppercase"
        style={{ fontFamily: 'Russo One, sans-serif' }}
      >
        SharpMoney
      </span>
    </div>
  );
}
