// client/src/components/KawaiiMascot.tsx
export default function KawaiiMascot({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 150"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Dahon mascot"
      role="img"
    >
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff3cac" />
          <stop offset="0.5" stopColor="#9b5cff" />
          <stop offset="1" stopColor="#00d4ff" />
        </linearGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* glow */}
      <ellipse cx="100" cy="120" rx="70" ry="14" fill="url(#g1)" opacity="0.15" filter="url(#soft)" />

      {/* pot */}
      <g>
        <rect x="45" y="70" width="110" height="60" rx="16" fill="url(#g1)" opacity="0.9" />
        <rect x="35" y="62" width="130" height="18" rx="9" fill="#ffffff" opacity="0.65" />
      </g>

      {/* leaves */}
      <g>
        <path d="M100 60 C 80 35, 76 18, 105 10 C 120 22, 112 45, 100 60 Z" fill="#34d399" />
        <path d="M120 60 C 140 38, 150 18, 128 12 C 110 20, 110 45, 120 60 Z" fill="#10b981" />
        <path d="M84 60 C 66 42, 56 28, 72 20 C 90 28, 88 46, 84 60 Z" fill="#22c55e" />
      </g>

      {/* face */}
      <circle cx="80" cy="100" r="6" fill="#1e2329" />
      <circle cx="120" cy="100" r="6" fill="#1e2329" />
      <path d="M88 112 C 95 118, 105 118, 112 112" fill="none" stroke="#1e2329" strokeWidth="4" strokeLinecap="round" />
      <circle cx="68" cy="106" r="4" fill="#fb7185" opacity="0.85" />
      <circle cx="132" cy="106" r="4" fill="#fb7185" opacity="0.85" />
    </svg>
  )
}
