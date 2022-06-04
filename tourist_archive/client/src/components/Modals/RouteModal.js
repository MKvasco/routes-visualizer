import React, { useState } from "react";

import "./modals.css";

const RouteModal = (props) => {
  const [title, setTitle] = useState(
    props.content.properties.title ? props.content.properties : ""
  );
  const [description, setDescription] = useState(
    props.content.properties.description
      ? props.content.properties.descripton
      : ""
  );

  const deleteRoute = async (route_id) => {
    await fetch(`http://localhost:8000/api/routes/${route_id}/`, {
      method: "delete",
    });
  };

  const submitForm = () => {
    console.log("submited");
  };

  return (
    <>
      <div className="modal__container">
        <div className="modal">
          <form onSubmit={submitForm} className="modal__form">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit">Update</button>
          </form>
          <button onClick={() => props.toggleModal()}>Close</button>
          <button
            onClick={() => {
              deleteRoute(props.content.id);
              props.toggleModal();
              setTimeout(() => props.toggleUpdate(), 200);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default RouteModal;
