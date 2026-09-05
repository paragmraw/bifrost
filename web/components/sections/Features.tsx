import { LogLine } from "../Terminal";

export default function Features() {
  return (
    <section className="section" id="tab-features" data-tab-section suppressHydrationWarning>
      <div className="container stack" style={{ gap: 40 }}>
        <div data-stagger style={{ "--stagger-i": 0 } as React.CSSProperties}>
          <p className="eyebrow">What&apos;s different</p>
          {/* capped at 40px so the headline breaks exactly on one line at desktop width */}
          <h2 style={{ fontSize: "clamp(24px, 3.4vw, 40px)" }}>The access layer your fleet has been missing.</h2>
        </div>
        <div className="features-bento">
          <div className="feature card-flat bento-hero" data-stagger style={{ "--stagger-i": 1 } as React.CSSProperties}>
            <div className="feature-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="12" r="2.4" />
                <circle cx="18" cy="12" r="2.4" />
                <path d="M8.4 12h7.2M6 9.6v-3M6 14.4v3M18 9.6v-3M18 14.4v3" />
              </svg>
            </div>
            <h3>Mount once, route by tool</h3>
            <p>Point your client at one base URL. Bifrost resolves each tool call to the right server and proxies it — no per-server credentials tangled across your config.</p>
          </div>
          <div className="feature card-flat bento-keys" data-stagger style={{ "--stagger-i": 2 } as React.CSSProperties}>
            <div className="feature-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
            </div>
            <h3>Keys you can scope and rotate</h3>
            <p>Issue API keys per tool, per team, or per project. Revoke one without rebuilding the fleet — and know exactly who called what, and when.</p>
            <div
              className="keys-micro"
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: 12,
                display: "grid",
                gap: 6,
                marginTop: 18,
                paddingTop: 14,
                borderTop: "1px solid var(--border)",
              }}
            >
              {[
                { key: "sk_live_9f2…", value: "tools:github" },
                { key: "sk_live_41a…", value: "tools:postgres" },
                { key: "sk_live_77b…", value: "revoked" },
              ].map((k) => (
                <div key={k.key} style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                  <span className="k" style={{ color: "var(--muted)", flex: "0 0 12ch" }}>{k.key}</span>
                  <span className="cm" style={{ color: "var(--muted)" }}>→</span>
                  <span><code style={{ fontFamily: "inherit", fontSize: "inherit" }}>{k.value}</code></span>
                </div>
              ))}
            </div>
          </div>
          <div className="feature card-flat bento-audit" data-stagger style={{ "--stagger-i": 3 } as React.CSSProperties}>
            <div className="feature-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19V5M4 19h16M8 15v-3M12 15V9M16 15v-5" />
              </svg>
            </div>
            <h3>Observability built in</h3>
            <p>Every invocation lands in a searchable trace — latency, payload size, status. You see the whole fleet&apos;s activity in one pane, without bolting on a stack.</p>
            <div style={{ marginTop: 18 }}>
              <LogLine t="01:48:22" status="200">
                POST /mcp · github.get_file
              </LogLine>
              <LogLine t="01:47:03" status="200">
                GET /mcp · postgres.query
              </LogLine>
              <div style={{ opacity: 0.6 }}>
                <LogLine t="01:45:58" status="429">
                  POST /mcp · github.list_issues
                </LogLine>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}