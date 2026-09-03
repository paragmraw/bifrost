const FEATURES = [
  {
    id: "feature-routing",
    mark: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="12" r="2.4" />
        <circle cx="18" cy="12" r="2.4" />
        <path d="M8.4 12h7.2M6 9.6v-3M6 14.4v3M18 9.6v-3M18 14.4v3" />
      </svg>
    ),
    title: "Mount once, route by tool",
    body: "Point your client at one base URL. Bifrost resolves each tool call to the right server and proxies it — no per-server credentials tangled across your config.",
  },
  {
    id: "feature-keys",
    mark: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="11" width="16" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
    ),
    title: "Keys you can scope and rotate",
    body: "Issue API keys per tool, per team, or per project. Revoke one without rebuilding the fleet — and know exactly who called what, and when.",
  },
  {
    id: "feature-audit",
    mark: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19V5M4 19h16M8 15v-3M12 15V9M16 15v-5" />
      </svg>
    ),
    title: "Observability built in",
    body: "Every invocation lands in a searchable trace — latency, payload size, status. You see the whole fleet's activity in one pane, without bolting on a stack.",
  },
];

export default function Features() {
  return (
    <section className="section" id="tab-features" data-tab-section suppressHydrationWarning>
      <div className="container stack" style={{ gap: 40 }}>
        <div style={{ maxWidth: "34ch" }}>
          <p className="eyebrow">What&apos;s different</p>
          <h2>The access layer your fleet has been missing.</h2>
        </div>
        <div className="grid-3">
          {FEATURES.map((f) => (
            <div className="feature card-flat" key={f.id}>
              <div className="feature-mark">{f.mark}</div>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}