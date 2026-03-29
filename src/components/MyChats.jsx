import { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../Context/ChatProvider";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to Load the chats");
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  const getSenderFull = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
  };

  return (
    <div className={`my-chats-container glass ${selectedChat ? 'hide-on-mobile' : ''}`}>
      <div className="chats-header">
        <h2>My Chats</h2>
        <button className="new-group-btn">
          <span>New Group Chat</span>
          <Plus size={18} />
        </button>
      </div>

      <div className="chats-list">
        {chats ? (
          chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              className={`chat-item ${selectedChat === chat ? 'selected' : ''}`}
            >
              <img 
                src={!chat.isGroupChat ? getSenderFull(loggedUser, chat.users).pic : "https://cdn-icons-png.flaticon.com/512/166/166258.png"} 
                alt="avatar" 
              />
              <div className="chat-info">
                <p className="chat-name">
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </p>
                {chat.latestMessage && (
                  <p className="latest-message">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="loading">Loading Chats...</div>
        )}
      </div>

      <style jsx>{`
        .my-chats-container {
          flex: 0 0 32%;
          display: flex;
          flex-direction: column;
          border-radius: 12px;
          overflow: hidden;
          background: var(--dark-sidebar);
        }
        .chats-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: rgba(255,255,255,0.02);
        }
        .chats-header h2 { font-size: 1.1rem; font-weight: 600; }
        .new-group-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: var(--dark-hover);
          color: var(--text-primary);
          padding: 8px 12px;
          font-size: 0.85rem;
        }
        .chats-list {
          flex: 1;
          overflow-y: scroll;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .chat-item {
          display: flex;
          padding: 12px;
          gap: 15px;
          cursor: pointer;
          border-radius: 10px;
          transition: background 0.2s;
        }
        .chat-item:hover { background: var(--dark-hover); }
        .chat-item.selected { background: var(--bubble-out); }
        .chat-item img { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; }
        .chat-info { flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .chat-name { font-weight: 600; font-size: 1rem; margin-bottom: 3px; }
        .latest-message { font-size: 0.8rem; color: var(--text-secondary); }

        @media (max-width: 768px) {
          .my-chats-container { flex: 1; }
          .hide-on-mobile { display: none; }
        }
      `}</style>
    </div>
  );
};

export default MyChats;
