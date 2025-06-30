'use client';

export default function WaveBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute bottom-0 left-0 w-full h-32 text-sky-100/20"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z"
          fill="currentColor"
        />
      </svg>
      <svg
        className="absolute bottom-0 left-0 w-full h-24 text-cyan-100/30 transform translate-y-2"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,80 C300,140 600,20 900,80 C1050,120 1150,40 1200,80 L1200,120 L0,120 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}