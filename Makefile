# Usage: make dev | make install | make test | make build | make preview
# The API must be running too (cd ../nist-rag && make dev). Address comes from VITE_API_TARGET in .env.

.PHONY: dev install test build preview help

help:
	@echo "make dev      start the UI at http://localhost:5173 (installs packages on first run)"
	@echo "make test     unit tests"
	@echo "make build    production bundle in dist/"
	@echo "make preview  serve dist/ locally (same API proxy)"

node_modules: package.json package-lock.json
	npm install
	@touch node_modules

install: node_modules

# Warns (does not block) when the API is down: the UI still starts and its status pill shows "offline".
dev: node_modules
	@[ -f .env ] || cp .env.example .env
	@T=$$(grep -E '^VITE_API_TARGET=' .env | cut -d= -f2); T=$${T:-http://127.0.0.1:8000}; \
	  curl -sf -m 3 $$T/health >/dev/null || echo "Warning: API not reachable at $$T. Start it: cd ../nist-rag && make dev"
	npm run dev

test: node_modules
	npm test

build: node_modules
	npm run build

preview: build
	npm run preview
