import React from "react";

import "./tables.css";

const RouteTable = (props) => {
  const formatDate = (date) => {
    let localDate = new Date(date);
    let currentDate = new Date();
    if (
      localDate.getDay() == currentDate.getDay() &&
      localDate.getMonth() == currentDate.getMonth() &&
      localDate.getFullYear() == currentDate.getFullYear()
    ) {
      return localDate.toLocaleTimeString();
    } else {
      return localDate.toLocaleString();
    }
  };

  return (
    <>
      <div className="routeTable">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Modified</th>
              <th>Detail</th>
              <th>Show</th>
              <th>Zoom</th>
            </tr>
          </thead>
          <tbody>
            {props.routeData &&
              props.routeData.map((route) => (
                <tr key={route["id"]}>
                  <td>{route["properties"]["title"]}</td>
                  <td>{formatDate(route["properties"]["modified_at"])}</td>
                  <td>
                    <img
                      src="../../../static/images/detail.png"
                      alt="detail"
                      width="20"
                      height="20"
                      onClick={() => props.toggleModal(route)}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      onChange={(e) => props.handleCheckbox(e, route)}
                    />
                  </td>
                  <td>
                    <img
                      src="../../../static/images/zoom.png"
                      alt="zoom"
                      width="20"
                      height="20"
                      onClick={() => props.zoomRoute(route)}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RouteTable;
