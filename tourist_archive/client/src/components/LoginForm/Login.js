import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Css import
import "./Login.css";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [wrongEmail, setWrongEmail] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);
  const navigate = useNavigate();

  const submitLogin = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/api/login", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const content = await response.json();
    if (content.token) {
      setRedirect(true);
    }
    if (content.detail == "User not found!") {
      setWrongEmail(true);
      setWrongPassword(false);
    }
    if (content.detail == "Incorrect password!") {
      setWrongPassword(true);
      setWrongEmail(false);
    }
  };

  if (redirect) setTimeout(() => navigate("/dashboard"), 1);

  return (
    <>
      <div className="loginForm--formContainer">
        <form onSubmit={submitLogin}>
          <div className="loginForm--loginContainer">
            <input
              type="email"
              placeholder="Email"
              autoComplete="username"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p
              className={
                wrongEmail
                  ? "loginForm__wrongCredentials"
                  : "loginForm--displayNone"
              }
            >
              You have entered wrong email address!
            </p>

            <input
              type="password"
              placeholder="Password"
              autoComplete="scurrent-password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p
              className={
                wrongPassword
                  ? "loginForm__wrongCredentials"
                  : "loginForm--displayNone"
              }
            >
              Your have entered wrong password!
            </p>

            <button type="submit">Login</button>
          </div>
        </form>
        <div className="loginForm--registerContainer">
          <p>Don't have an account?</p>
          <button
            className="loginForm--registerButton"
            onClick={() => props.toggleFlag()}
          >
            Register
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
