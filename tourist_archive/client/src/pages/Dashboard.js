import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./styles/Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState("");

  useEffect(() => {
    document.body.style = `background: none`;
    const fetchUser = async () => {
      const response = await fetch("http://localhost:8000/api/user", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const content = await response.json();
      setUser(content.name);
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
      <Link to="/" onClick={logout}>
        Logout
      </Link>
    </>
  );
};

export default Dashboard;
