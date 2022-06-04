import React, { useState, useEffect } from "react";

import "./tables.css";

const RouteTable = (props) => {
  const [routeData, setRouteData] = useState(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      const response = await fetch("http://localhost:8000/api/user/routes");
      const content = await response.json();
      if (!content.detail) setRouteData(content);
    };
    fetchRoutes();
  }, [props.toggleUpdate]);

  const formatDate = (date) => {
    let localDate = new Date(date);
    return localDate.toLocaleString();
  };

  return (
    <>
      <h1>Routes</h1>
      <button>Visualize all routes</button>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Route name</th>
            <th>Date</th>
            <th>Points</th>
            <th>Details</th>
            <th>Visualise</th>
          </tr>
        </thead>
        <tbody>
          {routeData &&
            routeData["features"].map((route) => (
              <tr key={route["id"]}>
                <td>
                  {route["properties"]["title"]
                    ? route["properties"]["title"]
                    : "Update title!"}
                </td>
                <td>
                  {route["properties"]["descritption"]
                    ? route["properties"]["descritption"]
                    : "Update description!"}
                </td>
                <td>
                  {route["properties"]["route_name"]
                    ? route["properties"]["route_name"]
                    : ""}
                </td>
                <td>{formatDate(route["properties"]["created_at"])}</td>
                <td>{route["geometry"]["coordinates"].length}</td>
                <td>
                  <button onClick={() => props.toggleModal(route)}>Show</button>
                </td>
                <td>
                  <input type="checkbox" />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

export default RouteTable;
