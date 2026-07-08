# ollama-chat

A browser chat UI for a locally running [Ollama](https://ollama.com) model. Built with React + Vite.

Features:
- Streams assistant responses token-by-token
- Model picker populated from your installed Ollama models
- Chat history persisted to `localStorage` (survives page refresh)
- Typing indicator while the model is generating
- Clear chat button (with confirmation)

## Prerequisites

- [Ollama](https://ollama.com) installed and running: `ollama serve`
- At least one model pulled, e.g. `ollama pull llama3`

## Run

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## CORS

If the browser reports a network/CORS error reaching `http://localhost:11434`, restart Ollama with the dev origin allowed:

```bash
OLLAMA_ORIGINS=http://localhost:5173 ollama serve
```
