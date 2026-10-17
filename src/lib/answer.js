/**
 * The API returns plain text with inline [C#] markers and "- " bullets (never HTML), so the UI turns it into a small
 * structure that React renders as text nodes. Nothing here produces HTML strings, so model output cannot inject markup.
 *
 * Block:  { type: "p", parts } | { type: "ul", items: parts[] }
 * Part:   { type: "text", text } | { type: "cite", key: "C1" } | { type: "bold", parts }
 */
const INLINE = /\[(C\d+)\]|\*\*(.+?)\*\*/g;
const BULLET = /^\s*[-•*]\s+(.*)$/;

const text = (t) => (t ? [{ type: "text", text: t.replace(/\*\*/g, "") }] : []);   // a lone "**" (bold still streaming) is hidden

/** The prompt asks for plain text, but the model sometimes emits Markdown **bold**; render it instead of showing asterisks. */
export function splitCitations(input) {
  const parts = [];
  let last = 0;
  for (const m of input.matchAll(INLINE)) {
    parts.push(...text(input.slice(last, m.index)));
    parts.push(m[1] ? { type: "cite", key: m[1] } : { type: "bold", parts: splitCitations(m[2]) });
    last = m.index + m[0].length;
  }
  parts.push(...text(input.slice(last)));
  return parts;
}

export function parseAnswer(text) {
  const blocks = [];
  let list = null;
  for (const line of text.split("\n")) {
    const bullet = BULLET.exec(line);
    if (bullet) {
      if (!list) { list = { type: "ul", items: [] }; blocks.push(list); }
      list.items.push(splitCitations(bullet[1]));
      continue;
    }
    list = null;
    if (line.trim()) blocks.push({ type: "p", parts: splitCitations(line) });
  }
  return blocks;
}

/** Map each citation key ("C1") to its Source entry. */
export function indexSources(sources) {
  const byKey = {};
  for (const s of sources) for (const k of s.keys) byKey[k] = s;
  return byKey;
}
