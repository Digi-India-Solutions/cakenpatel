import React from "react";
import "./hero.css";
import cake1 from "../../images/cake1.jpg";
import cake2 from "../../images/cake2.jpg";
import cake3 from "../../images/cake3.jpg";
import cake4 from "../../images/cake4.jpg";
import feature1 from '../../images/feature1.png'
import feature2 from '../../images/feature2.png'
import feature3 from '../../images/feature3.png'
import feature4 from '../../images/feature4.png'
import feature5 from '../../images/feature5.png'
import feature6 from '../../images/feature6.png'
const Hero = () => {
  const features = [
    {
      icon: feature1,
      title: "100% FRESH",
      description:
        "With imperial flavors and supreme quality Cake Story provides your sweet tooth with flavors to soothe you.",
    },
    {
      icon: feature2,
      title: "HANDMADE",
      description:
        "Crafted with perfection especially for our customers to serve the perfect desserts and cakes.",
    },
    {
      icon: feature3,
      title: "DEDICATED STAFF",
      description:
        "Delicately and perfectly handled by our professional staff to provide you the best quality.",
    },
    {
      icon: feature4,
      title: "EASY ORDERING",
      description:
        "Accessible to all customers by giving them the ability to order directly from our website.",
    },
    {
      icon: feature5,
      title: "VARIETY PRODUCTS",
      description:
        "Dig into our variety-some menu where you will find all kinds of desserts you can think of.",
    },
    {
      icon: feature6,
      title: "TIMELY DELIVERY",
      description:
        "Order, sit back and relax, delicious delivery will arrive at your doorstep and we won’t let you wait.",
    },
  ];
  return (
    <>
      <div className="hero container topspacing">
        <div className="row align-items-center">
         
  <div className="col-md-7">
    <p className="heroPinkHeading mb-0">Delicate Designs. Decadent Flavors.</p>
    <p className="brownHeading">Turning Sweet Moments into Beautiful Memories.</p>
    <p className="hero-description heropara">
      At <strong>cakenpetals</strong>, every cake is a celebration of beauty,
      flavor, and emotion. Inspired by delicate petals and the joy of freshly
      baked creations, we design desserts that look as exquisite as they taste.
      From quiet, intimate moments to grand celebrations, we add sweetness to
      your life—one thoughtfully crafted slice at a time.
    </p>
    <p className="heropara">Each cake is crafted with love, premium ingredients, and thoughtful design—bringing together flavor, artistry, and emotion. From intimate moments to grand celebrations, cakenpetals is here to turn your special occasions into unforgettable memories, one slice at a time.</p>
  </div>


          <div className="col-md-5">
            <div className="image-grid row gx-2">
              <div className="col-6 mb-2">
                <img src={cake1} className="hero-image" alt="Cake" />
              </div>
              <div className="col-6 mb-2">
                <img src={cake2} className="hero-image" alt="Cake" />
              </div>
              <div className="col-6 mb-2">
                <img src={cake3} className="hero-image" alt="Cake" />
              </div>
              <div className="col-6 mb-2">
                <img src={cake4} className="hero-image" alt="Cake" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <section className="features">
        <div className="features-section">
          {features.map((feature, index) => (
            <div className="feature-box" key={index}>
                <img className="feature-icon" src={feature.icon} alt="" />
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section> */}
    </>
  );
};

export default Hero;
