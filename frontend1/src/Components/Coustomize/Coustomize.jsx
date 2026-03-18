import React, { useEffect, useState, useMemo } from "react";
import "./coustomize.css";

import cake1 from "../../images/pic/cake2.png";
import cake2 from "../../images/pic/product1.png";
import cake3 from "../../images/pic/product2.png";

/* ========================================================
   MEMOIZED IMAGE ARRAY
   Prevents recreating array on every render
======================================================== */
const images = [cake1, cake2, cake3];

const Coustomize = () => {
  const [customers, setCustomers] = useState(0);
  const [venues, setVenues] = useState(0);
  const [rating, setRating] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  /* ========================================================
     COUNTER ANIMATION
  ======================================================== */

  useEffect(() => {
    let customerCount = 0;
    let venueCount = 0;
    let ratingCount = 0;

    const interval = setInterval(() => {
      customerCount = Math.min(customerCount + 200, 10000);
      venueCount = Math.min(venueCount + 1, 50);
      ratingCount = Math.min(ratingCount + 0.1, 4.9);

      setCustomers(customerCount);
      setVenues(venueCount);
      setRating(ratingCount.toFixed(1));

      if (customerCount === 10000 && venueCount === 50 && ratingCount === 4.9) {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  /* ========================================================
     AUTO IMAGE SLIDER
  ======================================================== */

  useEffect(() => {
    const slider = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 2500);

    return () => clearInterval(slider);
  }, []);

  /* ========================================================
     MEMOIZED SLIDES
  ======================================================== */

  const slides = useMemo(() => images, []);

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

          {/* STATS */}

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

        {/* IMAGE SLIDER */}

        <div className="hero-img-slider">
          {slides.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="Cake"
              loading="lazy"
              decoding="async"
              width="400"
              height="400"
              className={index === currentSlide ? "active" : ""}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(Coustomize);
