const LABEL = { checking: "connecting…", online: "online", offline: "offline" };
const CLASS = { checking: "", online: "ok", offline: "down" };

export default function Header({ health, onNewChat, disabled }) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
            <path d="M12 3l7 2.6V11c0 4.3-3 7.4-7 8.6-4-1.2-7-4.3-7-8.6V5.6z" />
            <path d="M9 11.5l2.2 2.2L15 9.8" strokeLinecap="round" />
          </svg>
        </span>
        <div>
          <h1>NIST CHATBOT</h1>
          <p className="tagline">AI RMF 1.0 &amp; Generative AI Profile</p>
        </div>
      </div>
      <div className="actions">
        <span className={`status ${CLASS[health]}`} title="Server status"><i /><span>{LABEL[health]}</span></span>
        <button className="btn" type="button" onClick={onNewChat} disabled={disabled}>New chat</button>
      </div>
    </header>
  );
}
