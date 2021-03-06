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

  const [fileTableData, setFileTableData] = useState([]);
  const [routeTableData, setRouteTableData] = useState([]);

  const [showRouteModal, setShowRouteModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [hideTables, setHideTables] = useState(false);

  const [routeModalContent, setRouteModalContent] = useState("");
  const [fileModalContent, setFileModalContent] = useState("");

  const [visualizeAllRoutes, setVisualizeAllRoutes] = useState();
  const [addFileRoutes, setAddFileRoutes] = useState(false);
  const [removeFileRoutes, setRemoveFileRoutes] = useState(false);
  const [addRoute, setAddRoute] = useState(false);
  const [removeRoute, setRemoveRoute] = useState(false);
  const [showRouteDetails, setShowRouteDetails] = useState(false);
  const [hideRouteDetails, setHideRouteDetails] = useState(false);
  const [zoomRoute, setZoomRoute] = useState(false);

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

  const getFileRoutes = async (file_id) => {
    const response = await fetch(`http://localhost:8000/api/${file_id}/routes`);
    const result = await response.json();
    setAddFileRoutes(result);
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

  const handleVisualizeButton = () => {
    if (visualizeAllRoutes) {
      setHideTables(false);
      setVisualizeAllRoutes(false);
    } else {
      setHideTables(true);
      setVisualizeAllRoutes(routeTableData);
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
            removeFileRoutes={() => setRemoveFileRoutes(true)}
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
            visualizeAllRoutes={() => {
              handleVisualizeButton();
            }}
          />
        </div>
        <div className={"dashboard__section"}>
          <div
            className={
              hideTables
                ? "dashboard__section--hide"
                : "dashboard__section--left"
            }
          >
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
              zoomRoute={(route) => setZoomRoute(route)}
            />
            <FileTable
              toggleModal={(content) => {
                setShowFileModal(!showFileModal);
                setFileModalContent(content);
                // TODO: call getFileRoutes
              }}
              fileData={fileTableData}
              showFileRoutes={(file) => {
                getFileRoutes(file.id);
                setRemoveFileRoutes(false);
              }}
            />
          </div>
          <div
            className={
              visualizeAllRoutes
                ? "dashboard__visualizeAll"
                : "dashboard__section--right"
            }
          >
            <MapApp
              addRoute={addRoute}
              removeRoute={removeRoute}
              showRoute={showRouteDetails}
              hideRoute={hideRouteDetails}
              zoomRoute={zoomRoute}
              addFileRoutes={addFileRoutes}
              removeFileRoutes={removeFileRoutes}
              visualizeAllRoutes={visualizeAllRoutes}
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
