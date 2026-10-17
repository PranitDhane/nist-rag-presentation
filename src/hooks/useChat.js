import { useCallback, useEffect, useRef, useState } from "react";
import { deleteThread, getThread, streamChat } from "../api/client.js";

const KEY = "nist-chatbot.thread_id";
const storage = {
  get: () => { try { return localStorage.getItem(KEY); } catch { return null; } },   // storage can be blocked: degrade quietly
  set: (v) => { try { localStorage.setItem(KEY, v); } catch { /* ignore */ } },
  del: () => { try { localStorage.removeItem(KEY); } catch { /* ignore */ } },
};

let nextId = 0;
const uid = () => `m${++nextId}`;

/** Conversation state + the streaming turn. Messages: {id, role:"user"|"bot", text, sources, related, streaming, error, latencyMs}. */
export function useChat() {
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const threadId = useRef(storage.get());
  const abort = useRef(null);

  const patch = useCallback((id, fn) =>
    setMessages((all) => all.map((m) => (m.id === id ? { ...m, ...fn(m) } : m))), []);

  useEffect(() => {                                   // bring back the conversation after a reload
    if (!threadId.current) return;
    let cancelled = false;
    getThread(threadId.current).then((history) => {
      if (cancelled) return;
      if (!history) { threadId.current = null; storage.del(); return; }
      setMessages(history.map((h) => ({ id: uid(), role: h.role === "user" ? "user" : "bot", text: h.content, sources: [], related: null })));
    }).catch(() => {});                               // server down: the status pill reports it
    return () => { cancelled = true; };
  }, []);

  const send = useCallback(async (text) => {
    const message = text.trim();
    if (!message || busy) return;
    const botId = uid();
    setMessages((all) => [...all,
      { id: uid(), role: "user", text: message },
      { id: botId, role: "bot", text: "", sources: [], related: null, streaming: true }]);
    setBusy(true);
    abort.current = new AbortController();
    try {
      for await (const [event, d] of await streamChat(message, threadId.current, abort.current.signal)) {
        if (event === "meta") { threadId.current = d.thread_id; storage.set(d.thread_id); }
        else if (event === "token") patch(botId, (m) => ({ text: m.text + d.text }));
        else if (event === "correction") patch(botId, () => ({ text: d.text }));    // validated text replaces the streamed draft
        else if (event === "sources") patch(botId, () => ({ sources: d.sources }));
        else if (event === "related") patch(botId, () => ({ related: d }));
        else if (event === "done") patch(botId, () => ({ latencyMs: d.latency_ms }));
        else if (event === "error") { patch(botId, () => ({ error: d.message })); break; }
      }
    } catch (err) {
      if (err.name === "AbortError") return;
      if (err.status === 404) { threadId.current = null; storage.del(); }          // expired thread: next message starts fresh
      patch(botId, () => ({ error: err.status === 404 ? "This conversation expired. Please ask again to start a new one."
        : err.message || "Could not reach the server. Check that it is running and try again." }));
    } finally {
      patch(botId, () => ({ streaming: false }));
      setBusy(false);
    }
  }, [busy, patch]);

  const reset = useCallback(() => {
    if (busy) return;
    if (threadId.current) deleteThread(threadId.current);
    threadId.current = null; storage.del(); setMessages([]);
  }, [busy]);

  return { messages, busy, send, reset };
}
