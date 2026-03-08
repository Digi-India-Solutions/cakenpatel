import React, { useState } from "react";
import "./EggLess.css";
import egggless from "../../images/EgglessIMG.jpeg";

const EggLess = () => {

  return (
    <>
      {/* FLOATING EGG‑LESS ICON */}
      <div className="eg-floating-icon">
        <img src={egggless} alt="Eggless" />
      </div>

      {/* Optional popup can be added here */}
      {/* {isOpen && <div className="popup">Your content</div>} */}
    </>
  );
};

export default EggLess;