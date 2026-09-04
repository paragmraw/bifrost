import Terminal from "../Terminal";
import ConduitDiagram from "../ConduitDiagram";

export default function HowItWorks() {
  return (
    <section className="section" id="tab-how" data-tab-section suppressHydrationWarning>
      <div className="container grid-2-1">
        <span className="hud hud-tag" aria-hidden="true">BFR-02 · routing</span>
        <ConduitDiagram data-stagger style={{ "--stagger-i": 0 } as React.CSSProperties} />
        <div className="card card-flat" data-stagger style={{ "--stagger-i": 1 } as React.CSSProperties}>
          <Terminal title="client.json" status="client config" glass>
            <span className="dim">{"{"}</span>
            <br />
            &nbsp; <span className="s">&quot;mcpServers&quot;</span><span className="cm">:</span> <span className="dim">{"{"}</span>
            <br />
            &nbsp; &nbsp; <span className="s">&quot;bifrost&quot;</span><span className="cm">:</span> <span className="dim">{"{"}</span>
            <br />
            &nbsp; &nbsp; &nbsp; <span className="s">&quot;url&quot;</span><span className="cm">:</span> <span className="cm">&quot;https://mcp.example.com&quot;,</span>
            <br />
            &nbsp; &nbsp; &nbsp; <span className="s">&quot;headers&quot;</span><span className="cm">:</span> <span className="dim">{"{"}</span> <span className="s">&quot;Authorization&quot;</span><span className="cm">: &quot;Bearer sk_live_…&quot;</span> <span className="dim">{"}"}</span>
            <br />
            &nbsp; &nbsp; <span className="dim">{"}"}</span>
            <br />
            &nbsp; <span className="dim">{"}"}</span>
            <br />
            <span className="dim">{"}"}</span>
          </Terminal>
        </div>
        <ol className="steps stack" data-stagger style={{ listStyle: "none", padding: 0, margin: 0, "--stagger-i": 2 } as React.CSSProperties}>
          <li>
            <span className="step-num num">01</span>
            <div>
              <h3>Point one client at Bifrost</h3>
              <p>Add a single entry to your client config pointing at your gateway base URL.</p>
            </div>
          </li>
          <li>
            <span className="step-num num">02</span>
            <div>
              <h3>Attach the servers you need</h3>
              <p>Register any MCP server — internal or external — and let Bifrost resolve and proxy by tool name.</p>
            </div>
          </li>
          <li>
            <span className="step-num num">03</span>
            <div>
              <h3>Issue keys, then watch it work</h3>
              <p>Scope keys per tool or team, rotate them on a schedule, and audit every call from one dashboard.</p>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}