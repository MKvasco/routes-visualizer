import React from "react";

import "./NavBar.css";

const NavBar = (props) => {
  return (
    <>
      <div className="nav__main">
        <div className="nav__main--left">
          <ul>
            <li>Item1</li>
            <li>Item2</li>
            <li>Item3</li>
          </ul>
        </div>
        <div className="nav__main--right">
          <p>Profile</p>
          <a>Logout</a>
        </div>
      </div>
    </>
  );
};

export default NavBar;
