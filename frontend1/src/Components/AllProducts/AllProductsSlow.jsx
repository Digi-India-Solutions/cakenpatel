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


const AllProducts = ({ status = '', relatedProducts = '' }) => {
  const navigate = useNavigate();
  const user = sessionStorage.getItem("userId");
  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [currentPage, setCurrentPage] = useState({});
  const [wishlist, setWishlist] = useState([]); // ✅ fixed initial state
  const productsPerPage = 20;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    getApiData();
    getApiProductData();
  }, []);

  const getApiData = async () => {
    const res = await axios.get(
      `https://api.cakenpetals.com/api/get-main-category`
    );
    if (res.status === 200) {
      setCategoryData(status === 'Home' ? res.data?.data?.filter((item) => item?.ActiveonHome === true) : res?.data?.data);
      const pageState = {};
      res.data.data.forEach((c) => (pageState[c?._id] = 1));
      setCurrentPage(pageState);
    }
  };

  const getApiProductData = async () => {
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
      setProductData(status === 'Home' ? res.data.data.filter((item) => item?.ActiveonHome === true) : res.data.data || grouped);
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
    autoplay: count > 4,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    centerMode: count < 4,
    centerPadding: count < 4 ? "0px" : "0px",
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
          slidesToShow: getSlidesToShow(1),
          infinite: count > 1,
          arrows: count > 1,
          centerMode: count < 1,
          centerPadding: "0px",
        },
      },
    ],
  };

  return (
    <div className="container my-5">
      {/* {categoryData?.map((category) => {
        const products = productData[category?._id] || [];
        const start = (currentPage[category?._id] - 1) * productsPerPage;
        const visible = products.slice(start, start + productsPerPage);
        console.log("visible==>", visible)
        return ( */}
      <div className="mb-5">

        {/* CATEGORY HEADER */}
        {/* <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="textArea">
                <h4 className="   SuperTitle mb-1 text-uppercase">
                  {category?.mainCategoryName?.charAt(0).toUpperCase() + category?.mainCategoryName?.slice(1)}
                </h4>
                <p className="  SuperSubTitle text-muted mb-0">Best Gifts For Your Loved Ones</p>
              </div>
            </div> */}

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
      {/* );
      })} */}
    </div>
  );
};

export default AllProducts;

// import React, { useEffect, useState } from "react";
// import "./allproducts.css";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import Swal from "sweetalert2";

// const AllProducts = ({ status = "" }) => {
//   const navigate = useNavigate();
//   const user = sessionStorage.getItem("userId");
//   const [categoryData, setCategoryData] = useState([]);
//   const [productData, setProductData] = useState({});
//   const [currentPage, setCurrentPage] = useState({});
//   const [wishlist, setWishlist] = useState([]);
//   const productsPerPage = 20;

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//     fetchAll();
//   }, []);

//   useEffect(() => {
//     const stored = sessionStorage.getItem("wishlist");
//     if (stored) setWishlist(JSON.parse(stored));
//   }, []);

//   const fetchAll = async () => {
//     try {
//       const [catRes, prodRes] = await Promise.all([
//         axios.get(`https://api.cakenpetals.com/api/get-main-category`),
//         axios.get(`https://api.cakenpetals.com/api/all-product`),
//       ]);

//       // ✅ Group products by categoryId
//       const grouped = {};
//       prodRes.data.data.forEach((p) => {
//         const cid = p?.categoryName?._id;
//         if (!cid) return;
//         if (!grouped[cid]) grouped[cid] = [];
//         grouped[cid].push(p);
//       });
//       setProductData(grouped);

//       // ✅ Filter categories: ActiveonHome (if Home) + must have products
//       const allCats = catRes.data?.data || [];
//       const filtered = allCats.filter((c) => {
//         const hasProducts = (grouped[c._id] || []).length > 0; // ✅ Hide empty categories
//         const isActive = status === "Home" ? c?.ActiveonHome === true : true;
//         return hasProducts && isActive;
//       });

//       setCategoryData(filtered);

//       // ✅ Set page state only for valid categories
//       const pageState = {};
//       filtered.forEach((c) => (pageState[c._id] = 1));
//       setCurrentPage(pageState);

//     } catch (err) {
//       console.error("Fetch error:", err);
//     }
//   };

//   const handleProductClick = (product) => {
//     navigate(`/product-details/${product?.productName?.replace(/\s+/g, "-")}`, {
//       state: { id: product?._id, status: "product" },
//     });
//   };

//   const handleWishlistClick = (e, productId) => {
//     e.stopPropagation();
//     if (!user) {
//       Swal.fire({ icon: "warning", title: "Login Required", text: "Please login to use wishlist" });
//       navigate("/login");
//       return;
//     }
//     setWishlist((prev) => {
//       const isExist = prev.includes(productId);
//       const updated = isExist ? prev.filter((id) => id !== productId) : [...prev, productId];
//       sessionStorage.setItem("wishlist", JSON.stringify(updated));
//       handleWishlistApi(productId, isExist);
//       return updated;
//     });
//   };

//   const handleWishlistApi = async (productId, isRemoving) => {
//     try {
//       if (isRemoving) {
//         await axios.delete("https://api.cakenpetals.com/api/wishlist/remove-wishlist", {
//           data: { user, productId },
//         });
//       } else {
//         await axios.post("https://api.cakenpetals.com/api/wishlist/add-wishlist", {
//           user,
//           productId,
//         });
//       }
//     } catch (error) {
//       console.error("Wishlist API error:", error);
//     }
//   };

//   return (
//     <div className="container my-5">
//       {categoryData.map((category) => {
//         const products = productData[category._id] || [];
//         const page = currentPage[category._id] || 1;
//         const start = (page - 1) * productsPerPage;
//         const visible = products.slice(start, start + productsPerPage);
//         const totalPages = Math.ceil(products.length / productsPerPage);

//         return (
//           <div key={category._id} className="mb-5">

//             {/* CATEGORY HEADER */}
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <div className="textArea">
//                 <h4 className="SuperTitle mb-1 text-uppercase">
//                   {category?.mainCategoryName?.charAt(0).toUpperCase() +
//                     category?.mainCategoryName?.slice(1)}
//                 </h4>
//                 <p className="SuperSubTitle text-muted mb-0">
//                   Best Gifts For Your Loved Ones
//                 </p>
//               </div>
//             </div>

//             {/* PRODUCTS GRID */}
//             <div className="row g-4">
//               {visible.map((product) => {
//                 const variant = product?.Variant?.[0] || {};
//                 const image = product?.productImage?.[0]?.replace(/\\/g, "/");
//                 const isWishlisted = wishlist.includes(product._id);

//                 return (
//                   <div
//                     key={product._id}
//                     className="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-6"
//                     onClick={() => handleProductClick(product)}
//                     style={{ cursor: "pointer" }}
//                   >
//                     <div className="product-card">

//                       {/* IMAGE */}
//                       <div className="product-img">
//                         <img
//                           src={`https://api.cakenpetals.com/${image}`}
//                           alt={product.productName}
//                           onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder.jpg"; }}
//                         />

//                         {/* ❤️ Wishlist */}
//                         <span className="wishlist" onClick={(e) => handleWishlistClick(e, product._id)}>
//                           {isWishlisted ? <FaHeart color="red" /> : <FaRegHeart />}
//                         </span>

//                         {/* Eggless Badge */}
//                         {product?.eggless && (
//                           <span className="eggless-badge">🥚 Eggless</span>
//                         )}

//                         {/* Discount Badge */}
//                         {variant?.discountPrice > 0 && (
//                           <span className="off-badge">{variant.discountPrice}% OFF</span>
//                         )}
//                       </div>

//                       {/* CONTENT */}
//                       <div className="product-body">
//                         <p className="product-title">
//                           {product?.productName?.charAt(0).toUpperCase() +
//                             product?.productName?.slice(1)}
//                         </p>

//                         <div className="price-row">
//                           <span className="price">₹ {variant?.finalPrice}</span>
//                           {variant?.discountPrice > 0 && (
//                             <>
//                               <span className="old-price">₹ {variant?.price}</span>
//                               <span className="off">{variant?.discountPrice}% OFF</span>
//                             </>
//                           )}
//                         </div>

//                         <div className="rating">
//                           ⭐ 4.8 <span>(245 Reviews)</span>
//                         </div>

//                         <p className="delivery">
//                           Earliest Delivery: <span>In 3 hours</span>
//                         </p>
//                       </div>

//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* ✅ PAGINATION */}
//             {totalPages > 1 && (
//               <div className="d-flex justify-content-center mt-4 gap-2 flex-wrap">
//                 <button
//                   className="btn btn-outline-dark"
//                   disabled={page === 1}
//                   onClick={() => setCurrentPage((prev) => ({ ...prev, [category._id]: page - 1 }))}
//                 >
//                   ← Prev
//                 </button>
//                 {Array.from({ length: totalPages }, (_, i) => (
//                   <button
//                     key={i}
//                     className={`btn ${page === i + 1 ? "btn-dark" : "btn-outline-dark"}`}
//                     onClick={() => setCurrentPage((prev) => ({ ...prev, [category._id]: i + 1 }))}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//                 <button
//                   className="btn btn-outline-dark"
//                   disabled={page === totalPages}
//                   onClick={() => setCurrentPage((prev) => ({ ...prev, [category._id]: page + 1 }))}
//                 >
//                   Next →
//                 </button>
//               </div>
//             )}

//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default AllProducts;