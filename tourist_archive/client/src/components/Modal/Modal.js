import React from "react";

import "./Modal.css";

const Modal = (props) => {
  return (
    <>
      <div className="modal__container">
        <div className="modal">
          {console.log(props.content)}
          <button onClick={() => props.toggleModal()}>Close</button>
        </div>
      </div>
    </>
  );
};

export default Modal;
