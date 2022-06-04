import React, { useState } from "react";

const Upload = (props) => {
  const [file, setFile] = useState(false);
  const [flag, setFlag] = useState(false);

  const postFile = async () => {
    const formData = new FormData();
    formData.append("file", file);
    await fetch("http://localhost:8000/api/files/", {
      method: "post",
      body: formData,
    });
    setFlag(false);
  };

  const handleFile = (e) => {
    setFlag(true);
    setFile(e.target.files[0]);
  };

  return (
    <>
      <h2>Upload form</h2>
      <form onSubmit={postFile}>
        <input type="file" name="file" onChange={handleFile} />
        {flag ? (
          <div>
            <p>Filename: {file.name}</p>
            <p>
              Filetype:{" "}
              {file.name.substr(file.name.lastIndexOf(".") + 1)
                ? file.name.substr(file.name.lastIndexOf(".") + 1)
                : file.type}
            </p>
            <p>Size in bytes: {file.size}</p>
            <p>
              lastModifiedDate: {file.lastModifiedDate.toLocaleDateString()}
            </p>
            {console.log(file)}
            <button className="button" type="submit">
              Upload GPS file
            </button>
          </div>
        ) : (
          <p>Select a file to show details</p>
        )}
      </form>
    </>
  );
};

export default Upload;
