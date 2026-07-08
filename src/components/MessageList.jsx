import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TypingIndicator from "./TypingIndicator";

export default function MessageList({ messages, isStreaming }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, isStreaming]);

  return (
    <div className="message-list">
      {messages.length === 0 && (
        <p className="message-list-empty">
          Send a message to start chatting with your local Ollama model.
        </p>
      )}
      {messages.map((message, index) => {
        const isLast = index === messages.length - 1;
        const showTyping =
          isLast && isStreaming && message.role === "assistant" && !message.content;

        return (
          <div key={index} className={`message message-${message.role}`}>
            {showTyping ? (
              <TypingIndicator />
            ) : message.role === "assistant" ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            ) : (
              message.content
            )}
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}
