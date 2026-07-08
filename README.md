# ollama-chat

A browser chat UI for a locally running [Ollama](https://ollama.com) model. Built with React + Vite.

Features:
- Streams assistant responses token-by-token
- Model picker populated from your installed Ollama models
- Chat history persisted to `localStorage` (survives page refresh)
- Typing indicator while the model is generating
- Clear chat button (with confirmation)

## Prerequisites

- [Node.js](https://nodejs.org) 18+ and npm
- [Ollama](https://ollama.com) installed and running

## 1. Install Ollama

- **macOS**: download from [ollama.com/download](https://ollama.com/download), or `brew install ollama`
- **Linux**: `curl -fsSL https://ollama.com/install.sh | sh`
- **Windows**: download the installer from [ollama.com/download](https://ollama.com/download)

Start the Ollama server (skip if the installer already runs it as a background service):

```bash
ollama serve
```

## 2. Pull a model

In a separate terminal, pull at least one model:

```bash
ollama pull llama3
```

Browse other available models at [ollama.com/library](https://ollama.com/library). Any pulled model will show up in this app's model picker.

## 3. Install and run this app

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## CORS

By default Ollama only accepts requests from its own origin, so the browser may report a network/CORS error reaching `http://localhost:11434`. Restart Ollama with the dev origin allowed:

```bash
OLLAMA_ORIGINS=http://localhost:5173 ollama serve
```

## Build for production

```bash
npm run build
npm run preview
```

If you serve the production build from a different origin/port, update `OLLAMA_ORIGINS` accordingly.
