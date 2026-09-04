export default function PageFoot() {
  return (
    <footer
      className="pagefoot"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        background: "color-mix(in oklch, var(--bg) 96%, transparent)",
        zIndex: 5,
      }}
    >
      <div className="container row-between">
        <span>© Bifrost · 2026</span>
        <span className="meta">Use ↑ ↓ keys or scroll to switch tabs</span>
      </div>
    </footer>
  );
}