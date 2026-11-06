import React from 'react';

/**
 * RuPay + "Own the edge" header logo lockup matching Screen 1 and Screen 4
 */
export function RuPayHeaderLogo({ compact = false }) {
  return (
    <div className={`flex flex-col items-center select-none ${compact ? 'scale-95' : ''}`}>
      {/* RuPay wordmark + orange/green chevron */}
      <div className="inline-flex items-center gap-0.5 leading-none">
        <span className="font-sans italic font-black tracking-tight text-white text-[18px] sm:text-[21px] drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
          RuPay
        </span>
        <svg
          width="15"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="-ml-0.5 translate-y-[0.5px]"
          aria-hidden="true"
        >
          <polygon points="2,1 11,8 0,15" fill="#FF7722" />
          <polygon points="7,3 15,9 5,15" fill="#18A558" />
        </svg>
      </div>

      {/* "Own the edge" lockup */}
      <div className="flex items-baseline -mt-1 leading-none">
        <span className="font-sans italic font-extrabold text-white text-[20px] sm:text-[23px] tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
          Own the
        </span>
        <span className="font-script text-white text-[28px] sm:text-[33px] ml-1.5 -rotate-3 translate-y-[2px] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          edge
        </span>
      </div>
    </div>
  );
}

/**
 * Inline RuPay mark for top-right watermark on the generated photo (Screen 4)
 */
export function RuPayPhotoWatermark() {
  return (
    <div className="absolute inset-x-0 top-0 p-3 sm:p-4 flex items-start justify-between pointer-events-none bg-gradient-to-b from-black/55 via-black/20 to-transparent">
      {/* Top-Left: Own the edge */}
      <div className="flex items-baseline leading-none drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
        <span className="font-sans italic font-extrabold text-white text-[12px] sm:text-[13px] tracking-tight">
          Own the
        </span>
        <span className="font-script text-white text-[16px] sm:text-[18px] ml-1 translate-y-[1px]">
          edge
        </span>
      </div>

      {/* Top-Right: RuPay */}
      <div className="inline-flex items-center gap-0.5 leading-none drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
        <span className="font-sans italic font-black tracking-tight text-white text-[13px] sm:text-[14px]">
          RuPay
        </span>
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <polygon points="2,1 11,8 0,15" fill="#FF7722" />
          <polygon points="7,3 15,9 5,15" fill="#18A558" />
        </svg>
      </div>
    </div>
  );
}

/**
 * 4-point outline sparkle stars matching the top-left and bottom-right of CONCERT PERSONALITY
 */
export function SparklePair({ className = '' }) {
  return (
    <svg
      width="34"
      height="28"
      viewBox="0 0 36 28"
      fill="none"
      className={`animate-sparkle pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <path
        d="M12 2C12.7 7.3 14.7 9.3 20 10C14.7 10.7 12.7 12.7 12 18C11.3 12.7 9.3 10.7 4 10C9.3 9.3 11.3 7.3 12 2Z"
        stroke="rgba(224, 236, 255, 0.9)"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M26 9C26.5 12.6 27.9 14 31.5 14.5C27.9 15 26.5 16.4 26 20C25.5 16.4 24.1 15 20.5 14.5C24.1 14 25.5 12.6 26 9Z"
        stroke="rgba(224, 236, 255, 0.85)"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Hero "CONCERT PERSONALITY" brush title lockup with sparkles
 */
export function ConcertPersonalityTitle({ compact = false }) {
  return (
    <div className={`relative flex flex-col items-center select-none ${compact ? 'my-1' : 'my-2.5'}`}>
      {/* Top line: sparkles + CONCERT */}
      <div className="relative flex items-center justify-center">
        <SparklePair
          className={`absolute ${
            compact ? '-left-8 -top-1.5 scale-90' : '-left-9 -top-2 sm:-left-10'
          }`}
        />
        <span
          className={`font-brush uppercase tracking-wider text-gradient-concert leading-[1.05] -rotate-1 ${
            compact ? 'text-[30px] sm:text-[35px]' : 'text-[36px] sm:text-[42px]'
          }`}
        >
          CONCERT
        </span>
      </div>

      {/* Second line: PERSONALITY + sparkles */}
      <div className="relative flex items-center justify-center -mt-1">
        <span
          className={`font-brush uppercase tracking-wide text-gradient-personality leading-[1.08] -rotate-1 ${
            compact ? 'text-[29px] sm:text-[34px]' : 'text-[34px] sm:text-[40px]'
          }`}
        >
          PERSONALITY
        </span>
        <SparklePair
          className={`absolute ${
            compact ? '-right-8 -bottom-2 scale-90' : '-right-8 -bottom-2.5 sm:-right-9'
          }`}
        />
      </div>
    </div>
  );
}

/**
 * Circular top-left back button (<) matching Screen 2 and Screen 3
 */
export function BackButton({ onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Go back"
      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-[#1e0f42]/80 border border-purple-400/60 text-purple-200 hover:text-white hover:border-pink-400 hover:bg-[#2c165e] transition-all active:scale-95 disabled:opacity-40 shadow-md"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
  );
}

/**
 * 4-Step explainer icons matching Screen 1's bottom grid box
 */
export const StepIcons = {
  Personality: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-purple-100">
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c0-3.8 3.1-6.5 7-6.5s7 2.7 7 6.5" />
    </svg>
  ),
  Selfie: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-purple-100">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  ),
  Wand: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-purple-100">
      <path d="M15 4V2" />
      <path d="M15 16v-2" />
      <path d="M8 9h2" />
      <path d="M20 9h2" />
      <path d="M17.8 11.8 19 13" />
      <path d="M15 9h.01" />
      <path d="M17.8 6.2 19 5" />
      <path d="m3 21 9-9" />
      <path d="M12.2 6.2 11 5" />
    </svg>
  ),
  Share: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-purple-100">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="1.6" />
      <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
    </svg>
  ),
};
