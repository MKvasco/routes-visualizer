import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import { Home, Dashboard, NotFound } from "./pages";

// Css
import "./index.css";

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("http://localhost:8000/api/user", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const content = await response.json();
      if (content.detail) setAuthenticated(false);
    };
    fetchUser();
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            exact
            element={
              <Home authenticated={(value) => setAuthenticated(value)} />
            }
          />
          {authenticated && <Route path="/home" element={<Dashboard />} />}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
