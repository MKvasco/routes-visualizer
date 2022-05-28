import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

import "./styles/Home.css";

const Home = () => {
  const [user, setUser] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("http://localhost:8000/api/user", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const content = await response.json();
      setUser(content.name);
      console.log(content);
    };
    fetchUser();
  }, []);

  const logout = async () => {
    await fetch("http://localhost:8000/api/logout", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
  };

  return (
    <>
      <div>Welcome, {user}!</div>
      <Link to="/login" onClick={logout}>
        Logout
      </Link>
    </>
  );
};

export default Home;
