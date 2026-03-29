import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import { Search, Bell, User, LogOut, ChevronDown } from "lucide-react";
import ProfileModal from "./ProfileModal";
import { toast } from "react-hot-toast";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast.error("Please enter something in search");
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error("Failed to Load the Search Results");
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      setIsDrawerOpen(false);
    } catch (error) {
      toast.error("Error fetching the chat");
    }
  };

  return (
    <>
      <div className="header glass">
        <button className="search-trigger" onClick={() => setIsDrawerOpen(true)}>
          <Search size={20} />
          <span>Search User</span>
        </button>

        <h1 className="header-logo">ChartBox</h1>

        <div className="header-actions">
          <div className="notification-wrapper">
             <Bell size={24} className={notification.length > 0 ? 'unread' : ''} />
             {notification.length > 0 && <span className="badge">{notification.length}</span>}
          </div>

          <div className="user-menu">
            <div className="avatar-wrapper" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <img src={user.pic} alt={user.name} />
              <ChevronDown size={14} />
            </div>
            
            {isMenuOpen && (
              <div className="dropdown glass">
                <button onClick={() => setIsMenuOpen(false)}>My Profile</button>
                <div className="divider"></div>
                <button onClick={logoutHandler} className="logout-btn">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div className="drawer glass" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h2>Search Users</h2>
              <button onClick={() => setIsDrawerOpen(false)}>&times;</button>
            </div>
            <div className="drawer-search">
              <input 
                placeholder="Search by name or email" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button onClick={handleSearch}>Go</button>
            </div>
            <div className="drawer-results">
              {loading ? (
                <div className="loading">Searching...</div>
              ) : (
                searchResult?.map((u) => (
                  <div key={u._id} className="user-item" onClick={() => accessChat(u._id)}>
                    <img src={u.pic} alt={u.name} />
                    <div className="user-info">
                      <p className="name">{u.name}</p>
                      <p className="email">{u.email}</p>
                    </div>
                  </div>
                ))
              )}
              {loadingChat && <div className="loading-chat">Loading Chat...</div>}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;
          height: 70px;
        }
        .search-trigger {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--dark-hover);
          padding: 8px 15px;
          color: var(--text-secondary);
        }
        .search-trigger:hover {
          background: #3a4b56;
        }
        .header-logo {
          font-weight: 700;
          letter-spacing: 1px;
          background: linear-gradient(to right, #00a884, #53bdeb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .notification-wrapper {
          position: relative;
          cursor: pointer;
        }
        .badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ff3b30;
          color: white;
          font-size: 10px;
          padding: 2px 5px;
          border-radius: 50%;
        }
        .user-menu {
          position: relative;
        }
        .avatar-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .avatar-wrapper img {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          object-fit: cover;
        }
        .dropdown {
          position: absolute;
          right: 0;
          top: 45px;
          width: 150px;
          border-radius: 12px;
          overflow: hidden;
          z-index: 100;
        }
        .dropdown button {
          width: 100%;
          text-align: left;
           padding: 12px 15px;
           background: transparent;
           color: var(--text-primary);
           font-size: 0.9rem;
        }
        .dropdown button:hover {
          background: var(--dark-hover);
        }
        .logout-btn {
          color: #ff3b30 !important;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .divider {
          height: 1px;
          background: var(--glass-border);
        }

        /* Drawer Styles */
        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.5);
          z-index: 1000;
        }
        .drawer {
          position: absolute;
          top: 0;
          left: 0;
          width: 350px;
          height: 100%;
          background: var(--dark-sidebar);
          padding: 20px;
          display: flex;
          flex-direction: column;
        }
        .drawer-header {
           display: flex;
           justify-content: space-between;
           margin-bottom: 20px;
        }
        .drawer-header h2 { font-size: 1.2rem; }
        .drawer-header button { background: transparent; font-size: 1.5rem; color: var(--text-secondary); }
        .drawer-search {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        .drawer-search input { flex: 1; height: 40px; }
        .drawer-search button { background: var(--primary-teal); color: white; padding: 0 15px; }
        
        .user-item {
          display: flex;
          padding: 12px;
          gap: 15px;
          cursor: pointer;
          border-radius: 10px;
          margin-bottom: 10px;
          transition: background 0.2s;
        }
        .user-item:hover { background: var(--dark-hover); }
        .user-item img { width: 45px; height: 45px; border-radius: 50%; }
        .user-info .name { font-weight: 600; font-size: 0.95rem; }
        .user-info .email { font-size: 0.8rem; color: var(--text-secondary); }
      `}</style>
    </>
  );
}

export default SideDrawer;
