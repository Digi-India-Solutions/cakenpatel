import React from "react";
import "./categorySection.css";
import cat1 from "../../images/pic/cat1.avif"
import cat2 from "../../images/pic/cat2.avif"
import cat3 from "../../images/pic/cat3.avif"
import cat4 from "../../images/pic/cat4.avif"

const CategorySection = () => {
  // ✅ Static Data
  const categories = [
    {
      title: "Delicious Cakes",
      image: cat1,
      items: [
        "Birthday Cakes",
        "Anniversary Cakes",
        "Designer Cakes",
        "Photo Cakes",
        "Chocolate Cakes",
      ],
    },
    {
      title: "Gifting Gallery",
      image: cat2,
      items: [
        "Photo Gifts",
        "Mugs",
        "Cushions",
        "Name Gifts",
        "Caricatures",
      ],
    },
    {
      title: "Floral Delights",
      image: cat3,
      items: [
        "Red Roses",
        "Birthday Flowers",
        "Anniversary Flowers",
        "Exotic Flowers",
        "Flower Boxes",
      ],
    },
    {
      title: "Plant Paradise",
      image: cat4,
      items: [
        "Bonsai",
        "Indoor",
        "Air Purifying",
        "Lucky Bamboo",
        "Flowering",
      ],
    },
  ];

  return (
    <div className="container my-5">
      <div className="category-wrapper">
        <div className="row g-4">

          {categories.map((category, index) => (
            <div className="col-md-6" key={index}>
              <div className="category-card d-flex align-items-center">
                
                {/* Image */}
                <div className="category-image">
                  <img src={category.image} alt={category.title} />
                </div>

                {/* Content */}
                <div className="category-content">
                  <h5>{category.title}</h5>
                  <ul>
                    {category.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default CategorySection;
