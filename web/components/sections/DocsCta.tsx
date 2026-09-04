import GitHubIcon from "../GitHubIcon";
import { GITHUB_URL } from "../../lib/site";

export default function DocsCta() {
  return (
    <section className="section" id="tab-docs" data-tab-section suppressHydrationWarning style={{ textAlign: "center" }}>
      <div className="container" style={{ maxWidth: 620, paddingTop: 26 }}>
        <span className="hud hud-tag" aria-hidden="true">BFR-04 · docs</span>
        <h2 data-stagger style={{ "--stagger-i": 0 } as React.CSSProperties}>Stop duplicating keys. Mount one gateway.</h2>
        <p className="lead" data-stagger style={{ margin: "16px auto 32px", "--stagger-i": 1 } as React.CSSProperties}>
          Runs on your infrastructure — your keys, your network, your audit trail.
          Docker up in five minutes.
        </p>
        <a className="btn btn-primary" href={GITHUB_URL} target="_blank" rel="noopener" data-stagger style={{ "--stagger-i": 2 } as React.CSSProperties}>
          <GitHubIcon />Read the docs
        </a>
      </div>
    </section>
  );
}