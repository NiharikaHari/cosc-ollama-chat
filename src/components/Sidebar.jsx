import ChatListItem from "./ChatListItem";

export default function Sidebar({ chats, activeId, onSelect, onNew, onDelete }) {
  const sortedChats = [...chats].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <aside className="sidebar">
      <button type="button" className="new-chat-button" onClick={onNew}>
        + New chat
      </button>

      <div className="chat-list">
        {sortedChats.length === 0 && <p className="chat-list-empty">No chats yet</p>}
        {sortedChats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            isActive={chat.id === activeId}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))}
      </div>
    </aside>
  );
}
