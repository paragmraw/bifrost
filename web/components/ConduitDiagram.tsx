/**
 * Spectral conduit — the brand diagram: client → Bifrost → tool fan-out.
 * The trunk + fan strokes are the ONLY full-spectrum elements on the page
 * (see scratch/bifrost/brand-spec.md). Server-rendered, aria-hidden, zero JS:
 * shimmer = CSS stroke-dashoffset, traffic dots = SVG <animateMotion>.
 *
 * Nodes carry official marks, not names: GitHub / Atlassian / Databricks marks
 * sit in the endpoint pills (components/BrandMarks.tsx), and the gateway node
 * hosts the official Bifrost wordmark (/logo-light.webp — ice-white dark-theme
 * variant). The gateway node is a pill rather than a circle so the 4.75:1
 * wordmark fits at a readable size.
 */
import { AtlassianMark, DatabricksMark, GitHubMark } from "./BrandMarks";

// official wordmark aspect: 1862×392 (scratch/bifrost/BIFROST---Logo.jpg)
const LOGO_ASPECT = 1862 / 392;
const LOGO_W = 100;
const LOGO_H = LOGO_W / LOGO_ASPECT; // ≈ 21.05
const GATEWAY_PILL = { x: 428, y: 52, w: 144, h: 36, cx: 500, cy: 70 };
// 16-unit standoff between path ends and node edges (as before) so traffic
// dots read as "absorbed" by the node rather than crashing into it
const IN_END = GATEWAY_PILL.x - 16;
const OUT_START = GATEWAY_PILL.x + GATEWAY_PILL.w + 16;

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
        <path id="conduit-in" d={`M92 70 H ${IN_END}`} />
        <path id="conduit-trunk" d={`M${OUT_START} 70 H 620 C 660 70 660 24 700 24 H 892`} />
        {/* mid fans out slightly (70 → 76) to land on the middle pill's center */}
        <path id="conduit-mid" d={`M${OUT_START} 70 H 660 C 680 70 680 76 700 76 H 892`} />
        <path id="conduit-low" d={`M${OUT_START} 70 H 620 C 660 70 660 128 700 128 H 892`} />
        {/* userSpaceOnUse region spanning the full viewBox: percentage regions
            collapse to 0-height on a horizontal line's bbox, and the fan-out
            paths need coverage across the whole diagram, not just y=40..100 */}
        <filter id="conduit-glow" filterUnits="userSpaceOnUse" x="0" y="0" width="1000" height="180">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* glows — white halo on the access feed, rainbow halo on the fan-outs;
          all crisp line widths are uniform 2px */}
      <use href="#conduit-in" stroke="#ffffff" strokeWidth="6" opacity="0.35" filter="url(#conduit-glow)" />
      <use href="#conduit-trunk" stroke="url(#conduit-spectral)" strokeWidth="6" opacity="0.35" filter="url(#conduit-glow)" />
      <use href="#conduit-mid" stroke="url(#conduit-spectral)" strokeWidth="6" opacity="0.35" filter="url(#conduit-glow)" />
      <use href="#conduit-low" stroke="url(#conduit-spectral)" strokeWidth="6" opacity="0.35" filter="url(#conduit-glow)" />

      {/* base strokes — always visible, motion or not. All runs are uniform 2px:
          the access feed is solid white; the fan-outs are solid rainbow */}
      <use href="#conduit-in" className="conduit-base" stroke="#ffffff" strokeWidth="2" />
      <use href="#conduit-trunk" stroke="url(#conduit-spectral)" strokeWidth="2" />
      <use href="#conduit-mid" stroke="url(#conduit-spectral)" strokeWidth="2" />
      <use href="#conduit-low" stroke="url(#conduit-spectral)" strokeWidth="2" />

      {/* spectral shimmer overlay — white light pulses along the rainbow fan-outs
          (on the white access feed a same-color shimmer is invisible, so it skips it) */}
      <use href="#conduit-trunk" className="shimmer" stroke="#ffffff" strokeWidth="2" />
      <use href="#conduit-mid" className="shimmer" stroke="#ffffff" strokeWidth="2" />
      <use href="#conduit-low" className="shimmer" stroke="#ffffff" strokeWidth="2" />

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

        {/* gateway node: official Bifrost wordmark in a pill */}
        <rect
          x={GATEWAY_PILL.x}
          y={GATEWAY_PILL.y}
          width={GATEWAY_PILL.w}
          height={GATEWAY_PILL.h}
          rx={GATEWAY_PILL.h / 2}
          stroke="var(--accent)"
          strokeWidth="1"
          fill="var(--surface-2)"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <image
          href="/logo-light.webp"
          x={GATEWAY_PILL.cx - LOGO_W / 2}
          y={GATEWAY_PILL.cy - LOGO_H / 2}
          width={LOGO_W}
          height={LOGO_H}
          preserveAspectRatio="xMidYMid meet"
        />

        {/* tool endpoints as mark-bearing pills — official logos, no names */}
        <g stroke="var(--border-hi)" strokeWidth="1" fill="var(--surface)">
          <rect x="892" y="10" width="84" height="28" rx="14" />
          <rect x="892" y="62" width="84" height="28" rx="14" />
          <rect x="892" y="114" width="84" height="28" rx="14" />
        </g>
        <GitHubMark x={924} y={14} size={20} />
        <AtlassianMark x={924} y={66} size={20} />
        <DatabricksMark x={924} y={118} size={20} />
      </g>
    </svg>
  );
}