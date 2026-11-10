const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '1.8',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
};

export function IconeSinal({ className = 'h-4 w-4' }) {
  return (
    <svg {...base} className={className}>
      <path d="M5 16.5a8 8 0 0 1 14 0" />
      <path d="M8 13.2a4.5 4.5 0 0 1 8 0" />
      <path d="M12 20v-3" />
      <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconeLocal({ className = 'h-4 w-4' }) {
  return (
    <svg {...base} className={className}>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}

export function IconePlay({ className = 'h-4 w-4' }) {
  return (
    <svg {...base} className={className} fill="currentColor" stroke="none">
      <path d="M9 7.5v9l8-4.5-8-4.5z" />
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function IconeNoticias({ className = 'h-6 w-6' }) {
  return (
    <svg {...base} className={className}>
      <path d="M5 5.5h11a2 2 0 0 1 2 2V19H7.5A2.5 2.5 0 0 1 5 16.5v-11z" />
      <path d="M8 9h7M8 12.5h7M8 16h4" />
    </svg>
  );
}

export function IconeGrade({ className = 'h-6 w-6' }) {
  return (
    <svg {...base} className={className}>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3.5v3M16 3.5v3M4 9.5h16" />
    </svg>
  );
}

export function IconeAoVivo({ className = 'h-6 w-6' }) {
  return (
    <svg {...base} className={className} fill="currentColor" stroke="none">
      <path d="M10 8.2v7.6l6.4-3.8L10 8.2z" />
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
