/** Parse one SSE frame ("event: x\ndata: {...}") into [event, data], or null if it is not a complete frame. */
export function parseFrame(frame) {
  const ev = /^event: (.*)$/m.exec(frame);
  const data = /^data: (.*)$/m.exec(frame);
  return ev && data ? [ev[1], JSON.parse(data[1])] : null;
}

/** Async generator of [event, data] pairs from a fetch Response with a text/event-stream body. */
export async function* readEvents(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let i;
    while ((i = buf.indexOf("\n\n")) >= 0) {
      const parsed = parseFrame(buf.slice(0, i));
      buf = buf.slice(i + 2);
      if (parsed) yield parsed;
    }
  }
}
