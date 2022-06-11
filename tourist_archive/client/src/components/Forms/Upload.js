import React, { useState } from "react";

import "./styles/upload.css";

const Upload = (props) => {
  const [file, setFile] = useState(false);

  const postFile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    //Post file
    const fileResponse = await fetch("http://localhost:8000/api/files/", {
      method: "post",
      body: formData,
    });
    const fileData = await fileResponse.json();

    //Fetch routes of posted file
    const routeResponse = await fetch(
      `http://localhost:8000/api/${fileData["id"]}/routes`
    );
    const routeData = await routeResponse.json();

    //Send data to parent
    props.setTableData(fileData, routeData["features"]);
    setFile(false);
  };

  return (
    <>
      <div className="uploadForm">
        <div className="uploadForm__content">
          {file && (
            <div className="uploadForm__fileInfo">
              <p>
                <b>Filename:</b> {file.name}
              </p>
              <p>
                <b>Filetype:</b>{" "}
                {file.name.substr(file.name.lastIndexOf(".") + 1)
                  ? file.name.substr(file.name.lastIndexOf(".") + 1)
                  : file.type}
              </p>
              <p>
                <b>Size in bytes:</b> {file.size}
              </p>
              <p>
                <b>Last Modified:</b>{" "}
                {file.lastModifiedDate.toLocaleDateString()}
              </p>
              <button className="button" onClick={(e) => postFile(e)}>
                Upload GPS file
              </button>
            </div>
          )}
          <div className="uploadForm__upload">
            <div className="uploadForm__uploadImage">
              <label
                onChange={(e) => setFile(e.target.files[0])}
                htmlFor="fileUpload"
              >
                <input name="file" type="file" id="fileUpload" hidden />
                <img
                  src="../../../static/images/upload.png"
                  alt="upload"
                  width="156"
                  height="156"
                />
              </label>
            </div>
            <div className="uploadForm__uploadInfo">
              {!file && <p>Select a file to upload routes</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Upload;
