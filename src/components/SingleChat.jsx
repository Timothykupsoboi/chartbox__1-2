import { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../Context/ChatProvider";
import { ArrowLeft, Send, Image, Smile, MoreVertical } from "lucide-react";
import { toast } from "react-hot-toast";
import io from "socket.io-client";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast.error("Failed to Load the Messages");
    }
  };

  const sendMessage = async (event) => {
    if ((event.key === "Enter" || event.type === "click") && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast.error("Failed to send the Message");
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  return (
    <>
      {selectedChat ? (
        <>
          <div className="chat-header glass">
            <button className="back-btn" onClick={() => setSelectedChat("")}>
              <ArrowLeft size={24} />
            </button>
            <div className="header-info">
              <p className="chat-name">
                {!selectedChat.isGroupChat
                  ? getSender(user, selectedChat.users)
                  : selectedChat.chatName.toUpperCase()}
              </p>
              <p className="online-status">Online</p>
            </div>
            <button className="header-options">
               <MoreVertical size={20} />
            </button>
          </div>

          <div className="messages-container">
            {loading ? (
              <div className="loader">Loading Messages...</div>
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            {istyping ? (
              <div className="typing-indicator">
                <Lottie
                  options={defaultOptions}
                  width={70}
                  style={{ marginBottom: 15, marginLeft: 0 }}
                />
              </div>
            ) : (
              <></>
            )}

            <div className="input-area glass">
              <button className="input-action">
                <Smile size={24} />
              </button>
              <button className="input-action">
                <Image size={24} />
              </button>
              <input
                className="message-input"
                placeholder="Type a message..."
                onChange={typingHandler}
                value={newMessage}
                onKeyDown={sendMessage}
              />
              <button className="send-btn" onClick={sendMessage}>
                <Send size={24} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="no-chat-selected">
          <div className="welcome-box">
             <h2 className="welcome-logo">ChartBox</h2>
             <p>Select a user to start chatting</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .chat-header {
          display: flex;
          align-items: center;
          padding: 10px 20px;
          height: 70px;
          gap: 15px;
        }
        .back-btn { background: transparent; color: var(--text-primary); display: none; }
        .header-info { flex: 1; }
        .chat-name { font-weight: 600; font-size: 1.1rem; }
        .online-status { font-size: 0.8rem; color: var(--primary-teal); }
        .header-options { background: transparent; color: var(--text-secondary); }

        .messages-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 20px;
          background-image: url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png");
          background-blend-mode: overlay;
          background-color: var(--dark-bg);
          overflow: hidden;
        }
        .messages { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
        .loader { margin: auto; }
        
        .input-area {
          display: flex;
          align-items: center;
          padding: 10px 15px;
          gap: 15px;
          margin-top: 20px;
          border-radius: 12px;
        }
        .input-action { background: transparent; color: var(--text-secondary); }
        .message-input { flex: 1; height: 45px; background: rgba(255,255,255,0.05); }
        .send-btn { 
          background: var(--primary-teal); 
          color: white; 
          width: 45px; 
          height: 45px; 
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .no-chat-selected {
           height: 100%;
           display: flex;
           align-items: center;
           justify-content: center;
           text-align: center;
        }
        .welcome-logo {
          font-size: 3rem;
          margin-bottom: 20px;
          background: linear-gradient(to right, #00a884, #53bdeb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @media (max-width: 768px) {
          .back-btn { display: block; }
        }
      `}</style>
    </>
  );
};

export default SingleChat;
