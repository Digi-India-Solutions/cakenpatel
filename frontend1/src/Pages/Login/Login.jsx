import React, { useState } from "react";
import "./login.css";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [isActive, setIsActive] = useState(false);

  // Login States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register States
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [referralCodeUsed, setReferralCodeUsed] = useState("")

  const handleRegisterClick = () => setIsActive(true);
  const handleLoginClick = () => setIsActive(false);

  // ================= LOGIN =================
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://api.cakenpetals.com/api/user/login",
        {
          email: loginEmail,
          password: loginPassword,
        }
      );

      if (response.status === 200) {
        sessionStorage.setItem("login", true);
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("userId", response.data.data._id);
        sessionStorage.setItem("userData", JSON.stringify(response?.data?.data));

        Swal.fire({
          title: "Login Successful!",
          text: "Welcome back!",
          icon: "success",
        });
        // console.log("XXXXXXXXXXSSSSSSS::=>", response)
        window.location.href = "/";
      }
    } catch (error) {
      Swal.fire({
        title: "Login Failed!",
        text:
          error.response?.data?.message ||
          "Invalid email or password.",
        icon: "error",
      });
    }
  };

  // ================= REGISTER =================
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://api.cakenpetals.com/api/user", {
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        referralCodeUsed: referralCodeUsed
      });

      Swal.fire({
        title: "Registration Successful!",
        text: "You can now log in.",
        icon: "success",
      });

      setIsActive(false);
    } catch (error) {
      Swal.fire({
        title: "Registration Failed!",
        text:
          error.response?.data?.message ||
          "Something went wrong.",
        icon: "error",
      });
    }
  };

  return (
    <div className="container-fluid">
      <div className={`Login_container ${isActive ? "active" : ""}`}>

        {/* ================= LOGIN FORM ================= */}
        <div className="form-box login">
          <form onSubmit={handleLoginSubmit}>
            <h1>Login</h1>

            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-box">
              <input
                type={showLoginPassword ? "text" : "password"}
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />

              {loginPassword && (
                <span
                  className="eye-icon"
                  onClick={() =>
                    setShowLoginPassword(!showLoginPassword)
                  }
                >
                  {showLoginPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </span>
              )}
            </div>

            <button type="submit" className="btnLogin">
              Login
            </button>
          </form>
        </div>

        {/* ================= REGISTER FORM ================= */}
        <div className="form-box register">
          <form onSubmit={handleRegisterSubmit}>
            <h1>Registration</h1>

            <div className="input-box">
              <input type="text" placeholder="Name" value={registerName} onChange={(e) => setRegisterName(e.target.value)} required />
            </div>

            <div className="input-box">
              <input type="email" placeholder="Email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required />
            </div>

            <div className="input-box">
              <input
                type={showRegisterPassword ? "text" : "password"}
                placeholder="Password"
                value={registerPassword}
                onChange={(e) =>
                  setRegisterPassword(e.target.value)
                }
                required
              />

              {registerPassword && (
                <span
                  className="eye-icon"
                  onClick={() =>
                    setShowRegisterPassword(
                      !showRegisterPassword
                    )
                  }
                >
                  {showRegisterPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </span>
              )}
            </div>

            <div className="input-box">
              <input type="text" placeholder="Ref code" value={referralCodeUsed} onChange={(e) => setReferralCodeUsed(e.target.value)} />
            </div>

            <button type="submit" className="btnLogin">
              Register
            </button>
          </form>
        </div>

        {/* ================= TOGGLE SECTION ================= */}
        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Hello, Welcome!</h1>
            <p>Don't have an account?</p>
            <button
              className="btn register-btn"
              onClick={handleRegisterClick}
            >
              Register
            </button>
          </div>

          <div className="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button
              className="btn login-btn"
              onClick={handleLoginClick}
            >
              Login
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
