import { readEvents } from "../lib/sse.js";

/** Turn a failed HTTP response into { status, message } using the API's {"error": {code, message}} body. */
export async function httpError(res) {
  let message = `Request failed (${res.status}).`;
  try {
    const body = await res.json();
    if (body.error) message = body.error.message;
    else if (Array.isArray(body.detail) && body.detail[0]) message = body.detail[0].msg;
  } catch { /* keep the generic message */ }
  const retry = res.headers.get("Retry-After");
  return { status: res.status, message: retry ? `${message} (retry in ~${retry}s)` : message };
}

/** POST /chat/stream. Resolves to an async iterator of [event, data]; throws {status, message} on an HTTP error. */
export async function streamChat(message, threadId, signal) {
  const res = await fetch("/chat/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, thread_id: threadId || null }),
    signal,
  });
  if (!res.ok) throw await httpError(res);
  return readEvents(res);
}

export async function getThread(threadId) {
  const res = await fetch(`/threads/${threadId}`);
  return res.ok ? (await res.json()).messages : null;
}

export const deleteThread = (threadId) => fetch(`/threads/${threadId}`, { method: "DELETE" }).catch(() => {});

export async function getHealth() {
  const res = await fetch("/health");
  const body = await res.json();
  return res.ok && body.status === "ok";
}
