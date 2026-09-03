import GitHubIcon from "../GitHubIcon";
import Terminal, { LogLine } from "../Terminal";

export default function Hero() {
  // suppressHydrationWarning (below): the pre-paint INIT_TAB script (page.tsx) adds
  // is-active / aria-current before hydration; that is intentional
  return (
    <section className="section hero" id="tab-hero" data-tab-section suppressHydrationWarning>
      <div className="container hero-split">
        <div>
          <p className="eyebrow">Model Context Protocol · access layer</p>
          <h1>One secure endpoint for every MCP server your team trusts.</h1>
          <p className="lead" style={{ marginTop: 20 }}>
            Bifrost sits between your AI tooling and a fleet of MCP servers — a single base URL to
            mount, keys you can scope and rotate, and a live audit log of every invocation.
          </p>
          <div className="hero-cta" style={{ marginTop: 28 }}>
            <a className="btn btn-primary" href="#tab-how" data-tab="tab-how" suppressHydrationWarning>
              Get started
            </a>
            <a className="btn btn-ghost" href="https://github.com/" target="_blank" rel="noopener">
              <GitHubIcon />View on GitHub
            </a>
          </div>
          <p className="meta" style={{ marginTop: 16 }}>
            Docker install · five-minute setup · self-host or cloud
          </p>
        </div>
        <Terminal title="gateway.yaml" status="live · 3 servers" footer={
          <>
            <LogLine t="01:48:22" status="200">
              GET /mcp · github.get_pull
            </LogLine>
            <LogLine t="01:47:03" status="200">
              GET /mcp · postgres.query
            </LogLine>
          </>
        }>
          <span className="k">gateway:</span>
          <br />
          &nbsp; <span className="s">port</span><span className="cm">: 8787</span>
          <br />
          &nbsp; <span className="s">baseUrl</span><span className="cm">: https://mcp.example.com</span>
          <br />
          <br />
          <span className="k">servers:</span>
          <br />
          &nbsp; <span className="s">github</span><span className="cm">:</span>
          <br />
          &nbsp; &nbsp; <span className="s">url</span><span className="cm">: http://10.0.4.21:3001</span>
          <br />
          &nbsp; <span className="s">postgres</span><span className="cm">:</span>
          <br />
          &nbsp; &nbsp; <span className="s">url</span><span className="cm">: http://10.0.4.22:3002</span>
          <br />
          <br />
          <span className="k">keys:</span>
          <br />
          &nbsp; <span className="s">rotate</span><span className="cm">: 30d · scopes: tools, prompts</span>
        </Terminal>
      </div>
    </section>
  );
}