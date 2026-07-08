import { useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";
import ModelSelector from "./components/ModelSelector";
import Modal from "./components/Modal";
import ConfirmDialog from "./components/ConfirmDialog";
import { listModels, streamChat } from "./api/ollama";
import { loadStore, saveStore, createChat, titleFromMessage } from "./storage";
import "./App.css";

export default function App() {
  const [store, setStore] = useState(loadStore);
  const [models, setModels] = useState([]);
  const [modelLoadError, setModelLoadError] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [pendingModel, setPendingModel] = useState(null);
  const abortRef = useRef(null);

  const activeChat = store.chats.find((c) => c.id === store.activeId) ?? null;
  const selectedModel = activeChat?.model ?? pendingModel ?? models[0]?.name ?? null;

  useEffect(() => {
    listModels()
      .then((fetched) => {
        setModels(fetched);
        setPendingModel((prev) =>
          fetched.some((m) => m.name === prev) ? prev : fetched[0]?.name ?? null
        );
      })
      .catch(() => setModelLoadError(true));
  }, []);

  useEffect(() => {
    saveStore(store);
  }, [store]);

  function handleModelChange(name) {
    if (!activeChat) {
      setPendingModel(name);
      return;
    }
    setStore((prev) => ({
      ...prev,
      chats: prev.chats.map((c) => (c.id === activeChat.id ? { ...c, model: name } : c)),
    }));
  }

  function handleNewChat() {
    if (activeChat && activeChat.messages.length === 0) return;
    const chat = createChat(selectedModel);
    setStore((prev) => ({ chats: [chat, ...prev.chats], activeId: chat.id }));
  }

  function handleSelectChat(id) {
    setStore((prev) => ({ ...prev, activeId: id }));
  }

  function handleConfirmDelete() {
    const id = showDeleteConfirm;
    setStore((prev) => {
      const remaining = prev.chats.filter((c) => c.id !== id);
      let activeId = prev.activeId;
      if (activeId === id) {
        const sorted = [...remaining].sort((a, b) => b.updatedAt - a.updatedAt);
        activeId = sorted[0]?.id ?? null;
      }
      return { chats: remaining, activeId };
    });
    setShowDeleteConfirm(null);
  }

  async function handleSend(text) {
    if (!selectedModel) return;

    let chatId = activeChat?.id;
    const isFirstUserMessage = !activeChat || !activeChat.messages.some((m) => m.role === "user");
    const priorMessages = activeChat?.messages ?? [];
    const history = [...priorMessages, { role: "user", content: text }];
    const now = Date.now();

    if (!chatId) {
      const chat = createChat(selectedModel);
      chatId = chat.id;
      setStore((prev) => ({
        chats: [
          {
            ...chat,
            title: titleFromMessage(text),
            messages: [...history, { role: "assistant", content: "" }],
            updatedAt: now,
          },
          ...prev.chats,
        ],
        activeId: chat.id,
      }));
    } else {
      setStore((prev) => ({
        ...prev,
        chats: prev.chats.map((c) =>
          c.id === chatId
            ? {
                ...c,
                title: isFirstUserMessage ? titleFromMessage(text) : c.title,
                messages: [...history, { role: "assistant", content: "" }],
                updatedAt: now,
              }
            : c
        ),
      }));
    }

    setIsStreaming(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const chatMessages = history.map(({ role, content }) => ({ role, content }));
      for await (const chunk of streamChat(selectedModel, chatMessages, controller.signal)) {
        setStore((prev) => ({
          ...prev,
          chats: prev.chats.map((c) => {
            if (c.id !== chatId) return c;
            const nextMessages = [...c.messages];
            const last = nextMessages[nextMessages.length - 1];
            nextMessages[nextMessages.length - 1] = { ...last, content: last.content + chunk };
            return { ...c, messages: nextMessages };
          }),
        }));
      }
    } catch {
      setStore((prev) => ({
        ...prev,
        chats: prev.chats.map((c) => {
          if (c.id !== chatId) return c;
          return {
            ...c,
            messages: [
              ...c.messages.slice(0, -1),
              {
                role: "error",
                content: "Could not reach Ollama. Is it running on localhost:11434?",
              },
            ],
          };
        }),
      }));
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        chats={store.chats}
        activeId={store.activeId}
        onSelect={handleSelectChat}
        onNew={handleNewChat}
        onDelete={(id) => setShowDeleteConfirm(id)}
      />

      <div className="chat-page">
        <header className="topbar">
          <h1 className="chat-title">Ollama Chat</h1>
          <ModelSelector
            models={models}
            selectedModel={selectedModel}
            onChange={handleModelChange}
            loadError={modelLoadError}
          />
        </header>

        <MessageList messages={activeChat?.messages ?? []} isStreaming={isStreaming} />

        <MessageInput onSend={handleSend} disabled={isStreaming || !selectedModel} />
      </div>

      {showDeleteConfirm && (
        <Modal onClose={() => setShowDeleteConfirm(null)}>
          <ConfirmDialog
            title="Delete this chat?"
            message="This will permanently delete the conversation. This can't be undone."
            confirmLabel="Delete"
            onConfirm={handleConfirmDelete}
            onCancel={() => setShowDeleteConfirm(null)}
          />
        </Modal>
      )}
    </div>
  );
}
