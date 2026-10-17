import { useEffect, useRef, useState } from "react";

export default function Composer({ onSend, busy }) {
  const [text, setText] = useState("");
  const ref = useRef(null);

  useEffect(() => {                                   // grow with content, up to the CSS max-height
    const t = ref.current;
    t.style.height = "auto";
    t.style.height = `${Math.min(t.scrollHeight, 160)}px`;
  }, [text]);

  useEffect(() => { if (!busy) ref.current.focus(); }, [busy]);

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim() || busy) return;
    onSend(text);
    setText("");
  };

  return (
    <footer className="composer-wrap">
      <form className="composer" onSubmit={submit} autoComplete="off">
        <textarea
          ref={ref} rows={1} maxLength={2000} value={text} disabled={busy} aria-label="Message"
          placeholder="Ask a question about the NIST AI RMF…"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) submit(e); }}
        />
        <button className="send" type="submit" aria-label="Send" disabled={busy || !text.trim()}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
        </button>
      </form>
      <p className="hint">Enter to send · Shift+Enter for a new line · Answers come only from the NIST documents.</p>
    </footer>
  );
}
