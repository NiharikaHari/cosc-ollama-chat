const BASE_URL = "http://localhost:11434";

export async function listModels() {
  const response = await fetch(`${BASE_URL}/api/tags`);
  if (!response.ok) {
    throw new Error(`Failed to list models (${response.status})`);
  }
  const data = await response.json();
  return data.models ?? [];
}

export async function* streamChat(model, messages, signal) {
  const response = await fetch(`${BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, stream: true }),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`Ollama request failed (${response.status})`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();

    for (const line of lines) {
      if (!line.trim()) continue;
      const parsed = JSON.parse(line);
      if (parsed.message?.content) {
        yield parsed.message.content;
      }
      if (parsed.done) return;
    }
  }
}
