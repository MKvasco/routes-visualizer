import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./styles/Dashboard.css";

// Components

import UploadForm from "../components/UploadForm/UploadForm";
import MapApp from "../components/Map/MapApp";
import FileTable from "../components/FileTable/FileTable";
import RouteTable from "../components/RouteTable/RouteTable";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import Modal from "../components/Modal/Modal";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [modalContent, setModalContent] = useState("");

  useEffect(() => {
    document.body.style = `background: var(--background-color)`;
    const fetchUser = async () => {
      const response = await fetch("http://localhost:8000/api/user", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const content = await response.json();
      if (content.detail) setRedirect(true);
      if (content.name) setUser(content.name);
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

  if (redirect) return setTimeout(() => navigate("/", { replace: true }), 1);

  return (
    <>
      <div className="dashboard__body">
        {modalActive && (
          <Modal
            content={modalContent}
            toggleModal={() => {
              setModalActive(!modalActive);
            }}
          />
        )}
        <div className="dashboard__nav">
          <NavBar logout={logout} user={user} />
        </div>
        <div className="dashboard__section">
          <div className="dashboard__section--left">
            <UploadForm />
            <FileTable
              toggleModal={(content) => {
                setModalActive(!modalActive);
                setModalContent(content);
              }}
            />
            <RouteTable
              toggleModal={(content) => {
                setModalActive(!modalActive);
                setModalContent(content);
              }}
            />
          </div>
          <div className="dashboard__section--right">
            <MapApp />
          </div>
        </div>
        <div className="dashboard__footer">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
