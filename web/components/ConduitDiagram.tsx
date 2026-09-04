/**
 * Spectral conduit — the brand diagram: client → Bifrost → tool fan-out.
 * The trunk + fan strokes are the ONLY full-spectrum elements on the page
 * (see scratch/bifrost/brand-spec.md). Server-rendered, aria-hidden, zero JS:
 * shimmer = CSS stroke-dashoffset, traffic dots = SVG <animateMotion>.
 */
export default function ConduitDiagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="conduit"
      viewBox="0 0 1000 180"
      fill="none"
      role="presentation"
      aria-hidden="true"
      // decorative diagram; visible tab order must skip it
      focusable="false"
      {...props}
    >
      <defs>
        <linearGradient id="conduit-spectral" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7c5cff" />
          <stop offset="0.25" stopColor="#4f9dff" />
          <stop offset="0.5" stopColor="#46e6d0" />
          <stop offset="0.75" stopColor="#ffd27a" />
          <stop offset="1" stopColor="#ff7ac8" />
        </linearGradient>
        <path id="conduit-in" d="M92 70 H 452" />
        <path id="conduit-trunk" d="M548 70 H 620 C 660 70 660 24 700 24 H 892" />
        <path id="conduit-mid" d="M548 70 H 892" />
        <path id="conduit-low" d="M548 70 H 620 C 660 70 660 128 700 128 H 892" />
      </defs>

      {/* base monochrome strokes — always visible, motion or not */}
      <use href="#conduit-in" className="conduit-base" stroke="var(--border)" strokeWidth="1" />
      <use href="#conduit-trunk" stroke="var(--border)" strokeWidth="1" />
      <use href="#conduit-mid" stroke="var(--border)" strokeWidth="1" />
      <use href="#conduit-low" stroke="var(--border)" strokeWidth="1" />

      {/* spectral shimmer overlay — light running along the road */}
      <use href="#conduit-in" className="shimmer" stroke="url(#conduit-spectral)" strokeWidth="1.4" />
      <use href="#conduit-trunk" className="shimmer" stroke="url(#conduit-spectral)" strokeWidth="1.4" />
      <use href="#conduit-mid" className="shimmer" stroke="url(#conduit-spectral)" strokeWidth="1.4" />
      <use href="#conduit-low" className="shimmer" stroke="url(#conduit-spectral)" strokeWidth="1.4" />

      {/* request dots riding the paths — staggered so it reads as traffic, not a screensaver */}
      <circle className="conduit-dot" r="2.5" fill="#9fd6ff">
        <animateMotion dur="3.2s" begin="0s" repeatCount="indefinite">
          <mpath href="#conduit-in" />
        </animateMotion>
      </circle>
      <circle className="conduit-dot" r="2.5" fill="#46e6d0">
        <animateMotion dur="4.1s" begin="1.3s" repeatCount="indefinite">
          <mpath href="#conduit-mid" />
        </animateMotion>
      </circle>
      <circle className="conduit-dot" r="2.5" fill="#ffd27a">
        <animateMotion dur="5s" begin="2.6s" repeatCount="indefinite">
          <mpath href="#conduit-trunk" />
        </animateMotion>
      </circle>
      <circle className="conduit-dot" r="2.5" fill="#ff7ac8">
        <animateMotion dur="4.6s" begin="3.4s" repeatCount="indefinite">
          <mpath href="#conduit-low" />
        </animateMotion>
      </circle>

      {/* nodes */}
      <g fontFamily="var(--font-mono, monospace)" fontSize="10" letterSpacing="0.08em">
        <circle cx="60" cy="70" r="26" stroke="var(--border-hi)" strokeWidth="1" fill="var(--surface)" />
        <text x="60" y="74" textAnchor="middle" fill="var(--fg)">CLIENT</text>

        <circle cx="500" cy="70" r="32" stroke="var(--accent)" strokeWidth="1" fill="var(--surface-2)" />
        <text x="500" y="74" textAnchor="middle" fill="var(--accent)" fontWeight="600">BIFROST</text>

        {/* tool endpoints as labeled pills — label lives inside its node */}
        <g stroke="var(--border-hi)" strokeWidth="1" fill="var(--surface)">
          <rect x="892" y="10" width="84" height="28" rx="14" />
          <rect x="892" y="62" width="84" height="28" rx="14" />
          <rect x="892" y="114" width="84" height="28" rx="14" />
        </g>
        <text x="934" y="28" textAnchor="middle" fill="var(--muted)">github</text>
        <text x="934" y="80" textAnchor="middle" fill="var(--muted)">postgres</text>
        <text x="934" y="132" textAnchor="middle" fill="var(--muted)">+ n</text>
      </g>
    </svg>
  );
}