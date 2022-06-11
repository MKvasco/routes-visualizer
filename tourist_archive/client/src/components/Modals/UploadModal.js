import React from "react";
import Upload from "../Forms/Upload";

import "./modals.css";

import UploadForm from "../Forms/Upload";

const UploadModal = (props) => {
  return (
    <>
      <div className="modal__uploadContainer">
        <div className="modal__upload">
          <button onClick={() => props.hideUploadModal()}>Close</button>
          <UploadForm
            setTableData={(fileData, routeData) =>
              props.setTableData(fileData, routeData)
            }
          />
        </div>
      </div>
    </>
  );
};

export default UploadModal;
