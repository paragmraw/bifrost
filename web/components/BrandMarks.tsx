/**
 * Official third-party brand marks for the conduit diagram (GitHub, Atlassian,
 * Databricks) — marks only, no wordmarks, per the user's brand-display rule.
 *
 * Path geometry is verbatim from the simple-icons project (CC0); fills are each
 * brand's official mark colors:
 *   - GitHub: octocat geometry shared with GitHubIcon.tsx. Official mark color
 *     is #181717, which is invisible on our dark surfaces — GitHub's own
 *     dark-surface treatment (white mark) is used instead.
 *   - Atlassian: left swoosh carries the official #0052CC → #2684FF gradient,
 *     the big A is flat #2684FF (atlassian.design logo library).
 *   - Databricks: flat official #FF3621 (brand.databricks.com styleguide).
 *
 * Each mark renders as a nested <svg> so it can be positioned inside the
 * conduit SVG with exact x/y/size coordinates. All are decorative: the parent
 * conduit is aria-hidden, so no titles/labels are emitted here.
 */

const GITHUB_MARK_PATH =
  // same octocat geometry as components/GitHubIcon.tsx
  "M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z";

const ATLASSIAN_LEFT_PATH =
  "M7.12 11.084a.683.683 0 00-1.16.126L.075 22.974a.703.703 0 00.63 1.018h8.19a.678.678 0 00.63-.39c1.767-3.65.696-9.203-2.406-12.52z";
const ATLASSIAN_A_PATH =
  "M11.434.386a15.515 15.515 0 00-.906 15.317l3.95 7.9a.703.703 0 00.628.388h8.19a.703.703 0 00.63-1.017L12.63.38a.664.664 0 00-1.196.006z";

const DATABRICKS_MARK_PATH =
  "M.95 14.184L12 20.403l9.919-5.55v2.21L12 22.662l-10.484-5.96-.565.308v.77L12 24l11.05-6.218v-4.317l-.515-.309L12 19.118l-9.867-5.653v-2.21L12 16.805l11.05-6.218V6.32l-.515-.308L12 11.974 2.647 6.681 12 1.388l7.76 4.368.668-.411v-.566L12 0 .95 6.27v.72L12 13.207l9.919-5.55v2.26L12 15.52 1.516 9.56l-.565.308Z";

type MarkProps = { x: number; y: number; size?: number };

export function GitHubMark({ x, y, size = 18 }: MarkProps) {
  return (
    <svg x={x} y={y} width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d={GITHUB_MARK_PATH} fill="var(--fg)" />
    </svg>
  );
}

export function AtlassianMark({ x, y, size = 18 }: MarkProps) {
  return (
    <svg x={x} y={y} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient
          id="atlassian-mark-grad"
          x1="3.5"
          y1="11"
          x2="3.5"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#0052cc" />
          <stop offset="1" stopColor="#2684ff" />
        </linearGradient>
      </defs>
      <path d={ATLASSIAN_LEFT_PATH} fill="url(#atlassian-mark-grad)" />
      <path d={ATLASSIAN_A_PATH} fill="#2684ff" />
    </svg>
  );
}

export function DatabricksMark({ x, y, size = 18 }: MarkProps) {
  return (
    <svg x={x} y={y} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={DATABRICKS_MARK_PATH} fill="#FF3621" />
    </svg>
  );
}