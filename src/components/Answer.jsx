import { indexSources, parseAnswer } from "../lib/answer.js";

function Cite({ id, source }) {
  const n = id.slice(1);
  return source
    ? <a className="chip" href={source.url} target="_blank" rel="noopener noreferrer" title={source.label}>{n}</a>
    : <span className="chip">{n}</span>;           // not linked until the `sources` event arrives
}

function Parts({ parts, byKey }) {
  return parts.map((p, i) => {
    if (p.type === "cite") return <Cite key={i} id={p.key} source={byKey[p.key]} />;
    if (p.type === "bold") return <strong key={i}><Parts parts={p.parts} byKey={byKey} /></strong>;
    return p.text;
  });
}

/** Renders answer text as paragraphs, bullets and citation chips. Pure text nodes: no dangerouslySetInnerHTML. */
export default function Answer({ text, sources }) {
  const byKey = indexSources(sources);
  return parseAnswer(text).map((b, i) => b.type === "ul"
    ? <ul key={i}>{b.items.map((parts, j) => <li key={j}><Parts parts={parts} byKey={byKey} /></li>)}</ul>
    : <p key={i}><Parts parts={b.parts} byKey={byKey} /></p>);
}
