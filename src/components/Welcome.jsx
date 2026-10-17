const SUGGESTIONS = [
  "Which of the four AI RMF functions is cross-cutting?",
  "What are the characteristics of trustworthy AI?",
  "What risks are unique to generative AI?",
  "How does the GOVERN function relate to MAP and MEASURE?",
];

export default function Welcome({ onPick }) {
  return (
    <section className="welcome">
      <h2>Ask about the NIST AI Risk Management Framework</h2>
      <p>Answers are grounded in <strong>NIST AI 100-1</strong> and <strong>NIST AI 600-1</strong> and cite the exact PDF pages.</p>
      <div className="suggestions">
        {SUGGESTIONS.map((q) => (
          <button key={q} type="button" className="suggestion" onClick={() => onPick(q)}>{q}</button>
        ))}
      </div>
    </section>
  );
}
