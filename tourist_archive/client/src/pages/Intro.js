import React from "react";

// Css import
import "./styles/Intro.css";

//Components import
import Login from "../components/LoginForm/Login";
import Register from "../components/RegisterForm/Register";

const Intro = () => {
  return (
    <>
      <div className="loginFormContainer">
        <Login />
      </div>
      <div className="registerFormContainer">
        <Register />
      </div>
    </>
  );
};
export default Intro;
