import GitHubIcon from "../GitHubIcon";
import { GITHUB_URL } from "../../lib/site";
import Terminal, { LogLine } from "../Terminal";

export default function Hero() {
  return (
    // is-active in the static markup: Hero is always the tab the site opens on,
    // so first paint shows it before TabViewport's effect runs.
    <section className="section hero is-active" id="tab-hero" data-tab-section>
      <div className="container hero-split">
        <div>
          <p className="eyebrow" data-stagger style={{ "--stagger-i": 0 } as React.CSSProperties}>Model Context Protocol · access layer</p>
          <h1 data-stagger style={{ "--stagger-i": 1 } as React.CSSProperties}>One secure endpoint for every MCP server your team trusts.</h1>
          <p className="lead" data-stagger style={{ marginTop: 20, "--stagger-i": 2 } as React.CSSProperties}>
            Bifrost sits between your AI tooling and a fleet of MCP servers — a single base URL to
            mount, keys you can scope and rotate, and a live audit log of every invocation,
            entirely on your own infrastructure.
          </p>
          <div className="hero-cta" data-stagger style={{ marginTop: 28, "--stagger-i": 3 } as React.CSSProperties}>
            <a className="btn btn-primary" href="#tab-how" data-tab="tab-how">
              Get started
            </a>
            <a className="btn btn-ghost" href={GITHUB_URL} target="_blank" rel="noopener">
              <GitHubIcon />View on GitHub
            </a>
          </div>
          <p className="meta" data-stagger style={{ marginTop: 16, "--stagger-i": 4 } as React.CSSProperties}>
            Self-hosted · one Docker install · five-minute setup
          </p>
        </div>
        <div className="term-tilt" data-stagger style={{ "--stagger-i": 5 } as React.CSSProperties}>
        <Terminal title="gateway.yaml" status="live · 3 servers" glass footer={
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
          &nbsp; <span className="s">rotate</span><span className="cm">: 30d · scopes: tools, prompts</span>
        </Terminal>
        </div>
      </div>
    </section>
  );
}