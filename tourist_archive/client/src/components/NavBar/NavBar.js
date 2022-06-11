import React from "react";
import { useNavigate } from "react-router-dom";

import "./NavBar.css";

const NavBar = (props) => {
  const navigate = useNavigate();

  const userLogout = async () => {
    await fetch("http://localhost:8000/api/logout", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    navigate("/");
  };

  return (
    <>
      <div className="nav__main">
        <div className="nav__main__controls">
          <button onClick={() => console.log("visualise all")}>
            Visualise
          </button>
          <button onClick={() => props.showUploadModal()}>Upload</button>
          <button onClick={userLogout}>Logout</button>
        </div>
      </div>
    </>
  );
};

export default NavBar;
