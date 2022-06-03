import React, { useState, useEffect } from "react";

// Css import
import "./styles/Home.css";

//Components import
import Login from "../components/LoginForm/Login";
import Register from "../components/RegisterForm/Register";

const Home = () => {
  const [flag, setFlag] = useState(true);

  useEffect(() => {
    document.body.style = `background: url("../../../static/images/background_home_image.jpg") no-repeat
      center center fixed;
      background-size: cover;`;
  }, []);

  return (
    <>
      <div className={flag ? "loginFormContainer" : "loginFormContainer--hide"}>
        <Login toggleFlag={() => setFlag(!flag)} />
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
