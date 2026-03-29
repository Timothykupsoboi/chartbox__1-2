import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Login = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast.error("Please fill all the fields");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      toast.success("Login Successful");
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast.error(error.response.data.message || "Error Occured!");
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      <input
        placeholder="Enter Your Email Address"
        onChange={(e) => setEmail(e.target.value)}
        type="email"
      />
      <div className="password-input">
        <input
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
          type={show ? "text" : "password"}
        />
        <button className="show-btn" onClick={handleClick}>
          {show ? "Hide" : "Show"}
        </button>
      </div>
      <button className="submit-btn" onClick={submitHandler} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      <style jsx>{`
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        input {
          width: 100%;
          padding: 15px;
          font-size: 1rem;
        }
        .password-input {
          position: relative;
          width: 100%;
        }
        .show-btn {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          color: var(--primary-teal);
          font-size: 0.8rem;
          font-weight: 600;
        }
        .submit-btn {
          background: var(--primary-teal);
          color: white;
          padding: 15px;
          font-size: 1.1rem;
          font-weight: 700;
          margin-top: 10px;
        }
        .submit-btn:hover {
          background: var(--secondary-teal);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default Login;
