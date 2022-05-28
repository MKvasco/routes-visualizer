import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Css import
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();

  const redirectToRegister = () => {
    navigate("/register", { replace: true });
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:8000/api/login", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    setRedirect(true);
  };

  if (redirect) navigate("/home");

  return (
    <>
      <div className="loginForm--formContainer">
        <form onSubmit={submitLogin}>
          <div className="loginForm--loginContainer">
            <input
              type="email"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Login</button>
          </div>
        </form>
        <div className="loginForm--registerContainer">
          <p>Don't have an account?</p>
          <button
            className="loginForm--registerButton"
            onClick={redirectToRegister}
          >
            Register
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
