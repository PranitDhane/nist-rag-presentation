function Card({ url, label, kind, keys = [] }) {
  return (
    <a className="source" href={url} target="_blank" rel="noopener noreferrer">
      {keys.map((k) => <span key={k} className="chip">{k.slice(1)}</span>)}
      <span className="label">{label}</span>
      {kind && <span className="kind">{kind}</span>}
      <span className="open" aria-hidden="true">↗</span>
    </a>
  );
}

export function Sources({ sources }) {
  if (!sources.length) return null;
  return (
    <div className="sources">
      <h3>Sources</h3>
      <ul className="source-list">{sources.map((s) => <li key={s.url + s.label}><Card {...s} /></li>)}</ul>
    </div>
  );
}

/** Shown instead of Sources when the documents do not answer: the closest sections, clearly marked as not an answer. */
export function Related({ related }) {
  if (!related?.sections?.length) return null;
  return (
    <>
      <div className="notice">{related.note}</div>
      <div className="sources">
        <h3>Closest sections</h3>
        <ul className="source-list">
          {related.sections.map((s) => (
            <li key={s.citation_url + s.citation_label}><Card url={s.citation_url} label={s.citation_label} kind={s.kind} /></li>
          ))}
        </ul>
      </div>
    </>
  );
}
