import { Link } from 'react-router-dom';

export default function LogoPossi() {
  return (
    <Link
      to="/"
      aria-label="TV Possi 16.1, página inicial"
      className="group flex shrink-0 items-center rounded-possi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <img
        src="/logo-tv-possi-header.png"
        alt=""
        width="191"
        height="168"
        decoding="async"
        className="h-12 w-auto object-contain motion-safe:transition-transform motion-safe:duration-state-change motion-safe:ease-state-change motion-safe:group-hover:scale-105 md:h-14"
      />
    </Link>
  );
}
