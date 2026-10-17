import Answer from "./Answer.jsx";
import { Related, Sources } from "./Sources.jsx";

export default function Message({ m }) {
  if (m.role === "user") {
    return <div className="msg user"><div className="bubble">{m.text}</div></div>;
  }
  const waiting = m.streaming && !m.text && !m.error;
  return (
    <div className={`msg bot${m.error ? " error" : ""}`}>
      <div className="bot-label">NIST CHATBOT</div>
      <div className={`bubble${m.streaming && m.text ? " cursor" : ""}`}>
        {waiting && <span className="typing"><span /><span /><span /></span>}
        {m.error ? m.error : <Answer text={m.text} sources={m.sources} />}
      </div>
      <Sources sources={m.sources} />
      <Related related={m.related} />
      {m.latencyMs != null && <div className="meta">{(m.latencyMs / 1000).toFixed(1)}s</div>}
    </div>
  );
}
