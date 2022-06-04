import React, { useState, useEffect } from "react";

import "./tables.css";

const FileTable = (props) => {
  const [fileData, setFileData] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      const response = await fetch("http://localhost:8000/api/user/files");
      const content = await response.json();
      if (!content.detail) setFileData(content);
    };
    fetchFiles();
  }, [props.toggleUpdate]);

  const formatDate = (date) => {
    let localDate = new Date(date);
    return localDate.toLocaleString();
  };

  return (
    <>
      <h1>Files</h1>
      <table>
        <thead>
          <tr>
            <th>File</th>
            <th>Date</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {fileData &&
            fileData.map((file) => (
              <tr key={file["id"]}>
                <td>{file["file"].replace("/data/imports/", "")}</td>
                <td>{formatDate(file["timestamp"])}</td>
                <td>
                  <button onClick={() => props.toggleModal(file)}>Show</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

export default FileTable;
