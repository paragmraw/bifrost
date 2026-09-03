import GitHubIcon from "./GitHubIcon";

export default function TopNav() {
  return (
    <header className="topnav">
      <div className="container topnav-inner">
        <div className="topnav-zone topnav-zone--left">
          {/* suppressHydrationWarning: the pre-paint INIT_TAB script (page.tsx) sets
              aria-current on these links before React hydrates; that is intentional */}
          <a href="#tab-hero" data-tab="tab-hero" aria-label="Bifrost — home" suppressHydrationWarning>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo-mark" src="/logo.webp" alt="Bifrost" />
          </a>
        </div>
        <div className="topnav-zone topnav-zone--center">
          <nav id="primary-nav" aria-label="Primary">
            <a href="#tab-hero" data-tab="tab-hero" suppressHydrationWarning>Product</a>
            <a href="#tab-how" data-tab="tab-how" suppressHydrationWarning>How it works</a>
            <a href="#tab-features" data-tab="tab-features" suppressHydrationWarning>Features</a>
            <a href="#tab-docs" data-tab="tab-docs" suppressHydrationWarning>Docs</a>
            <a className="nav-github-link" href="https://github.com/" target="_blank" rel="noopener">
              <GitHubIcon />View on GitHub
            </a>
          </nav>
        </div>
        <div className="topnav-zone topnav-zone--right">
          <a className="btn btn-secondary" href="https://github.com/" target="_blank" rel="noopener">
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