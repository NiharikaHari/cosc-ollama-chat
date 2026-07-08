const STORE_KEY = "ollama-chat-store-v2";
const LEGACY_MESSAGES_KEY = "ollama-chat-messages";
const LEGACY_MODEL_KEY = "ollama-chat-model";

const TITLE_MAX_LENGTH = 40;

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `c_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function titleFromMessage(text) {
  const trimmed = text.trim();
  if (trimmed.length <= TITLE_MAX_LENGTH) return trimmed;
  return `${trimmed.slice(0, TITLE_MAX_LENGTH)}…`;
}

function migrateLegacyStore() {
  try {
    const raw = localStorage.getItem(LEGACY_MESSAGES_KEY);
    const messages = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(messages) || messages.length === 0) {
      return { chats: [], activeId: null };
    }

    const firstUserMessage = messages.find((m) => m.role === "user");
    const now = Date.now();
    const chat = {
      id: makeId(),
      title: firstUserMessage ? titleFromMessage(firstUserMessage.content) : "New chat",
      messages,
      model: localStorage.getItem(LEGACY_MODEL_KEY) || null,
      createdAt: now,
      updatedAt: now,
    };

    return { chats: [chat], activeId: chat.id };
  } catch {
    return { chats: [], activeId: null };
  }
}

export function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fall through to migration/defaults
  }
  return migrateLegacyStore();
}

export function saveStore(store) {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

export function createChat(model) {
  const now = Date.now();
  return {
    id: makeId(),
    title: "New chat",
    messages: [],
    model: model ?? null,
    createdAt: now,
    updatedAt: now,
  };
}
