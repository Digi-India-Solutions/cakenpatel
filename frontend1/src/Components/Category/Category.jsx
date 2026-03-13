// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import "./category.css";
// import axios from "axios";
// import cakeImage from "../../images/cake1.jpg";
// import { useNavigate } from "react-router-dom"

// const Category = () => {
//   const navigate = useNavigate();
//   const [categories, setCategories] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isMobile, setIsMobile] = useState(false);

//   // Check screen size on mount and resize
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };

//     checkMobile();
//     window.addEventListener('resize', checkMobile);

//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get(
//           `https://api.cakenpetals.com/api/get-subcategory-by-status`
//         );
//         if (response.data.success) {
//           setCategories(response.data.data);
//         } else {
//           setError("Failed to fetch categories");
//         }
//       } catch (err) {
//         setError("Error fetching categories");
//         console.error("Error fetching categories:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchCategories();
//   }, []);

//   // Slider settings - only used when not on mobile
//   const settings = {
//     dots: false,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 8,
//     slidesToScroll: 1,
//     arrows: true,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: 5,
//           slidesToScroll: 1,
//         }
//       },
//       {
//         breakpoint: 768,
//         settings: {
//           slidesToShow: 4,
//           slidesToScroll: 1,
//         }
//       },
//       {
//         breakpoint: 480,
//         settings: {
//           slidesToShow: 3,
//           slidesToScroll: 1,
//         }
//       }
//     ]
//   };

//   if (isLoading) {
//     return <div className="loading">Loading...</div>;
//   }

//   if (error) {
//     return <div className="error">Error: {error}</div>;
//   }

//   const activeCategories = categories?.filter((item) => item?.ActiveonHome === true);

//   return (
//     <section className="category-main">
//       <div className="category-container">
//         {isMobile ? (
//           // Mobile view - Grid layout (no carousel)
//           <div className="category-grid">
//             {activeCategories.map((item) => (
//               <div key={item?._id} className="category-grid-item">
//                 <div
//                   className="category-link"
//                   onClick={() => navigate(`/product-related/${item?.subcategoryName?.replace(/\s+/g, "-").toLowerCase()}`,
//                     { state: { id: item?._id, status: 'category' } }
//                   )}
//                 >
//                   <img
//                     src={`https://api.cakenpetals.com/${item?.image}`}
//                     alt={item?.subcategoryName}
//                     className="category-img"
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.src = cakeImage;
//                     }}
//                   />
//                   <p className="category-name">{item?.subcategoryName.charAt(0).toUpperCase() + item?.subcategoryName.slice(1)}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           // Desktop/Tablet view - Carousel
//           <Slider {...settings}>
//             {activeCategories.map((item) => (
//               <div key={item?._id} className="category-slide">
//                 <div
//                   className="category-link"
//                   onClick={() => navigate(`/product-related/${item?.subcategoryName?.replace(/\s+/g, "-").toLowerCase()}`,
//                     { state: { id: item?._id, status: 'category' } }
//                   )}
//                 >
//                   <img
//                     src={`https://api.cakenpetals.com/${item?.image}`}
//                     alt={item?.subcategoryName}
//                     className="category-img"
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.src = cakeImage;
//                     }}
//                   />
//                   <p className="category-name">{item?.subcategoryName?.charAt(0).toUpperCase() + item?.subcategoryName?.slice(1)}</p>
//                 </div>
//               </div>
//             ))}
//           </Slider>
//         )}
//       </div>
//     </section>
//   );
// };

// export default Category;

import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./category.css";
import axios from "axios";
import cakeImage from "../../images/cake1.jpg";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          // `https://api.cakenpetals.com/api/get-subcategory-by-status`
          "https://api.cakenpetals.com/api/second-sub-category/get-second-sub-category"
        );
        if (response.data.data) {
          setCategories(response.data.data);
        } else {
          setError("Failed to fetch categories");
        }
      } catch (err) {
        setError("Error fetching categories");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const activeCategories = categories?.filter((item) => item?.ActiveonHome === true);
  const count = activeCategories.length;

  // ✅ Dynamic slidesToShow — never exceed actual item count
  const getSlidesToShow = (desired) => Math.min(desired, count);

  const NextArrow = ({ onClick }) => {
    return (
      <div
        className="custom-arrow custom-next"
        onClick={onClick}
      >
        ›
      </div>
    );
  };

  const PrevArrow = ({ onClick }) => {
    return (
      <div
        className="custom-arrow custom-prev"
        onClick={onClick}
      >
        ‹
      </div>
    );
  };

  const settings = {
    dots: false,
    infinite: count > 8,
    speed: 500,
    slidesToShow: getSlidesToShow(8),
    slidesToScroll: 1,
    arrows: count > 8,
    autoplay: count > 8,
    autoplaySpeed: 3000,
    centerMode: count < 8,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    centerPadding: count < 8 ? "0px" : "0px",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: getSlidesToShow(5),
          infinite: count > 5,
          arrows: count > 5,
          centerMode: count < 5,
          centerPadding: "0px",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: getSlidesToShow(4),
          infinite: count > 4,
          arrows: count > 4,
          centerMode: count < 4,
          centerPadding: "0px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: getSlidesToShow(3),
          infinite: count > 3,
          arrows: count > 3,
          centerMode: count < 3,
          centerPadding: "0px",
        },
      },
    ],
  };

  const handleNavigate = (item) => {
    navigate(
      // `/product-related/${item?.subcategoryName?.replace(/\s+/g, "-").toLowerCase()}`,
      `/${item?.secondsubcategoryName?.replace(/\s+/g, "-").toLowerCase()}`,
      { state: { id: item?._id, status: "category" } }
    );
  };

  const CategoryCard = ({ item }) => (
    <div className="category-link" onClick={() => handleNavigate(item)}>
      <img
        src={`https://api.cakenpetals.com/${item?.image}`}
        alt={item?.secondsubcategoryName}
        className="category-img"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = cakeImage;
        }}
      />
      <p className="category-name">
        {item?.secondName?.charAt(0).toUpperCase() + item?.secondName?.slice(1) || item?.secondsubcategoryName?.charAt(0).toUpperCase() + item?.secondsubcategoryName?.slice(1)}
      </p>
    </div>
  );

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <section className="category-main">
      <div className="category-container">
        {isMobile ? (
          // Mobile — Grid layout
          <div className="category-grid">
            {activeCategories.map((item) => (
              <div key={item?._id} className="category-grid-item">
                <CategoryCard item={item} />
              </div>
            ))}
          </div>
        ) : count <= 8 ? (
          // ✅ Desktop — Few items: use flexbox centering instead of slider
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            {activeCategories.map((item) => (
              <div key={item?._id} className="category-slide">
                <CategoryCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          // Desktop — Many items: use slider
          <Slider {...settings}>
            {activeCategories.map((item) => (
              <div key={item?._id} className="category-slide">
                <CategoryCard item={item} />
              </div>
            ))}
          </Slider>
        )}
      </div>
    </section>
  );
};

export default Category;