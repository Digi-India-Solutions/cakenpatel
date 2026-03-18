import React, { memo, useMemo } from "react";
import "./hero.css";

import cake1 from "../../images/cake1.jpg";
import cake2 from "../../images/cake2.jpg";
import cake3 from "../../images/cake3.jpg";
import cake4 from "../../images/cake4.jpg";

const Hero = () => {
  /* ========================================================
     MEMOIZED IMAGE ARRAY
  ======================================================== */

  const images = useMemo(() => [cake1, cake2, cake3, cake4], []);

  return (
    <>
      <div className="hero container topspacing">
        <div className="row align-items-center">
          {/* LEFT TEXT CONTENT */}

          <div className="col-md-7">
            <p className="heroPinkHeading mb-0">
              Delicate Designs. Decadent Flavors.
            </p>

            <p className="brownHeading">
              Turning Sweet Moments into Beautiful Memories.
            </p>

            <p className="hero-description heropara">
              At <strong>cakenpetals</strong>, every cake is a celebration of
              beauty, flavor, and emotion. Inspired by delicate petals and the
              joy of freshly baked creations, we design desserts that look as
              exquisite as they taste.
            </p>

            <p className="heropara">
              Each cake is crafted with love, premium ingredients, and
              thoughtful design—bringing together flavor, artistry, and emotion.
              From intimate moments to grand celebrations, cakenpetals is here
              to turn your special occasions into unforgettable memories.
            </p>
          </div>

          {/* RIGHT IMAGE GRID */}

          <div className="col-md-5">
            <div className="image-grid row gx-2">
              {images.map((img, index) => (
                <div className="col-6 mb-2" key={index}>
                  <img
                    src={img}
                    alt="Cake"
                    className="hero-image"
                    loading={index < 2 ? "eager" : "lazy"}
                    decoding="async"
                    width="300"
                    height="300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Hero);
