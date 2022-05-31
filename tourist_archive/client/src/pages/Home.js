import React, { useState, useEffect } from "react";

// Css import
import "./styles/Home.css";

//Components import
import Login from "../components/LoginForm/Login";
import Register from "../components/RegisterForm/Register";

const Home = (props) => {
  useEffect(() => {
    document.body.style = `background: url("../../../static/images/background_home_image.jpg") no-repeat
      center center fixed;
      background-size: cover;`;
  }, []);
  const [flag, setFlag] = useState(true);

  return (
    <>
      <div className={flag ? "loginFormContainer" : "loginFormContainer--hide"}>
        <Login
          authenticated={(value) => props.authenticated(value)}
          toggleFlag={() => setFlag(!flag)}
        />
      </div>
      <div
        className={
          flag ? "registerFormContainer--hide" : "registerFormContainer"
        }
      >
        <Register toggleFlag={() => setFlag(!flag)} />
      </div>
    </>
  );
};
export default Home;
