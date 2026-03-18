// import React, { useState } from "react";
// import "./login.css";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const Login = () => {
//   const [isActive, setIsActive] = useState(false);

//   // Login States
//   const [loginEmail, setLoginEmail] = useState("");
//   const [loginPassword, setLoginPassword] = useState("");
//   const [showLoginPassword, setShowLoginPassword] = useState(false);

//   // Register States
//   const [registerName, setRegisterName] = useState("");
//   const [registerEmail, setRegisterEmail] = useState("");
//   const [registerPassword, setRegisterPassword] = useState("");
//   const [showRegisterPassword, setShowRegisterPassword] = useState(false);
//   const [referralCodeUsed, setReferralCodeUsed] = useState("")

//   const handleRegisterClick = () => setIsActive(true);
//   const handleLoginClick = () => setIsActive(false);

//   // ================= LOGIN =================
//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "https://api.cakenpetals.com/api/user/login",
//         {
//           email: loginEmail,
//           password: loginPassword,
//         }
//       );

//       if (response.status === 200) {
//         sessionStorage.setItem("login", true);
//         sessionStorage.setItem("token", response.data.token);
//         sessionStorage.setItem("userId", response.data.data._id);
//         sessionStorage.setItem("userData", JSON.stringify(response?.data?.data));

//         Swal.fire({
//           title: "Login Successful!",
//           text: "Welcome back!",
//           icon: "success",
//         });
//         // console.log("XXXXXXXXXXSSSSSSS::=>", response)
//         window.location.href = "/";
//       }
//     } catch (error) {
//       Swal.fire({
//         title: "Login Failed!",
//         text:
//           error.response?.data?.message ||
//           "Invalid email or password.",
//         icon: "error",
//       });
//     }
//   };

//   // ================= REGISTER =================
//   const handleRegisterSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await axios.post("https://api.cakenpetals.com/api/user", {
//         name: registerName,
//         email: registerEmail,
//         password: registerPassword,
//         referralCodeUsed: referralCodeUsed
//       });

//       Swal.fire({
//         title: "Registration Successful!",
//         text: "You can now log in.",
//         icon: "success",
//       });

//       setIsActive(false);
//     } catch (error) {
//       Swal.fire({
//         title: "Registration Failed!",
//         text:
//           error.response?.data?.message ||
//           "Something went wrong.",
//         icon: "error",
//       });
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className={`Login_container ${isActive ? "active" : ""}`}>

//         {/* ================= LOGIN FORM ================= */}
//         <div className="form-box login">
//           <form onSubmit={handleLoginSubmit}>
//             <h1>Login</h1>

//             <div className="input-box">
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={loginEmail}
//                 onChange={(e) => setLoginEmail(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="input-box">
//               <input
//                 type={showLoginPassword ? "text" : "password"}
//                 placeholder="Password"
//                 value={loginPassword}
//                 onChange={(e) => setLoginPassword(e.target.value)}
//                 required
//               />

//               {loginPassword && (
//                 <span
//                   className="eye-icon"
//                   onClick={() =>
//                     setShowLoginPassword(!showLoginPassword)
//                   }
//                 >
//                   {showLoginPassword ? (
//                     <FaEyeSlash />
//                   ) : (
//                     <FaEye />
//                   )}
//                 </span>
//               )}
//             </div>

//             <button type="submit" className="btnLogin">
//               Login
//             </button>
//           </form>
//         </div>

//         {/* ================= REGISTER FORM ================= */}
//         <div className="form-box register">
//           <form onSubmit={handleRegisterSubmit}>
//             <h1>Registration</h1>

//             <div className="input-box">
//               <input type="text" placeholder="Name" value={registerName} onChange={(e) => setRegisterName(e.target.value)} required />
//             </div>

//             <div className="input-box">
//               <input type="email" placeholder="Email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required />
//             </div>

//             <div className="input-box">
//               <input
//                 type={showRegisterPassword ? "text" : "password"}
//                 placeholder="Password"
//                 value={registerPassword}
//                 onChange={(e) =>
//                   setRegisterPassword(e.target.value)
//                 }
//                 required
//               />

//               {registerPassword && (
//                 <span
//                   className="eye-icon"
//                   onClick={() =>
//                     setShowRegisterPassword(
//                       !showRegisterPassword
//                     )
//                   }
//                 >
//                   {showRegisterPassword ? (
//                     <FaEyeSlash />
//                   ) : (
//                     <FaEye />
//                   )}
//                 </span>
//               )}
//             </div>

//             <div className="input-box">
//               <input type="text" placeholder="Ref code" value={referralCodeUsed} onChange={(e) => setReferralCodeUsed(e.target.value)} />
//             </div>

//             <button type="submit" className="btnLogin">
//               Register
//             </button>
//           </form>
//         </div>

//         {/* ================= TOGGLE SECTION ================= */}
//         <div className="toggle-box">
//           <div className="toggle-panel toggle-left">
//             <h1>Hello, Welcome!</h1>
//             <p>Don't have an account?</p>
//             <button
//               className="btn register-btn"
//               onClick={handleRegisterClick}
//             >
//               Register
//             </button>
//           </div>

//           <div className="toggle-panel toggle-right">
//             <h1>Welcome Back!</h1>
//             <p>Already have an account?</p>
//             <button
//               className="btn login-btn"
//               onClick={handleLoginClick}
//             >
//               Login
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from "react";
import "./login.css";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const BASE_URL = "https://api.cakenpetals.com/api";
// const BASE_URL = "http://localhost:7000/api"

const Login = () => {
  const [isActive, setIsActive] = useState(false);

  // "login" | "forgot1" | "forgot2" | "forgot3"
  const [loginView, setLoginView] = useState("login");

  // ── Login States ──
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // ── Register States ──
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [referralCodeUsed, setReferralCodeUsed] = useState("");

  // ── Forgot Password States ──
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [showForgotNewPwd, setShowForgotNewPwd] = useState(false);
  const [showForgotConfirmPwd, setShowForgotConfirmPwd] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  // ── Toggle panel handlers ──
  const handleRegisterClick = () => setIsActive(true);
  const handleLoginClick = () => {
    setIsActive(false);
    setLoginView("login"); // reset forgot flow when switching back
  };

  // ── Back to login from forgot ──
  const backToLogin = () => {
    setLoginView("login");
    setForgotEmail("");
    setForgotOtp("");
    setForgotNewPassword("");
    setForgotConfirmPassword("");
  };

  // ================= LOGIN =================
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/user/login`, {
        email: loginEmail,
        password: loginPassword,
      });

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
        window.location.href = "/";
      }
    } catch (error) {
      Swal.fire({
        title: "Login Failed!",
        text: error.response?.data?.message || "Invalid email or password.",
        icon: "error",
      });
    }
  };

  // ================= REGISTER =================
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/user`, {
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        referralCodeUsed: referralCodeUsed,
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
        text: error.response?.data?.message || "Something went wrong.",
        icon: "error",
      });
    }
  };

  // ================= FORGOT — Step 1: Send OTP =================
  const handleForgotStep1 = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      await axios.post(`${BASE_URL}/user/forgetpassword1`, {
        email: forgotEmail,
      });
      Swal.fire({
        title: "OTP Sent!",
        text: "Please check your registered email for the OTP.",
        icon: "success",
      });
      setLoginView("forgot2");
    } catch (error) {
      Swal.fire({
        title: "Failed!",
        text: error.response?.data?.message || "User not found.",
        icon: "error",
      });
    } finally {
      setForgotLoading(false);
    }
  };

  // ================= FORGOT — Step 2: Verify OTP =================
  const handleForgotStep2 = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      await axios.post(`${BASE_URL}/user/forgetpassword2`, {
        email: forgotEmail,
        otp: forgotOtp,
      });
      Swal.fire({
        title: "OTP Verified!",
        text: "Now set your new password.",
        icon: "success",
      });
      setLoginView("forgot3");
    } catch (error) {
      Swal.fire({
        title: "Invalid OTP!",
        text: error.response?.data?.message || "The OTP entered is incorrect.",
        icon: "error",
      });
    } finally {
      setForgotLoading(false);
    }
  };

  // ================= FORGOT — Step 3: Reset Password =================
  const handleForgotStep3 = async (e) => {
    e.preventDefault();
    if (forgotNewPassword !== forgotConfirmPassword) {
      return Swal.fire({
        title: "Mismatch!",
        text: "Passwords do not match.",
        icon: "warning",
      });
    }
    setForgotLoading(true);
    try {
      await axios.post(`${BASE_URL}/user/forgetpassword3`, {
        email: forgotEmail,
        password: forgotNewPassword,
      });
      Swal.fire({
        title: "Password Reset!",
        text: "Your password has been updated. Please log in.",
        icon: "success",
      });
      backToLogin();
    } catch (error) {
      Swal.fire({
        title: "Reset Failed!",
        text: error.response?.data?.message || "Something went wrong.",
        icon: "error",
      });
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className={`Login_container ${isActive ? "active" : ""}`}>

        {/* ================= LOGIN FORM BOX ================= */}
        <div className="form-box login">

          {/* ── Normal Login ── */}
          {loginView === "login" && (
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
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                  >
                    {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                )}
              </div>

              {/* Forgot Password link — same styling, fits naturally */}
              <div className="forgot-password-link">
                <span onClick={() => setLoginView("forgot1")}>
                  Forgot Password?
                </span>
              </div>

              <button type="submit" className="btnLogin">
                Login
              </button>
            </form>
          )}

          {/* ── Forgot Step 1: Enter Email ── */}
          {loginView === "forgot1" && (
            <form onSubmit={handleForgotStep1}>
              <h1>Forgot Password</h1>
              <p className="forgot-subtitle">
                Enter your registered email to receive an OTP.
              </p>

              <div className="input-box">
                <input
                  type="email"
                  placeholder="Registered Email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btnLogin" disabled={forgotLoading}>
                {forgotLoading ? "Sending OTP..." : "Send OTP"}
              </button>

              <div className="forgot-back-link">
                <span onClick={backToLogin}>← Back to Login</span>
              </div>
            </form>
          )}

          {/* ── Forgot Step 2: Enter OTP ── */}
          {loginView === "forgot2" && (
            <form onSubmit={handleForgotStep2}>
              <h1>Verify OTP</h1>
              <p className="forgot-subtitle">
                OTP sent to <strong>{forgotEmail}</strong>
              </p>

              <div className="input-box">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={forgotOtp}
                  onChange={(e) =>
                    setForgotOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  required
                  maxLength={6}
                />
              </div>

              <button type="submit" className="btnLogin" disabled={forgotLoading}>
                {forgotLoading ? "Verifying..." : "Verify OTP"}
              </button>

              <div className="forgot-back-link">
                <span onClick={() => setLoginView("forgot1")}>
                  ← Resend OTP
                </span>
              </div>
            </form>
          )}

          {/* ── Forgot Step 3: New Password ── */}
          {loginView === "forgot3" && (
            <form onSubmit={handleForgotStep3}>
              <h1>Reset Password</h1>
              <p className="forgot-subtitle">Set your new password below.</p>

              <div className="input-box">
                <input
                  type={showForgotNewPwd ? "text" : "password"}
                  placeholder="New Password"
                  value={forgotNewPassword}
                  onChange={(e) => setForgotNewPassword(e.target.value)}
                  required
                />
                {forgotNewPassword && (
                  <span
                    className="eye-icon"
                    onClick={() => setShowForgotNewPwd(!showForgotNewPwd)}
                  >
                    {showForgotNewPwd ? <FaEyeSlash /> : <FaEye />}
                  </span>
                )}
              </div>

              <div className="input-box">
                <input
                  type={showForgotConfirmPwd ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={forgotConfirmPassword}
                  onChange={(e) => setForgotConfirmPassword(e.target.value)}
                  required
                />
                {forgotConfirmPassword && (
                  <span
                    className="eye-icon"
                    onClick={() => setShowForgotConfirmPwd(!showForgotConfirmPwd)}
                  >
                    {showForgotConfirmPwd ? <FaEyeSlash /> : <FaEye />}
                  </span>
                )}
              </div>

              {/* Inline mismatch warning */}
              {forgotNewPassword &&
                forgotConfirmPassword &&
                forgotNewPassword !== forgotConfirmPassword && (
                  <p className="password-mismatch-msg">⚠ Passwords do not match</p>
                )}

              <button type="submit" className="btnLogin" disabled={forgotLoading}>
                {forgotLoading ? "Resetting..." : "Reset Password"}
              </button>

              <div className="forgot-back-link">
                <span onClick={() => setLoginView("forgot2")}>← Back</span>
              </div>
            </form>
          )}
        </div>

        {/* ================= REGISTER FORM ================= */}
        <div className="form-box register">
          <form onSubmit={handleRegisterSubmit}>
            <h1>Registration</h1>

            <div className="input-box">
              <input
                type="text"
                placeholder="Name"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                required
              />
            </div>

            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-box">
              <input
                type={showRegisterPassword ? "text" : "password"}
                placeholder="Password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />
              {registerPassword && (
                <span
                  className="eye-icon"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                >
                  {showRegisterPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              )}
            </div>

            <div className="input-box">
              <input
                type="text"
                placeholder="Ref code"
                value={referralCodeUsed}
                onChange={(e) => setReferralCodeUsed(e.target.value)}
              />
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
            <button className="btn register-btn" onClick={handleRegisterClick}>
              Register
            </button>
          </div>

          <div className="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button className="btn login-btn" onClick={handleLoginClick}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;