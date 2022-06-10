import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./styles/Dashboard.css";

// Components

import UploadForm from "../components/Forms/Upload";
import MapApp from "../components/Map/MapApp";
import FileTable from "../components/Tables/FileTable";
import RouteTable from "../components/Tables/RouteTable";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import RouteModal from "../components/Modals/RouteModal";
import FileModal from "../components/Modals/FileModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [toggleUpdate, setToggleUpdate] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [routeModalContent, setRouteModalContent] = useState("");
  const [fileModalContent, setFileModalContent] = useState("");
  const [showRouteDetails, setShowRouteDetails] = useState(false);
  const [hideRouteDetails, setHideRouteDetails] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [removeRoute, setRemoveRoute] = useState(false);
  const [showFileRoutes, setShowFileRoutes] = useState(false);

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

  //TODO: fetch routes from file id
  const getFileRoutes = async (content) => {
    const response = await fetch();
  };

  const logout = async () => {
    await fetch("http://localhost:8000/api/logout", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
  };

  const handleCheckbox = (e, content) => {
    if (e.target.checked) {
      setRoutes((oldArray) => [...oldArray, content]);
    } else {
      setRoutes(routes.filter((route) => route.id != content.id));
    }
  };

  if (redirect) return setTimeout(() => navigate("/", { replace: true }), 1);

  return (
    <>
      <div className="dashboard__body">
        {showRouteModal && (
          <RouteModal
            content={routeModalContent}
            toggleModal={() => {
              setShowRouteModal(!showRouteModal);
              setHideRouteDetails(routeModalContent);
              setShowRouteDetails(false);
            }}
            toggleUpdate={() => setToggleUpdate(!toggleUpdate)}
          />
        )}
        {showFileModal && (
          <FileModal
            content={fileModalContent}
            toggleModal={() => setShowFileModal(!showFileModal)}
            toggleUpdate={() => setToggleUpdate(!toggleUpdate)}
          />
        )}
        <div className="dashboard__nav">
          <NavBar logout={logout} user={user} />
        </div>
        <div className="dashboard__section">
          <div className="dashboard__section--left">
            <RouteTable
              toggleModal={(content) => {
                setShowRouteModal(!showRouteModal);
                setRouteModalContent(content);
                setShowRouteDetails(content);
                setHideRouteDetails(false);
              }}
              addRoute={(e, content, index) => {
                handleCheckbox(e, content, index);
              }}
              toggleUpdate={toggleUpdate}
            />
            <FileTable
              toggleModal={(content) => {
                setShowFileModal(!showFileModal);
                setFileModalContent(content);
                //TODO: call getFileRoutes
              }}
              toggleUpdate={toggleUpdate}
            />
            <UploadForm />
          </div>
          <div className="dashboard__section--right">
            <MapApp
              showRoute={showRouteDetails}
              hideRoute={hideRouteDetails}
              addRoutes={routes}
              removeRoute={removeRoute}
            />
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
