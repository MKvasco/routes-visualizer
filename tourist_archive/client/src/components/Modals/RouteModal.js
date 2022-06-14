import React, { useEffect, useState } from "react";

import "./modals.css";

const RouteModal = (props) => {
  const [title, setTitle] = useState(props.content.properties.title);
  const [description, setDescription] = useState(
    props.content.properties.description
  );
  const [color, setColor] = useState(props.content.properties.route_color);
  const [width, setWidth] = useState(props.content.properties.route_width);
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState(false);

  const submitForm = async (e) => {
    // TODO: should i use patch method for optimalization?
    e.preventDefault();
    const response = await fetch(
      `http://localhost:8000/api/routes/${props.content.id}/`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title,
          description: description,
          route_color: color,
          route_width: width,
        }),
      }
    );
    const result = await response.json();

    // Error validations
    if (result.title) {
      setErrors(result.title);
    } else {
      // Updated the route table data
      let newRouteTableData = props.routesData;
      props.routesData.forEach((data, index) => {
        if (data.id == props.content.id) {
          newRouteTableData[index] = result;
        }
      });
      props.updateRoutesData(newRouteTableData, result);
      setErrors(false);
    }
  };

  useEffect(() => {
    const fetchFile = async () => {
      const response = await fetch(
        `http://localhost:8000/api/files/${props.content.properties.file}`
      );
      const result = await response.json();
      setFileName(result["file"].replace("/data/imports/", ""));
    };
    fetchFile();
  }, []);

  return (
    <>
      <div className="modal__container">
        <div className="modal">
          <button
            className="modal__closeButton"
            onClick={() => props.toggleModal()}
          >
            X
          </button>
          <div className="modal__content">
            <form onSubmit={(e) => submitForm(e)} className="modal__form">
              <label htmlFor="routeTitle">Title</label>
              <input
                id="routeTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors && <p>{errors}</p>}
              <label htmlFor="routeDescription">Description</label>
              <textarea
                id="routeDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <label htmlFor="routeColor">Route Color</label>
              <input
                id="routeColor"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <label htmlFor="routeWidth">Route Width</label>
              <input
                id="routeWidth"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
              <button type="submit">Update</button>
            </form>
            <div className="modal__routeInfo">
              <p>
                <b>GPS track name: </b>
                {props.content.properties.route_name}
              </p>
              <p>
                <b>Maximum elevation: </b>
                {props.content.properties.elevation_max}
              </p>
              <p>
                <b>Minimum elevation: </b>
                {props.content.properties.elevation_min}
              </p>
              <p>
                <b>Start time: </b>
                {props.content.properties.started_at}
              </p>
              <p>
                <b>End time: </b>
                {props.content.properties.ended_at}
              </p>
              <p>
                <b>Number of points: </b>
                {props.content.properties.route_points_count}
              </p>
              <p>
                <b>Parent file: </b>
                {fileName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RouteModal;
