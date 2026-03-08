import React, { useEffect } from "react";

export default function ReelModal({ reel, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  return (
    <div className="reel-overlay" onClick={onClose}>
      <div
        className="reel-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <video src={reel.video} autoPlay controls />

        <div className="modal-product">
          <img src={reel.productImg} alt="" />
          <div>
            <h4 >{reel.title}</h4>
            <span>{reel.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
