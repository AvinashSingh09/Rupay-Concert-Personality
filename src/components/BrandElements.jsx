import React from 'react';
import rupayLogo from '../assets/rupay-on.png';

/**
 * Toggles browser Fullscreen mode (hides Chrome URL bar & browser navigation chrome)
 */
export async function toggleFullscreen() {
  try {
    const doc = document;
    const elem = doc.documentElement;
    const isFullscreen =
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement;

    if (!isFullscreen) {
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      }
    } else {
      if (doc.exitFullscreen) {
        await doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) {
        await doc.msExitFullscreen();
      }
    }
  } catch (err) {
    console.warn('Fullscreen toggle failed:', err);
  }
}

/**
 * RuPay + "Own the edge" header logo lockup — acts as a button to toggle Fullscreen mode
 */
export function RuPayHeaderLogo({ compact = false, className = '' }) {
  return (
    <button
      type="button"
      onClick={toggleFullscreen}
      aria-label="Toggle Fullscreen Mode"
      title="Tap to toggle fullscreen"
      className={`inline-flex items-center justify-center bg-transparent border-0 p-0 cursor-pointer transition-transform active:scale-95 focus:outline-none ${className}`}
    >
      <img
        src={rupayLogo}
        alt="RuPay — Own the edge"
        width={640}
        height={275}
        className={`h-auto select-none pointer-events-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] ${
          compact
            ? 'w-[clamp(112px,24vw,220px)]'
            : 'w-[clamp(128px,28vw,260px)]'
        }`}
      />
    </button>
  );
}

/**
 * RuPay logo watermark on the generated photo (Screen 4)
 */
export function RuPayPhotoWatermark() {
  return (
    <div className="absolute inset-x-0 top-0 p-3 sm:p-4 flex justify-end pointer-events-none bg-gradient-to-b from-black/55 via-black/20 to-transparent">
      <img
        src={rupayLogo}
        alt=""
        width={640}
        height={275}
        className="w-[24%] h-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
      />
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
      className={`w-[clamp(28px,5vw,56px)] h-auto animate-sparkle pointer-events-none ${className}`}
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
    <div className={`relative flex flex-col items-center select-none ${compact ? 'my-1' : 'my-[1.2vh]'}`}>
      {/* Top line: sparkles + CONCERT */}
      <div className="relative flex items-center justify-center">
        <SparklePair
          className={`absolute ${
            compact ? '-left-[12%] -top-[14%] scale-90' : '-left-[13%] -top-[14%]'
          }`}
        />
        <span
          className={`font-brush uppercase tracking-wider text-gradient-concert leading-[1.05] -rotate-1 ${
            compact
              ? 'text-[clamp(30px,6.4vw,64px)]'
              : 'text-[clamp(36px,7.6vw,78px)]'
          }`}
        >
          CONCERT
        </span>
      </div>

      {/* Second line: PERSONALITY + sparkles */}
      <div className="relative flex items-center justify-center -mt-1">
        <span
          className={`font-brush uppercase tracking-wide text-gradient-personality leading-[1.08] -rotate-1 ${
            compact
              ? 'text-[clamp(29px,6.1vw,62px)]'
              : 'text-[clamp(34px,7.2vw,74px)]'
          }`}
        >
          PERSONALITY
        </span>
        <SparklePair
          className={`absolute ${
            compact ? '-right-[11%] -bottom-[16%] scale-90' : '-right-[11%] -bottom-[16%]'
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
      className="w-[clamp(38px,6.5vw,64px)] h-[clamp(38px,6.5vw,64px)] rounded-full flex items-center justify-center bg-[#1e0f42]/80 border border-purple-400/60 text-purple-200 hover:text-white hover:border-pink-400 hover:bg-[#2c165e] transition-all active:scale-95 disabled:opacity-40 shadow-md"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-[42%] h-[42%]"
      >
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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[clamp(22px,4.2vw,42px)] h-[clamp(22px,4.2vw,42px)] text-purple-100">
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c0-3.8 3.1-6.5 7-6.5s7 2.7 7 6.5" />
    </svg>
  ),
  Selfie: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[clamp(22px,4.2vw,42px)] h-[clamp(22px,4.2vw,42px)] text-purple-100">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  ),
  Wand: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[clamp(22px,4.2vw,42px)] h-[clamp(22px,4.2vw,42px)] text-purple-100">
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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[clamp(22px,4.2vw,42px)] h-[clamp(22px,4.2vw,42px)] text-purple-100">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="1.6" />
      <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
    </svg>
  ),
};
