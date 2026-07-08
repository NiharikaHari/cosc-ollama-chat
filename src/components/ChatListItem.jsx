export default function ChatListItem({ chat, isActive, onSelect, onDelete }) {
  return (
    <div
      className={`chat-list-item${isActive ? " chat-list-item-active" : ""}`}
      onClick={() => onSelect(chat.id)}
      title={chat.title}
    >
      <span className="chat-list-item-title">{chat.title}</span>
      <button
        type="button"
        className="chat-list-item-delete"
        aria-label="Delete chat"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(chat.id);
        }}
      >
        ×
      </button>
    </div>
  );
}
