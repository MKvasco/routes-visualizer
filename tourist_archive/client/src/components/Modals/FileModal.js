import React from "react";

import "./modals.css";

const FileModal = (props) => {
  const deleteFile = async (file_id) => {
    await fetch(`http://localhost:8000/api/files/${file_id}/`, {
      method: "delete",
    });
  };

  return (
    <>
      <div className="modal__container">
        <div className="modal">
          <button onClick={() => props.toggleModal()}>Close</button>
          <button
            onClick={() => {
              deleteFile(props.content.id);
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

export default FileModal;
