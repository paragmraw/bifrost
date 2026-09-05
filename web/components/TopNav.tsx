import GitHubIcon from "./GitHubIcon";
import { GITHUB_URL } from "../lib/site";

export default function TopNav() {
  return (
    <header className="topnav">
      <div className="container topnav-inner">
        <div className="topnav-zone topnav-zone--left">
          <a href="#tab-hero" data-tab="tab-hero" aria-current="true" aria-label="Bifrost — home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo-mark" src="/logo-light.webp" alt="Bifrost" />
          </a>
        </div>
        <div className="topnav-zone topnav-zone--center">
          <nav id="primary-nav" aria-label="Primary">
            {/* nav-num indices render only in the mobile takeover (≤920px);
                display:none on desktop */}
            <a href="#tab-hero" data-tab="tab-hero" aria-current="true">
              <span className="nav-num num" aria-hidden="true">01</span>Product
            </a>
            <a href="#tab-how" data-tab="tab-how">
              <span className="nav-num num" aria-hidden="true">02</span>How it works
            </a>
            <a href="#tab-features" data-tab="tab-features">
              <span className="nav-num num" aria-hidden="true">03</span>Features
            </a>
            <a href="#tab-docs" data-tab="tab-docs">
              <span className="nav-num num" aria-hidden="true">04</span>Docs
            </a>
            <a className="nav-github-link btn btn-primary" href={GITHUB_URL} target="_blank" rel="noopener">
              <GitHubIcon />View on GitHub
            </a>
          </nav>
        </div>
        <div className="topnav-zone topnav-zone--right">
          <a className="btn btn-primary" href={GITHUB_URL} target="_blank" rel="noopener">
            <GitHubIcon />View on GitHub
          </a>
          <button
            className="nav-toggle btn btn-ghost"
            type="button"
            aria-label="Open menu"
            aria-expanded="false"
            aria-controls="primary-nav"
          >
            Menu
          </button>
        </div>
      </div>
    </header>
  );
}