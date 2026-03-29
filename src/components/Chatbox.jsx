import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <div className={`chat-box-container glass ${!selectedChat ? 'hide-on-mobile' : ''}`}>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />

      <style jsx>{`
        .chat-box-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          border-radius: 12px;
          overflow: hidden;
          background: var(--dark-sidebar);
        }

        @media (max-width: 768px) {
          .chat-box-container { flex: 1; }
          .hide-on-mobile { display: none; }
        }
      `}</style>
    </div>
  );
};

export default Chatbox;
