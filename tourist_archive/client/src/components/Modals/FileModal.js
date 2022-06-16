import React, { useEffect, useState } from "react";

import "./modals.css";

const FileModal = (props) => {
  const getFile = async (file_id) => {
    const fileResponse = await fetch(
      `http://localhost:8000/api/files/${file_id}/`
    );
    const file = await fileResponse.json();
    const routesResponse = await fetch(
      `http://localhost:8000/api/${file_id}/routes`
    );
    const routes = await routesResponse.json();
    props.deleteDataFromTables(file, routes);
  };

  const deleteFile = async (file_id) => {
    getFile(file_id);
    await fetch(`http://localhost:8000/api/files/${file_id}/`, {
      method: "delete",
    });
  };

  return (
    <>
      <div className="modal__container">
        <div className="modal">
          <button
            className="modal__closeButton"
            onClick={() => {
              props.toggleModal();
              props.removeFileRoutes();
            }}
          >
            X
          </button>
          <button
            onClick={() => {
              deleteFile(props.content.id);
              props.toggleModal();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default FileModal;
