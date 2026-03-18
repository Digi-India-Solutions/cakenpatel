// import React, { useEffect, useState, useCallback } from "react";
// import "./allproducts.css";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import Swal from "sweetalert2";
// import Slider from "react-slick";
// import { LuEggOff } from "react-icons/lu";

// let cachedMainCategories = null;
// let cachedAllProducts = null;

// const AllProducts = ({ status = "", relatedProducts = "" }) => {
//   const navigate = useNavigate();
//   const user = sessionStorage.getItem("userId");

//   const [categoryData, setCategoryData] = useState([]);
//   const [productData, setProductData] = useState([]);
//   const [wishlist, setWishlist] = useState([]);

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//     fetchCategories();
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     const stored = sessionStorage.getItem("wishlist");
//     if (stored) setWishlist(JSON.parse(stored));
//   }, []);

//   const fetchCategories = async () => {
//     if (cachedMainCategories) {
//       setCategoryData(
//         status === "Home"
//           ? cachedMainCategories.filter((c) => c?.ActiveonHome)
//           : cachedMainCategories,
//       );
//       return;
//     }

//     try {
//       const res = await axios.get(
//         "https://api.cakenpetals.com/api/get-main-category",
//       );

//       cachedMainCategories = res.data?.data;

//       setCategoryData(
//         status === "Home"
//           ? res.data.data.filter((c) => c?.ActiveonHome)
//           : res.data.data,
//       );
//     } catch (err) {
//       console.error("Category Fetch error:", err);
//     }
//   };

//   const fetchProducts = async () => {
//     if (cachedAllProducts) {
//       setProductData(
//         status === "Home"
//           ? cachedAllProducts.filter((p) => p?.ActiveonHome)
//           : cachedAllProducts,
//       );
//       return;
//     }

//     try {
//       const res = await axios.get(
//         "https://api.cakenpetals.com/api/all-product",
//       );

//       cachedAllProducts = res.data?.data;

//       setProductData(
//         status === "Home"
//           ? res.data.data.filter((p) => p?.ActiveonHome)
//           : res.data.data,
//       );
//     } catch (err) {
//       console.error("Product Fetch error:", err);
//     }
//   };

//   const handleProductClick = useCallback(
//     (productName) => {
//       navigate(`/product-details/${productName?.replace(/\s+/g, "-")}`);
//     },
//     [navigate],
//   );

//   const handleWishlistApi = async (productId, isRemoving) => {
//     try {
//       if (isRemoving) {
//         await axios.delete(
//           "https://api.cakenpetals.com/api/wishlist/remove-wishlist",
//           {
//             data: { user, productId },
//           },
//         );
//       } else {
//         await axios.post(
//           "https://api.cakenpetals.com/api/wishlist/add-wishlist",
//           { user, productId },
//         );
//       }
//     } catch (error) {
//       console.error("Wishlist API error:", error);
//     }
//   };

//   const handleWishlistClick = useCallback(
//     (e, productId) => {
//       e.stopPropagation();

//       if (!user) {
//         Swal.fire({
//           icon: "warning",
//           title: "Login Required",
//           text: "Please login to use wishlist",
//         });
//         navigate("/login");
//         return;
//       }

//       setWishlist((prev) => {
//         const exists = prev.includes(productId);

//         const updated = exists
//           ? prev.filter((id) => id !== productId)
//           : [...prev, productId];

//         sessionStorage.setItem("wishlist", JSON.stringify(updated));

//         handleWishlistApi(productId, exists);

//         return updated;
//       });
//     },
//     [user, navigate],
//   );

//   const settings = {
//     dots: false,
//     infinite: productData.length > 4,
//     speed: 500,
//     autoplay: true,
//     slidesToShow: Math.min(4, productData.length),
//     slidesToScroll: 1,
//     autoplaySpeed: 3000,
//   };

//   const renderProductCard = (product, index) => {
//     const variant = product?.Variant?.[0] || {};
//     const image = product?.productImage?.[0];

//     return (
//       <div
//         key={product?._id}
//         className="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-6"
//       >
//         <div
//           className="product-card"
//           onClick={() => handleProductClick(product?.productName)}
//         >
//           <div className="product-img position-relative">
//             <img
//               src={`https://api.cakenpetals.com/${image}`}
//               alt={product?.productName}
//               loading={index < 4 ? "eager" : "lazy"}
//             />

//             <span
//               className="wishlist"
//               onClick={(e) => handleWishlistClick(e, product?._id)}
//             >
//               {wishlist?.includes(product?._id) ? (
//                 <FaHeart color="#ff3b30" />
//               ) : (
//                 <FaRegHeart />
//               )}
//             </span>

//             {variant?.discountPrice && (
//               <span className="off-badge">{variant.discountPrice}% OFF</span>
//             )}
//           </div>

//           <div className="product-body">
//             <div className="d-flex gap-2 mb-2">
//               {product?.eggless && (
//                 <span className="eggless">
//                   <LuEggOff /> EGGLESS
//                 </span>
//               )}
//             </div>

//             <p className="product-title">{product?.productName}</p>

//             <div className="rating">
//               ★ 4.8 <span>(245 Reviews)</span>
//             </div>

//             <div className="price-row">
//               <span className="price">₹ {variant?.finalPrice}</span>

//               {variant?.price !== variant?.finalPrice && (
//                 <span className="old-price">₹ {variant?.price}</span>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="container">
//       <div className="mb-5">
//         {relatedProducts === "relatedProducts" ? (
//           <Slider {...settings}>
//             {productData?.map((p, i) => renderProductCard(p, i))}
//           </Slider>
//         ) : (
//           <div className="row g-4">
//             {productData?.map((p, i) => renderProductCard(p, i))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllProducts;

import React, { useEffect, useState } from "react";
import "./allproducts.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Swal from "sweetalert2";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { LuEggOff } from "react-icons/lu";

// ========================================================
// PERFORMANCE FIX: GLOBAL CACHE
// Prevents re-fetching heavy category and product data 
// from the server every time the user navigates.
// ========================================================
let cachedMainCategories = null;
let cachedAllProducts = null;

const AllProducts = ({ status = '', relatedProducts = '' }) => {
  const navigate = useNavigate();
  const user = sessionStorage.getItem("userId");

  // Use cached data immediately if we have it
  const [categoryData, setCategoryData] = useState(
    cachedMainCategories ? (status === 'Home' ? cachedMainCategories.filter(item => item?.ActiveonHome === true) : cachedMainCategories) : []
  );

  const [productData, setProductData] = useState(
    cachedAllProducts ? (status === 'Home' ? cachedAllProducts.filter(item => item?.ActiveonHome === true) : cachedAllProducts) : []
  );

  const [currentPage, setCurrentPage] = useState({});
  const [wishlist, setWishlist] = useState([]); // ✅ fixed initial state
  const productsPerPage = 20;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    getApiData();
    getApiProductData();
  }, []);

  const getApiData = async () => {
    // PERFORMANCE FIX: If categories are already cached, do not ping the server!
    if (cachedMainCategories) {
      const pageState = {};
      cachedMainCategories.forEach((c) => (pageState[c?._id] = 1));
      setCurrentPage(pageState);
      return;
    }

    try {
      const res = await axios.get(
        `https://api.cakenpetals.com/api/get-main-category`
      );
      if (res.status === 200) {
        cachedMainCategories = res.data?.data; // Save to global cache
        setCategoryData(status === 'Home' ? res.data?.data?.filter((item) => item?.ActiveonHome === true) : res?.data?.data);
        const pageState = {};
        res.data.data.forEach((c) => (pageState[c?._id] = 1));
        setCurrentPage(pageState);
      }
    } catch (err) {
      console.error("Category Fetch error:", err);
    }
  };

  const getApiProductData = async () => {
    // PERFORMANCE FIX: If all products are already cached, do not ping the server!
    if (cachedAllProducts) return;

    try {
      const res = await axios.get(
        `https://api.cakenpetals.com/api/all-product`
      );

      if (res.status === 200) {
        const grouped = {};
        res.data.data.forEach((p) => {
          const cid = p?.categoryName?._id;
          if (!grouped[cid]) grouped[cid] = [];
          grouped[cid].push(p);
        });
        console.log("grouped==>", res.data.data)

        cachedAllProducts = res.data.data; // Save to global cache
        setProductData(status === 'Home' ? res.data.data.filter((item) => item?.ActiveonHome === true) : res.data.data || grouped);
      }
    } catch (err) {
      console.error("Product Fetch error:", err);
    }
  };

  useEffect(() => {
    const stored = sessionStorage.getItem("wishlist");
    if (stored) {
      setWishlist(JSON.parse(stored));
    }
  }, []);

  // Handle product card click navigation
  const handleProductClick = (productName) => {
    navigate(`/product-details/${productName}`);
  };

  // Handle wishlist toggle (prevents event bubbling)
  const handleWishlistClick = (e, productId) => {
    e.stopPropagation(); // Prevents the card click event

    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to use wishlist",
      });
      navigate("/login");
      return;
    }

    setWishlist((prev) => {
      const isExist = prev.includes(productId);
      const updated = isExist
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];

      // ✅ update session
      sessionStorage.setItem("wishlist", JSON.stringify(updated));

      // ✅ call API (fire and forget)
      handleWishlistApi(productId, isExist);

      return updated;
    });
  };

  const handleWishlistApi = async (productId, isRemoving) => {
    console.log("isRemoving==>", isRemoving);
    try {
      if (isRemoving) {
        // ✅ REMOVE from wishlist
        await axios.delete("https://api.cakenpetals.com/api/wishlist/remove-wishlist", {
          data: {
            user: user,
            productId: productId,
          },
        });
      } else {
        // ✅ ADD to wishlist
        await axios.post("https://api.cakenpetals.com/api/wishlist/add-wishlist", {
          user: user,
          productId: productId,
        });
      }
    } catch (error) {
      console.error("Wishlist API error:", error);
    }
  };

  // Handle Buy Now button click (prevents event bubbling)
  const handleBuyNowClick = (e, productName) => {
    e.stopPropagation(); // Prevents the card click event
    navigate(`/product-details/${productName?.replace(/\s+/g, "-")}`);
  };

  const count = productData?.length;
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
    infinite: count > 4,
    speed: 500,
    autoplay: true,
    slidesToShow: getSlidesToShow(4),
    slidesToScroll: 1,
    arrows: count > 4,
    autoplaySpeed: 3000,
    centerMode: count < 4,
    centerPadding: count < 4 ? "0px" : "0px",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: getSlidesToShow(3),
          infinite: count > 3,
          arrows: count > 3,
          centerMode: count < 3,
          centerPadding: "0px",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: getSlidesToShow(2),
          infinite: count > 2,
          arrows: count > 2,
          centerMode: count < 2,
          centerPadding: "0px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: getSlidesToShow(2),
          infinite: count > 1,
          arrows: count > 1,
          centerMode: count < 1,
          centerPadding: "0px",
        },
      },
    ],
  };


  return (
    <div className="container">
      <div className="mb-5">

        {/* PRODUCTS GRID */}
        {relatedProducts = 'relatedProducts' ? <div className="row g-4">
          <Slider {...settings}>
            {productData?.map((product) => (
              <div
                key={product?._id}
                className="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-6"
              >
                <div
                  className="product-card h-100 d-flex flex-column"
                  onClick={() => handleProductClick(product?.productName)}
                  style={{
                    cursor: "pointer",
                    borderRadius: "12px",
                    border: "1px solid #eaeaea",
                    overflow: "hidden",
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"}
                >

                  {/* IMAGE AREA */}
                  <div className="product-img position-relative custom-cs">
                    <img
                      src={`https://api.cakenpetals.com/${product.productImage[0]}`}
                      alt={product.productName}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />

                    {/* ❤️ Floating Circular Wishlist */}
                    <span
                      className="wishlist d-flex align-items-center justify-content-center"
                      onClick={(e) => handleWishlistClick(e, product?._id)}
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        width: "32px",
                        height: "32px",
                        backgroundColor: "#fff",
                        borderRadius: "50%",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                        zIndex: 10
                      }}
                    >
                      {wishlist?.includes(product?._id) ? (
                        <FaHeart color="#ff3b30" size={15} />
                      ) : (
                        <FaRegHeart color="#888" size={15} />
                      )}
                    </span>

                    {/* Premium Discount Badge */}
                    {product?.Variant[0]?.discountPrice && (
                      <span
                        style={{
                          position: "absolute",
                          top: "10px",
                          left: "0",
                          backgroundColor: "#388e3c",
                          color: "#fff",
                          fontSize: "11px",
                          fontWeight: "700",
                          padding: "4px 8px",
                          borderTopRightRadius: "4px",
                          borderBottomRightRadius: "4px",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                        }}
                      >
                        {product?.Variant[0]?.discountPrice}% OFF
                      </span>
                    )}
                  </div>

                  {/* CONTENT AREA */}
                  <div className="product-body p-3 d-flex flex-column" style={{ flexGrow: 1 }}>

                    {/* Micro-Badges */}
                    <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">

                      {product?.eggless && <span style={{ fontSize: "10px", fontWeight: "700", color: "#388e3c", border: "1px solid #388e3c", padding: "2px 6px", borderRadius: "3px", letterSpacing: "0.3px" }}>
                        <LuEggOff /> EGGLESS
                      </span>}
                      {product.deliveryTo60Min && <span style={{ fontSize: "10px", fontWeight: "600", backgroundColor: "#e0f2f1", color: "#00796b", padding: "3px 6px", borderRadius: "3px" }}>
                        ⚡ 30 Min Delivery
                      </span>}
                    </div>

                    {/* Title (Clamped to 2 lines to keep grid neat) */}
                    <p className="product-title mb-2" style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#222",
                      lineHeight: "1.4",
                      display: "-webkit-box",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}>
                      {product?.productName?.charAt(0).toUpperCase() + product?.productName?.slice(1)}
                    </p>

                    {/* Spacer to push pricing and rating to the bottom */}
                    <div style={{ marginTop: "auto" }}>

                      {/* Rating Box */}
                      <div className="rating d-flex align-items-center gap-2 mb-2">
                        <span style={{ backgroundColor: "#388e3c", color: "#fff", padding: "2px 5px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "2px" }}>
                          ★ 4.8
                        </span>
                        <span style={{ fontSize: "11px", color: "#007185", fontWeight: "500" }}>245 Reviews</span>
                      </div>

                      {/* Price Row */}
                      <div className="price-row d-flex align-items-baseline gap-2">
                        <span className="price" style={{ fontSize: "16px", color: "#111" }}>
                          ₹ {product?.Variant[0]?.finalPrice}
                        </span>
                        {product?.Variant[0]?.price && product?.Variant[0]?.price !== product?.Variant[0]?.finalPrice && (
                          <span className="old-price" style={{ fontSize: "13px", color: "#999", textDecoration: "line-through", fontWeight: "500" }}>
                            ₹ {product?.Variant[0]?.price}
                          </span>
                        )}
                      </div>

                    </div>

                  </div>

                </div>
              </div>
            ))}
          </Slider>
        </div> : <div className="row g-4">
          {productData?.map((product) => (
            <div
              key={product?._id}
              className="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-6"
            >
              <div
                className="product-card h-100 d-flex flex-column"
                onClick={() => handleProductClick(product?.productName)}
                style={{
                  cursor: "pointer",
                  borderRadius: "12px",
                  border: "1px solid #eaeaea",
                  overflow: "hidden",
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"}
              >

                {/* IMAGE AREA */}
                <div className="product-img position-relative custom-cs">
                  <img
                    src={`https://api.cakenpetals.com/${product.productImage[0]}`}
                    alt={product.productName}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />

                  {/* ❤️ Floating Circular Wishlist */}
                  <span
                    className="wishlist d-flex align-items-center justify-content-center"
                    onClick={(e) => handleWishlistClick(e, product?._id)}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      width: "32px",
                      height: "32px",
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      zIndex: 10
                    }}
                  >
                    {wishlist?.includes(product?._id) ? (
                      <FaHeart color="#ff3b30" size={15} />
                    ) : (
                      <FaRegHeart color="#888" size={15} />
                    )}
                  </span>

                  {/* Premium Discount Badge */}
                  {product?.Variant[0]?.discountPrice && (
                    <span
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "0",
                        backgroundColor: "#388e3c",
                        color: "#fff",
                        fontSize: "11px",
                        fontWeight: "700",
                        padding: "4px 8px",
                        borderTopRightRadius: "4px",
                        borderBottomRightRadius: "4px",
                        letterSpacing: "0.5px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                      }}
                    >
                      {product?.Variant[0]?.discountPrice}% OFF
                    </span>
                  )}
                </div>

                {/* CONTENT AREA */}
                <div className="product-body p-3 d-flex flex-column" style={{ flexGrow: 1 }}>

                  {/* Micro-Badges */}
                  <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                    <span style={{ fontSize: "10px", fontWeight: "700", color: "#388e3c", border: "1px solid #388e3c", padding: "2px 6px", borderRadius: "3px", letterSpacing: "0.3px" }}>
                      <LuEggOff /> EGGLESS
                    </span>
                    <span style={{ fontSize: "10px", fontWeight: "600", backgroundColor: "#e0f2f1", color: "#00796b", padding: "3px 6px", borderRadius: "3px" }}>
                      ⚡ 30 Min Delivery
                    </span>
                  </div>

                  {/* Title (Clamped to 2 lines to keep grid neat) */}
                  <p className="product-title mb-2" style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#222",
                    lineHeight: "1.4",
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}>
                    {product?.productName?.charAt(0).toUpperCase() + product?.productName?.slice(1)}
                  </p>

                  {/* Spacer to push pricing and rating to the bottom */}
                  <div style={{ marginTop: "auto" }}>

                    {/* Rating Box */}
                    <div className="rating d-flex align-items-center gap-2 mb-2">
                      <span style={{ backgroundColor: "#388e3c", color: "#fff", padding: "2px 5px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "2px" }}>
                        ★ 4.8
                      </span>
                      <span style={{ fontSize: "11px", color: "#007185", fontWeight: "500" }}>245 Reviews</span>
                    </div>

                    {/* Price Row */}
                    <div className="price-row d-flex align-items-baseline gap-2">
                      <span className="price" style={{ fontSize: "16px", color: "#111" }}>
                        ₹ {product?.Variant[0]?.finalPrice}
                      </span>
                      {product?.Variant[0]?.price && product?.Variant[0]?.price !== product?.Variant[0]?.finalPrice && (
                        <span className="old-price" style={{ fontSize: "13px", color: "#999", textDecoration: "line-through", fontWeight: "500" }}>
                          ₹ {product?.Variant[0]?.price}
                        </span>
                      )}
                    </div>

                  </div>

                </div>

              </div>
            </div>
          ))}
        </div>}
      </div>
    </div>
  );
};

export default AllProducts;
