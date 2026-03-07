import React, { useEffect, useState } from "react";
import "./coustomize.css";

import cake1 from "../../images/pic/cake2.png";
import cake2 from "../../images/pic/product1.png";
import cake3 from "../../images/pic/product2.png";
import cake4 from "../../images/pic/product3.png";

const images = [cake1, cake2, cake3];

const Coustomize = () => {
  const [customers, setCustomers] = useState(0);
  const [venues, setVenues] = useState(0);
  const [rating, setRating] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  /* COUNTER ANIMATION */
  useEffect(() => {
    let c = 0;
    let v = 0;
    let r = 0;

    const interval = setInterval(() => {
      if (c < 10000) c += 200;
      if (v < 50) v += 1;
      if (r < 4.9) r += 0.1;

      setCustomers(c);
      setVenues(v);
      setRating(r.toFixed(1));

      if (c >= 10000 && v >= 50 && r >= 4.9) {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  /* AUTO IMAGE SLIDER */
  useEffect(() => {
    const slider = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 2500);

    return () => clearInterval(slider);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-container">

        {/* LEFT CONTENT */}
        <div className="hero-content">
          <h1>
            Design Your Dream <br />
            Cake & Celebrate <br />
            in Style
          </h1>

          <p>
            Create personalized celebration cakes with our interactive designer,
            then discover the perfect venue to make your event unforgettable.
          </p>

          {/* <div className="hero-buttons">
            <button className="btn-primary">Start Customizing</button>
            <button className="btn-outline">View Gallery</button>
          </div> */}

          <div className="hero-stats">
            <div>
              <h3>{customers.toLocaleString()}+</h3>
              <span>Happy Customers</span>
            </div>
            <div>
              <h3>{venues}+</h3>
              <span>Venue Partners</span>
            </div>
            <div>
              <h3>{rating}★</h3>
              <span>Average Rating</span>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE SLIDER */}
        <div className="hero-img-slider">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="Cake"
              className={index === currentSlide ? "active" : ""}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Coustomize;
