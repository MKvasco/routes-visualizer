import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./styles/register.css";

const Register = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(false);
  const navigatee = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    //Register
    const registerResponse = await fetch("http://localhost:8000/api/register", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    });
    const registerResult = await registerResponse.json();
    if (registerResponse.status == 400) {
      setRedirect(false);
      if (registerResult.email)
        setError("User with this email address already exists!");
    } else {
      await fetch("http://localhost:8000/api/login", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      setError(false);
      setRedirect(true);
    }
  };

  if (redirect) setTimeout(() => navigatee("/dashboard"), 50);

  return (
    <>
      <div className="registerForm--formContainer">
        <h1>Registration Form</h1>
        <form onSubmit={submit}>
          <div className="registerForm--registerContainer">
            <input
              placeholder="First Name"
              required
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email Address"
              autoComplete="username"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              autoComplete="new-password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              autoComplete="new-password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Submit</button>
            {error && <p className="registerForm__error">{error}</p>}
            <p>
              Already registered? Click{" "}
              <a onClick={() => props.toggleFlag()}>here</a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
