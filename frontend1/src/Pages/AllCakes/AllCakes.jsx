import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
// import AllProducts from "../AllProducts/AllProducts";
import AllProducts from "../../Components/AllProducts/AllProducts";
import "./allcakes.css";
import { useLocation, useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Banner1 from "../../images/1583 by 426 banner/Banner1.jpg";
//import Banner2 from "../../images/1583 by 426 banner/Banner2.jpg";
import AllProductById from "../../Components/AllProductById/AllProductById";

/* const staticProducts = [
  {
    productName: "Chocolate Truffle Cake",
    productImage: [Banner1],
    Variant: [{ finalPrice: 599 }],
  },
  {
    productName: "Red Velvet Cake",
    productImage: [Banner2],
    Variant: [{ finalPrice: 699 }],
  },
];
 */
const AllCakes = () => {
  const navigate = useNavigate();
  const { subcatname } = useParams();
  const [cakesArr, setCakesArr] = useState([]);
  const [subcategoryInfo, setSubcategoryInfo] = useState(null);
  const [subCategoryBanner, setSubCategoryBanner] = useState(null);
  const location = useLocation();
  const subCategoryId = location.state.id;
  const status = location.state.status;
  console.log(
    "XXXXXX==>",
    subcatname?.replace(/-/g, " "),
    location.state.id,
    status,
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `https://api.cakenpetals.com/api/get-product-by-subcatname/${subcatname.replace(/-/g, " ")}`,
        );

        if (res.data?.data?.length > 0) {
          setCakesArr(res.data.data);
          console.log(res.data?.data);
          setSubCategoryBanner(res.data.data[0].subcategoryName);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchProductById = async (subCategoryId) => {
      try {
        const res = await axios.get(
          `https://api.cakenpetals.com/api/get-product-by-subCategoryId/${subCategoryId}`,
        );
        console.log("XXXXXXXSSSSS:=>>", res.data?.data);
        if (res.data?.data?.length > 0) {
          setCakesArr(res.data.data);
          console.log("XXXXXXXSSSSS:=>>", res.data?.data[0]?.subcategoryName);
          // setSubcategoryInfo(res.data.data[0].subcategoryName);
          if (status === "subCategory") {
            setSubCategoryBanner(res.data?.data[0]?.secondsubcategoryName);
          } else {
            setSubCategoryBanner(res.data?.data[0]?.subcategoryName);
          }
        } else {
          setCakesArr([]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (subCategoryId) {
      fetchProductById(subCategoryId);
    } else {
      fetchProducts();
    }

    const fetchSecoundSubCategory = async () => {
      try {
        const res = await axios.get(
          `https://api.cakenpetals.com/api/second-sub-category/get-second-subcategory-by-subcategory/${subCategoryId}`,
        );
        console.log("DDDDD::=>", res);
        if (res.data?.data?.length > 0) {
          // setCakesArr(res.data.data);
          // console.log("DDDDD::=>",res.data?.data)
          setSubcategoryInfo(res.data.data);
        }
      } catch (e) {
        console.log(e);
      }
    };

    if (status === "category") {
      fetchSecoundSubCategory();
    }
  }, [subcatname, subCategoryId]);

  const NextArrow = ({ onClick }) => {
    return (
      <div className="custom-arrow custom-next" onClick={onClick}>
        ›
      </div>
    );
  };

  const PrevArrow = ({ onClick }) => {
    return (
      <div className="custom-arrow custom-prev" onClick={onClick}>
        ‹
      </div>
    );
  };

  const bannerSettings = {
    dots: false,
    arrows: false,
    autoplay: true,
    infinite: subcategoryInfo?.length > 8, // smart infinite
    speed: 600,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplaySpeed: 2500,
    slidesToShow: 8,
    slidesToScroll: 2,
    swipeToSlide: true,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 6 } },
      { breakpoint: 992, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 576, settings: { slidesToShow: 3 } },
    ],
  };

  const imageHandler = (img) => {
    const imageUrl = img
      ? img.startsWith("http")
        ? img
        : `https://api.cakenpetals.com/${img}`
      : Banner1;

    return imageUrl;
  };

  const bannerImage =
    subCategoryBanner?.banner || subCategoryBanner?.subCategoryId?.banner;

  console.log("XXXX::=>", subcategoryInfo, bannerImage, subCategoryBanner);
  return (
    <>
      {/* TOP SUBCATEGORY */}
      {/* {subcategoryInfo && status === 'category' && (
        <Slider {...bannerSettings}>
          {subcategoryInfo?.map((subcategory, index) => (
            <section className="topCategorySection">
              <div className="topCategoryCard active">

                <div onClick={() => {
                  navigate(`/product-related/${subcategory?.secondsubcategoryName?.toLowerCase()?.replace(/[^a-z0-9]+/g, "-")?.replace(/(^-|-$)/g, "")}`,
                    { state: { id: subcategory?._id, status: '' } });
                }}
                  className="mega-item mega-child"
                >
                  <img
                    src={`https://api.cakenpetals.com/${subcategory?.image}` || imageHandler(subcategory?.image)}
                    alt={subcategory?.subcategoryName || subcategory?.secondsubcategoryName || "subcategory"}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = Banner1;
                    }}
                  />

                  <p>{subcategory?.secondsubcategoryName}</p>
                </div>

              </div>
            </section>
          ))}
        </Slider>
      )} */}

      {subcategoryInfo?.length > 0 && status === "category" && (
        <div className="subcategorySliderWrapper">
          <Slider {...bannerSettings}>
            {subcategoryInfo.map((subcategory) => (
              <div key={subcategory?._id}>
                <section className="topCategorySection">
                  <div className="topCategoryCard active">
                    <div
                      className="mega-item mega-child"
                      onClick={() => {
                        const slug = subcategory?.secondsubcategoryName
                          ?.toLowerCase()
                          ?.replace(/[^a-z0-9]+/g, "-")
                          ?.replace(/(^-|-$)/g, "");

                        navigate(`/product-related/${slug}`, {
                          state: { id: subcategory?._id, status: "" },
                        });
                      }}
                    >
                      <img
                        src={imageHandler(subcategory?.image)}
                        alt={
                          subcategory?.secondsubcategoryName || "subcategory"
                        }
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = Banner1;
                        }}
                      />
                      <p>
                        {subcategory?.secondsubcategoryName
                          ?.charAt(0)
                          .toUpperCase() +
                          subcategory?.secondsubcategoryName?.slice(1)}
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            ))}
          </Slider>
        </div>
      )}

      {/* BANNER SLIDER */}

      {bannerImage && (
        <section className="cakeBannerSlider">
          <div>
            <div className="bannerBox">
              <img
                src={`https://api.cakenpetals.com/${bannerImage}`}
                alt="Cake Banner"
              />
            </div>
          </div>
        </section>
      )}

      {/* <Slider {...bannerSettings}>
          {[Banner1, Banner2].map((img, index) => (
            <div key={index}>
              <div className="bannerBox">
                <img src={img} alt="Cake Banner" />
              </div>
            </div>
          ))}
        </Slider> */}

      {subCategoryId && <AllProductById cakesArr={cakesArr} />}
      {!subCategoryId && <AllProducts />}
    </>
  );
};

export default AllCakes;

// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import "./allcakes.css";
// import axios from "axios";

// const AllCakes = () => {
//   const { subcatname } = useParams();
//   const [priceOpen, setPriceOpen] = useState(false);
//   const [selectedPrice, setSelectedPrice] = useState(null); // New state for selected price range
//   const [cakesArr, setCakesArr] = useState([]);

//   // Function to fetch products based on selected price range
//   const getProductrelatedSubcategory = async () => {
//     try {
//       let url = `https://api.cakenpetals.com/api/get-product-by-subcatname/${subcatname}`;

//       // Add price filter if selected
//       if (selectedPrice) {
//         url += `?priceRange=${selectedPrice}`;
//       }

//       const res = await axios.get(url);
//       console.log(res);
//       if (res.status === 200) {
//         setCakesArr(res.data.data);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getProductrelatedSubcategory();
//   }, [subcatname, selectedPrice]); // Re-fetch products when subcategory or selected price changes

//   const handlePriceFilter = (priceRange) => {
//     setSelectedPrice(priceRange);
//     setPriceOpen(false); // Close the price filter dropdown after selection
//   };

//   return (
//     <>
//       {/* ----breadCrumb----  */}
//       <section className="breadCrumb">
//         <div className="breadCrumbContent">
//           <h1>Cakes for Every Taste</h1>
//           <Link to="/">Home /</Link> <Link to="">Cakes</Link>
//         </div>
//       </section>
//       {/* ----breadCrumb---- end  */}

//       <section className="allProducts">
//         <div className="mainProducts">
//           {/* Sidebar */}
//           <div className="sidebar">
//             <div className="filter-header">Filters</div>

//             {/* Price Filter */}
//             <div className="filter-section">
//               <div
//                 className="filter-title"
//                 onClick={() => setPriceOpen(!priceOpen)}
//               >
//                 Price <span>{priceOpen ? "−" : "+"}</span>
//               </div>
//               <ul className={`filter-options ${priceOpen ? "open" : ""}`}>
//                 <li onClick={() => handlePriceFilter("200-500")}>
//                   ₹200 - ₹500
//                 </li>
//                 <li onClick={() => handlePriceFilter("500-1000")}>
//                   ₹500 - ₹1000
//                 </li>
//                 <li onClick={() => handlePriceFilter("1000-2000")}>
//                   ₹1000 - ₹2000
//                 </li>
//                 <li onClick={() => handlePriceFilter("2000+")}>Above ₹2000</li>
//               </ul>
//             </div>

//             {/* Other Filters (Optional) */}
//             {/* You can leave the other filters here if needed */}
//           </div>

//           {/* Main Content Area */}
//           <div className="allContentSide">
//             <h1>{subcatname}</h1>
//             <div>
//               <div className="row">
//                 {cakesArr.map((item, index) => (
//                   <div className="col-md-3 col-6 mb-3" key={index}>
//                     <div className="card">
//                       <Link to={`/product-details/${item.productName}`}>
//                       {/* <Link to={`/sub-subcategory/${item.productName}`}> */}
//                         <img
//                           src={`https://api.cakenpetals.com/${item.productImage[0]}`}
//                           className="w-100"
//                           alt="images"
//                         />
//                         <div className="productDetails">
//                           <p className="productTitle">{item.productName}</p>
//                           <p className="d-flex gap-2 align-items-center m-0">
//                             <span className="productPrice">
//                               ₹{Math.round(item.Variant[0].finalPrice)}
//                             </span>
//                             <span className="discount-price">
//                               ₹ <del>375</del> 20% OFF
//                             </span>
//                           </p>
//                         </div>
//                       </Link>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default AllCakes;
