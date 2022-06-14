import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./styles/Dashboard.css";

// Components

import MapApp from "../components/Map/MapApp";
import FileTable from "../components/Tables/FileTable";
import RouteTable from "../components/Tables/RouteTable";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import RouteModal from "../components/Modals/RouteModal";
import FileModal from "../components/Modals/FileModal";
import UploadModal from "../components/Modals/UploadModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [redirect, setRedirect] = useState(false);

  const [showRouteModal, setShowRouteModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [routeModalContent, setRouteModalContent] = useState("");
  const [fileModalContent, setFileModalContent] = useState("");

  const [routes, setRoutes] = useState([]);
  const [addRoute, setAddRoute] = useState(false);
  const [removeRoute, setRemoveRoute] = useState(false);
  const [showRouteDetails, setShowRouteDetails] = useState(false);
  const [hideRouteDetails, setHideRouteDetails] = useState(false);

  const [fileTableData, setFileTableData] = useState([]);
  const [routeTableData, setRouteTableData] = useState([]);

  useEffect(() => {
    document.body.style = `background: var(--base-color)`;
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

  useEffect(() => {
    const fetchRoutes = async () => {
      const response = await fetch("http://localhost:8000/api/user/routes");
      const content = await response.json();
      if (!content.detail) setRouteTableData(content["features"]);
    };
    fetchRoutes();
  }, []);

  useEffect(() => {
    const fetchFiles = async () => {
      const response = await fetch("http://localhost:8000/api/user/files");
      const content = await response.json();
      if (!content.detail) setFileTableData(content);
    };
    fetchFiles();
  }, []);

  //TODO: fetch routes from file id
  const getFileRoutes = async (content) => {
    const response = await fetch();
  };

  const handleCheckbox = (e, content) => {
    if (e.target.checked) {
      setAddRoute(content);
      setRemoveRoute(false);
    } else {
      setRemoveRoute(content);
      setAddRoute(false);
    }
  };

  const visualizeAllRoutes = () => {
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
            routesData={routeTableData}
            updateRoutesData={(newRouteTableData, newRouteData) => {
              setRouteTableData(newRouteTableData);
              setShowRouteDetails(newRouteData);
            }}
            toggleModal={() => {
              setShowRouteModal(!showRouteModal);
              setHideRouteDetails(routeModalContent);
              setShowRouteDetails(false);
            }}
          />
        )}
        {showFileModal && (
          <FileModal
            content={fileModalContent}
            toggleModal={() => setShowFileModal(!showFileModal)}
            deleteDataFromTables={(deletedFile, deletedRoutes) => {
              setFileTableData(
                fileTableData.filter((file) => file.id != deletedFile.id)
              );

              // Update deleted routes after file delete (delete cascade set)
              let updatedRouteTableData = [];
              routeTableData.forEach((route) => {
                let flag = false;
                deletedRoutes.features.forEach((deletedRoute) => {
                  if (route.id == deletedRoute.id) flag = true;
                });
                if (!flag) updatedRouteTableData.push(route);
              });

              setRouteTableData(updatedRouteTableData);
            }}
          />
        )}
        {showUploadModal && (
          <UploadModal
            hideUploadModal={() => setShowUploadModal(!showUploadModal)}
            setTableData={(fileData, routeData) => {
              setFileTableData((oldData) => [...oldData, fileData]);
              routeData.forEach((route) =>
                setRouteTableData((oldData) => [...oldData, route])
              );
            }}
          />
        )}
        <div className="dashboard__nav">
          <NavBar
            showUploadModal={() => setShowUploadModal(!showUploadModal)}
          />
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
              handleCheckbox={(e, content, index) => {
                handleCheckbox(e, content, index);
              }}
              routeData={routeTableData}
            />
            <FileTable
              toggleModal={(content) => {
                setShowFileModal(!showFileModal);
                setFileModalContent(content);
                //TODO: call getFileRoutes
              }}
              fileData={fileTableData}
            />
          </div>
          <div className="dashboard__section--right">
            <MapApp
              //UPDATE route after change of width or color
              addRoute={addRoute}
              removeRoute={removeRoute}
              showRoute={showRouteDetails}
              hideRoute={hideRouteDetails}
              showRoutes={routes}
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
