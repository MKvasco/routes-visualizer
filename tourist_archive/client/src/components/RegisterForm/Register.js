import React, { useState } from "react";

import "./Register.css";

const Register = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:8000/api/register", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    });
  };

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
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Submit</button>
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
