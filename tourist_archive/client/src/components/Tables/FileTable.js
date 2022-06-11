import React from "react";

import "./tables.css";

const FileTable = (props) => {
  const formatDate = (date) => {
    let localDate = new Date(date);
    return localDate.toLocaleDateString();
  };

  return (
    <>
      <div className="fileTable">
        <table>
          <thead>
            <tr>
              <th>Filename</th>
              <th>Uploaded</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {props.fileData &&
              props.fileData.map((file) => (
                <tr key={file["id"]}>
                  <td>{file["file"].replace("/data/imports/", "")}</td>
                  <td>{formatDate(file["timestamp"])}</td>
                  <td>
                    <img
                      src="../../../static/images/detail.png"
                      alt="detail"
                      width="20"
                      height="20"
                      onClick={() => props.toggleModal(file)}
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

export default FileTable;
