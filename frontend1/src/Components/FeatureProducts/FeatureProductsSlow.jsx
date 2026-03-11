// import React, { useState } from "react";
// import "./featureProduct.css";
// import pic1 from "../../images/pic/Product1.avif";
// import pic2 from "../../images/pic/Product2.avif";
// import pic3 from "../../images/pic/Product3.avif";
// import pic4 from "../../images/pic/Product4.avif";
// import pic5 from "../../images/pic/Product4.avif";
// import pic6 from "../../images/pic/Product4.avif";
// import pic7 from "../../images/pic/Product4.avif";
// import pic8 from "../../images/pic/Product4.avif";
// import { Link } from "react-router-dom";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import axios from "axios";
// import { useEffect } from "react";

// /* 🔒 STATIC FEATURED PRODUCTS DATA */
// const featuredProductsData = [
//   {
//     id: 1,
//     name: "10 Red Roses Bouquet",
//     image: pic1,
//     price: 695,
//     oldPrice: 845,
//     rating: 4.9,
//     reviews: 1645,
//     delivery: "In 3 hours",
//   },
//   {
//     id: 2,
//     name: "Blush Heart Chocolate Cake",
//     image: pic2,
//     price: 775,
//     oldPrice: 995,
//     rating: 4.8,
//     reviews: 1022,
//     delivery: "In 3 hours",
//   },
//   {
//     id: 3,
//     name: "Aromatic Choco Hamper",
//     image: pic3,
//     price: 1165,
//     oldPrice: 1445,
//     rating: 4.7,
//     reviews: 812,
//     delivery: "In 3 hours",
//   },
//   {
//     id: 4,
//     name: "Twin Hearts Floral Balloon Bouquet",
//     image: pic4,
//     price: 1095,
//     oldPrice: 1445,
//     rating: 4.8,
//     reviews: 945,
//     delivery: "In 3 hours",
//   },
//   {
//     id: 5,
//     name: "Money Plant In Black Mandala Pot",
//     image: pic5,
//     price: 595,
//     oldPrice: 699,
//     rating: 4.6,
//     reviews: 3,
//     delivery: "Tomorrow",
//   },
//   {
//     id: 6,
//     name: "Purple Orchids n Floral Cake Combo",
//     image: pic6,
//     price: 1545,
//     oldPrice: 1695,
//     rating: 4.9,
//     reviews: 1190,
//     delivery: "In 3 hours",
//   },
//   {
//     id: 7,
//     name: "Blue Orchid Jute Bouquet",
//     image: pic7,
//     price: 895,
//     oldPrice: 1095,
//     rating: 4.9,
//     reviews: 482,
//     delivery: "In 3 hours",
//   },
//   {
//     id: 8,
//     name: "Bows N Blush Chocolate Cream Cake",
//     image: pic8,
//     price: 695,
//     oldPrice: null,
//     rating: 4.7,
//     reviews: 221,
//     delivery: "In 3 hours",
//   },
// ];


// const FeaturedProducts = () => {
//   // ✅ Wishlist state (store product IDs)
//   const [wishlist, setWishlist] = useState([]);
//   const [featuredProductsData, setFeaturedProductsData] = useState([]);
//   // ✅ Toggle wishlist per product
//   const toggleWishlist = (id) => {
//     setWishlist((prev) =>
//       prev.includes(id)
//         ? prev.filter((itemId) => itemId !== id) // remove
//         : [...prev, id] // add
//     );
//   };
//   const fetchFeaturedProducts = async () => {
//     try {
//       const response = await axios.get("https://api.cakenpetals.com/api/get-featuredProducts");
//       setFeaturedProductsData(response?.data?.data)
//       // const data = await response.json();
//       console.log("SSSSS::=>", response.data.data);
//     } catch (error) {
//       console.error("Error fetching featured products:", error);
//     }
//   }

//   useEffect(() => {
//     fetchFeaturedProducts();
//   }, [])
//   return (
//     <div className="container my-5 featured-products">
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h4 className="fw-bold featuretitle mb-1">Featured Products</h4>
//           <p className="text-muted mb-0">
//             Life Is Celebration - We Deliver Happiness
//           </p>
//         </div>
//         <button className="btn btn-dark px-4">View All</button>
//       </div>

//       {/* Product Grid */}
//       <div className="row g-4">
//         {featuredProductsData?.map((item) => (
//           <div
//             className="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-6"
//             key={item?._id}
//           >
//             <div className="product-card">
//               {/* Image */}
//               <div className="product-img">
//                 <img src={`https://api.cakenpetals.com/${item?.productImage[0] || item?.productImage}`} alt={item?.name} />

//                 {/* ❤️ Wishlist */}
//                 <span
//                   className="wishlist-icon"
//                   onClick={() => toggleWishlist(item?._id)}
//                 >
//                   {wishlist?.includes(item?._id) ? (
//                     <FaHeart size={22} color="red" />
//                   ) : (
//                     <FaRegHeart size={22} color="#555" />
//                   )}
//                 </span>
//               </div>

//               {/* Content */}
//               <div className="product-body">
//                 <p className="product-title">{item?.productName}</p>

//                 <div className="price-row">
//                   <span className="price">₹ {item.price}</span>

//                   {item.oldPrice && (
//                     <>
//                       <span className="old-price">₹ {item.oldPrice}</span>
//                       <span className="off">
//                         {Math.round(
//                           ((item.oldPrice - item.price) / item.oldPrice) * 100
//                         )}
//                         % OFF
//                       </span>
//                     </>
//                   )}
//                 </div>

//                 <div className="rating">
//                   ⭐ {item.rating} <span>({item.reviews} Reviews)</span>
//                 </div>

//                 <p className="delivery">
//                   Earliest Delivery : <span>{item.delivery}</span>
//                 </p>

//                 <Link
//                   to={`/product-details/${item.name}`}
//                   className="btn btn-dark w-100 mt-2"
//                 >
//                   Buy Now
//                 </Link>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FeaturedProducts;
import React, { useState, useEffect } from "react";
import "./featureProduct.css";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { LuEggOff } from "react-icons/lu";

const BASE_URL = "https://api.cakenpetals.com/";

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const user = sessionStorage.getItem("userId");
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("wishlist");
    if (stored) {
      setWishlist(JSON.parse(stored));
    }
  }, []);

  // get existing wishlist from session
  const toggleWishlist = async (productId) => {
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

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(
        "https://api.cakenpetals.com/api/get-featuredProducts"
      );
      setProducts(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching featured products:", error);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const getImageUrl = (path) => {
    if (!path) return "";
    return BASE_URL + path.replace(/\\/g, "/");
  };

  const handleProductClick = (productName) => {
    navigate(`/product-details/${productName.replace(/\s+/g, "-")}`);
  };

  return (
    <div className="container my-5 featured-products">

      {/* HEADER SECTION */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="SuperTitle mb-1">Featured Products</h4>
          <p className="text-muted SuperSubTitle mb-0">
            Life Is Celebration - We Deliver Happiness
          </p>
        </div>
        <Link to="/all-products" className="btn viewBg px-4">
          View All
        </Link>
      </div>

      {/* PRODUCTS GRID */}
      <div className="row g-4">
        {products.map((item) => {
          const variant = item.Variant?.[0];
          const price = variant?.finalPrice || variant?.price;
          const oldPrice = variant?.price;
          const discount = variant?.discountPrice;

          return (
            <div
              className="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-6"
              key={item._id}
            >
              {/* UI PATTERN: The Floating "Island" Card */}
              <div
                className="product-card h-100 d-flex flex-column"
                onClick={() => handleProductClick(item.productName)}
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
                <div className="product-img position-relative" style={{ height: "200px", width: "100%", backgroundColor: "#f9f9f9" }}>
                  <img
                    src={getImageUrl(item.productImage?.[0])}
                    alt={item.productName}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />

                  {/* ❤️ Floating Circular Wishlist */}
                  <span
                    className="wishlist d-flex align-items-center justify-content-center"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents navigating to product details when clicking the heart
                      toggleWishlist(item._id);
                    }}
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
                    {wishlist.includes(item._id) ? (
                      <FaHeart size={15} color="#ff3b30" />
                    ) : (
                      <FaRegHeart size={15} color="#888" />
                    )}
                  </span>

                  {/* UI PATTERN: Premium Discount Ribbon */}
                  {discount && (
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
                      {discount}% OFF
                    </span>
                  )}
                </div>

                {/* CONTENT AREA */}
                <div className="product-body p-3 d-flex flex-column" style={{ flexGrow: 1 }}>

                  {/* Micro-Badges */}
                  <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                    {item.eggless && (
                      <span style={{ fontSize: "10px", fontWeight: "700", color: "#388e3c", border: "1px solid #388e3c", padding: "2px 6px", borderRadius: "3px", letterSpacing: "0.3px" }}>
                        <LuEggOff /> EGGLESS
                      </span>
                    )}
                    <span style={{ fontSize: "10px", fontWeight: "600", backgroundColor: "#e0f2f1", color: "#00796b", padding: "3px 6px", borderRadius: "3px" }}>
                      ⚡ 30 Min Delivery
                    </span>
                  </div>

                  {/* Title (Clamped to 2 lines to keep grid perfectly neat) */}
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
                    {item?.productName?.charAt(0).toUpperCase() + item?.productName?.slice(1)}
                  </p>

                  {/* Spacer to push pricing & subcategory to the very bottom */}
                  <div style={{ marginTop: "auto" }}>

                    {/* Subcategory Label */}
                    {item.subcategoryName?.subcategoryName && (
                      <p style={{ fontSize: "12px", color: "#777", marginBottom: "6px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.subcategoryName.subcategoryName}
                      </p>
                    )}

                    {/* Price Row */}
                    <div className="price-row d-flex align-items-baseline gap-2">
                      <span className="price" style={{ fontSize: "16px", fontWeight: "700", color: "#111" }}>
                        ₹ {price}
                      </span>
                      {oldPrice && oldPrice !== price && (
                        <span className="old-price" style={{ fontSize: "13px", color: "#999", textDecoration: "line-through", fontWeight: "500" }}>
                          ₹ {oldPrice}
                        </span>
                      )}
                    </div>
                    <p className="delivery">
                      Earliest Delivery : <span>In 3 hours</span>
                    </p>
                  </div>

                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedProducts; 