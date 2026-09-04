import GitHubIcon from "../GitHubIcon";
import { GITHUB_URL } from "../../lib/site";

export default function DocsCta() {
  return (
    <section className="section" id="tab-docs" data-tab-section suppressHydrationWarning style={{ textAlign: "center" }}>
      <div className="container" style={{ maxWidth: 620 }}>
        <h2>Stop duplicating keys. Mount one gateway.</h2>
        <p className="lead" style={{ margin: "16px auto 32px" }}>
          Self-host it or let us run it — the config is the same either way.
        </p>
        <a className="btn btn-primary" href={GITHUB_URL} target="_blank" rel="noopener">
          <GitHubIcon />Read the docs
        </a>
      </div>
    </section>
  );
}