import React from "react";

import "./tables.css";

const RouteTable = (props) => {
  const formatDate = (date) => {
    let localDate = new Date(date);
    return localDate.toLocaleDateString();
  };

  return (
    <>
      <div className="routeTable">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Name</th>
              <th>Modified</th>
              <th>Detail</th>
              <th>Show</th>
            </tr>
          </thead>
          <tbody>
            {props.routeData &&
              props.routeData.map((route) => (
                <tr key={route["id"]}>
                  <td>{route["properties"]["title"]}</td>
                  <td>{route["properties"]["route_name"]}</td>
                  {console.log(route.properties)}
                  <td>{formatDate(route["properties"]["created_at"])}</td>
                  <td>
                    <button onClick={() => props.toggleModal(route)}>
                      Open
                    </button>
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      onChange={(e) => props.addRoute(e, route)}
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
