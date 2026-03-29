import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Signup = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast.error("Please fill all the fields");
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast.error("Passwords do not match");
      setPicLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      toast.success("Registration Successful");
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      navigate("/chats");
    } catch (error) {
      toast.error(error.response.data.message || "Error Occured!");
      setPicLoading(false);
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast.error("Please select an image");
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chart-box");
      data.append("cloud_name", "your_cloud_id");
      fetch("https://api.cloudinary.com/v1_1/your_cloud_id/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.url) {
            setPic(data.url.toString());
          } else {
            console.warn("Cloudinary Upload Result:", data);
            setPic("https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg");
          }
          setPicLoading(false);
        })
        .catch((err) => {
          console.error("Cloudinary Upload Error:", err);
          toast.error("Image upload failed, using default.");
          setPic("https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg");
          setPicLoading(false);
        });
    } else {
      toast.error("Please select an image (JPEG/PNG)");
      setPicLoading(false);
      return;
    }
  };

  return (
    <div className="signup-form">
      <input
        placeholder="Enter Your Name"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Enter Your Email Address"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="password-input">
        <input
          placeholder="Enter Password"
          type={show ? "text" : "password"}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="show-btn" onClick={handleClick}>
          {show ? "Hide" : "Show"}
        </button>
      </div>
      <input
        placeholder="Confirm Password"
        type={show ? "text" : "password"}
        onChange={(e) => setConfirmpassword(e.target.value)}
      />
      <div className="file-input">
        <label>Upload Profile Picture</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </div>
      <button
        className="submit-btn"
        onClick={submitHandler}
        disabled={picLoading}
      >
        {picLoading ? "Please wait..." : "Sign Up"}
      </button>

      <style jsx>{`
        .signup-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        input {
          width: 100%;
          padding: 12px;
          font-size: 0.95rem;
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
        .file-input {
          text-align: left;
          background: var(--dark-hover);
          padding: 10px;
          border-radius: 8px;
        }
        .file-input label {
          display: block;
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 5px;
        }
        .submit-btn {
          background: var(--primary-teal);
          color: white;
          padding: 15px;
          font-size: 1.1rem;
          font-weight: 700;
          margin-top: 5px;
        }
        .submit-btn:hover {
          background: var(--secondary-teal);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default Signup;
