# NIST CHATBOT (React UI)

Chat front end for the NIST AI RMF RAG API in `../nist-rag`. Streams answers over `/chat/stream`, renders `[C#]`
citations as links to the exact PDF page, shows sources (or the closest sections when the documents don't answer),
and keeps the conversation across reloads.

```bash
# terminal 1: the API
cd ../nist-rag && make dev

# terminal 2: this UI
npm install
npm run dev          # http://localhost:5173  (proxies /chat, /threads, /health to the API)
npm test             # parser/renderer unit tests
npm run build        # static bundle in dist/
```

`VITE_API_TARGET` (see `.env.example`) changes where the dev/preview proxy points (default `http://127.0.0.1:8000`).
A production deployment must serve `dist/` and proxy the same three paths to the API.

Layout: `src/api` (fetch + SSE), `src/hooks` (`useChat`, `useHealth`), `src/components`, `src/lib` (pure parsers, tested).
