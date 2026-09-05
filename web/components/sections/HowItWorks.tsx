import Terminal, { LogLine } from "../Terminal";
import ConduitDiagram from "../ConduitDiagram";

// Layout: narrative rail. The conduit is the section's hero visual; each of the
// three steps below pairs with the artifact that proves it — 01 the client
// config, 02 the route table it produces, 03 the audit trail it leaves.
export default function HowItWorks() {
  return (
    <section className="section" id="tab-how" data-tab-section>
      <div className="container stack" style={{ gap: 24 }}>
        <div data-stagger style={{ "--stagger-i": 0 } as React.CSSProperties}>
          <p className="eyebrow">How it works</p>
          <h2 style={{ fontSize: "clamp(24px, 3.4vw, 40px)" }}>Three moves. One endpoint.</h2>
        </div>
        <ConduitDiagram data-stagger style={{ "--stagger-i": 1 } as React.CSSProperties} />
        <div className="how-steps grid-3">
          <div className="how-step" data-stagger style={{ "--stagger-i": 2 } as React.CSSProperties}>
            <span className="step-num num">01</span>
            <h3>Point one client at Bifrost</h3>
            <p>Add a single entry to your client config pointing at your gateway base URL.</p>
            <Terminal title="client.json" status="client config" glass>
              <span className="dim">{"{"}</span>
              <br />
              &nbsp; <span className="s">&quot;mcpServers&quot;</span><span className="cm">:</span> <span className="dim">{"{"}</span>
              <br />
              &nbsp; &nbsp; <span className="s">&quot;bifrost&quot;</span><span className="cm">:</span> <span className="dim">{"{"}</span>
              <br />
              &nbsp; &nbsp; &nbsp; <span className="s">&quot;url&quot;</span><span className="cm">:</span> <span className="cm">&quot;https://mcp.example.com&quot;,</span>
              <br />
              &nbsp; &nbsp; &nbsp; <span className="s">&quot;headers&quot;</span><span className="cm">:</span> <span className="dim">{"{"}</span>
              <br />
              &nbsp; &nbsp; &nbsp; &nbsp; <span className="s">&quot;Authorization&quot;</span><span className="cm">:</span> <span className="cm">&quot;Bearer sk_live…&quot;</span>
              <br />
              &nbsp; &nbsp; &nbsp; <span className="dim">{"}"}</span>
              <br />
              &nbsp; &nbsp; <span className="dim">{"}"}</span>
              <br />
              &nbsp; <span className="dim">{"}"}</span>
              <br />
              <span className="dim">{"}"}</span>
            </Terminal>
          </div>
          <div className="how-step" data-stagger style={{ "--stagger-i": 3 } as React.CSSProperties}>
            <span className="step-num num">02</span>
            <h3>Attach the servers you need</h3>
            <p>Register any MCP server — internal or external — and let Bifrost resolve and proxy by tool name.</p>
            <div className="route-micro" aria-hidden="true">
              <div><span className="k">github</span><span className="cm">→</span><span>10.0.4.21:3001</span></div>
              <div><span className="k">postgres</span><span className="cm">→</span><span>10.0.4.22:3002</span></div>
              <div><span className="k">databricks</span><span className="cm">→</span><span>10.0.4.23:3003</span></div>
            </div>
          </div>
          <div className="how-step" data-stagger style={{ "--stagger-i": 4 } as React.CSSProperties}>
            <span className="step-num num">03</span>
            <h3>Issue keys, then watch it work</h3>
            <p>Scope keys per tool or team, rotate them on a schedule, and audit every call from your own dashboard.</p>
            <div className="audit-micro">
              <LogLine t="01:48:22" status="200">
                POST /mcp · github.merge_pr
              </LogLine>
              <LogLine t="01:47:03" status="200">
                GET /mcp · postgres.query
              </LogLine>
              <div style={{ opacity: 0.6 }}>
                <LogLine t="01:45:58" status="401">
                  POST /mcp · databricks.run_job
                </LogLine>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}