import React from "react";

const Upload = (props) => {
  return (
    <>
      <h2>Upload form</h2>
      <form method="post" enctype="multipart/form-data">
        <input type="file" name="gps_file" />
        <button className="button" type="submit">
          Upload GPS file
        </button>
      </form>
    </>
  );
};

export default Upload;
