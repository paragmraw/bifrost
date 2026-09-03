import type { ReactNode } from "react";

export function LogLine({ t, children, status }: { t: string; children: ReactNode; status: string }) {
  return (
    <div className="log-line">
      <span className="t">{t}</span>
      <span className="ok">{children}</span>
      <span className="status-ok">{status}</span>
    </div>
  );
}

export default function Terminal({
  title,
  status,
  children,
  footer,
  style,
}: {
  title: string;
  status: string;
  children: ReactNode;
  footer?: ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div className="term" style={style}>
      <div className="term-bar">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="title">{title}</span>
        <span className="status">{status}</span>
      </div>
      <div className="code">{children}</div>
      {footer}
    </div>
  );
}