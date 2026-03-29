import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { motion } from "framer-motion";

function HomePage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <div className="homepage-container">
      <div className="bg-gradient"></div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="auth-card glass"
      >
        <h1 className="logo">ChartBox</h1>
        <div className="tab-container">
          <button 
            className={isLogin ? 'active' : ''} 
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={!isLogin ? 'active' : ''} 
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>
        <div className="form-container">
          {isLogin ? <Login /> : <Signup />}
        </div>
      </motion.div>

      <style jsx>{`
        .homepage-container {
          height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .bg-gradient {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at top right, #00a884 0%, #111b21 50%);
          z-index: -1;
        }
        .auth-card {
          width: 450px;
          padding: 40px;
          border-radius: 20px;
          text-align: center;
        }
        .logo {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 30px;
          background: linear-gradient(to right, #00a884, #53bdeb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .tab-container {
          display: flex;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          margin-bottom: 30px;
          padding: 5px;
        }
        .tab-container button {
          flex: 1;
          padding: 12px;
          background: transparent;
          color: var(--text-secondary);
          font-weight: 600;
        }
        .tab-container button.active {
          background: var(--primary-teal);
          color: white;
        }
        .form-container {
          min-height: 300px;
        }
      `}</style>
    </div>
  );
}

export default HomePage;
