// React dependencies
import React from "react";
import { render } from "react-dom";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

// Pages
import { Intro, Home } from "./pages";

// Css
import "./index.css";

const rootContainer = document.getElementById("root");
const root = createRoot(rootContainer);
root.render(
  <>
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  </>
);
