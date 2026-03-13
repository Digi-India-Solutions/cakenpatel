import React, { useState, useEffect } from "react";
import "./featureProduct.css";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { LuEggOff } from "react-icons/lu";
import { IoIosStar } from "react-icons/io";

const BASE_URL = "https://api.cakenpetals.com/";

// ========================================================
// PERFORMANCE FIX: GLOBAL CACHE
// Prevents re-fetching the featured products every time 
// the component mounts when navigating between pages.
// ========================================================
let cachedFeaturedProducts = null;

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const user = sessionStorage.getItem("userId");
  const [wishlist, setWishlist] = useState([]);

  // Use cached data immediately if we have it
  const [products, setProducts] = useState(cachedFeaturedProducts || []);

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
    // PERFORMANCE FIX: If data is already cached, do not ping the server!
    if (cachedFeaturedProducts) return;

    try {
      const response = await axios.get(
        "https://api.cakenpetals.com/api/get-featuredProducts"
      );
      const fetchedProducts = response?.data?.data || [];

      cachedFeaturedProducts = fetchedProducts; // Save to global cache
      setProducts(fetchedProducts);
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
                <div className="product-img position-relative custom-cs">
                  <img
                    src={getImageUrl(item.productImage?.[0])}
                    alt={item.productName}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />

                  {/* ❤️ Floating Circular Wishlist */}
                  <span
                    className="wishlist d-flex align-items-center justify-content-center"
                    onClick={(e) => {
                      e.stopPropagation();
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
                    {item.deliveryTo60Min && <span style={{ fontSize: "10px", fontWeight: "600", backgroundColor: "#e0f2f1", color: "#00796b", padding: "3px 6px", borderRadius: "3px" }}>
                      ⚡ 30 Min Delivery
                    </span>}
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
                  <div>

                    {/* Subcategory Label */}
                    {item.subcategoryName?.subcategoryName && (
                      <p style={{ fontSize: "12px", color: "#777", marginBottom: "6px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.subcategoryName.subcategoryName}
                      </p>
                    )}

                    {/* Price Row */}
                    <div className="price-row d-flex align-items-baseline gap-2">
                      <span className="price" style={{ fontSize: "16px", color: "#111" }}>
                        ₹ {price}
                      </span>
                      {oldPrice && oldPrice !== price && (
                        <span className="old-price" style={{ fontSize: "13px", color: "#999", textDecoration: "line-through", fontWeight: "500" }}>
                          ₹ {oldPrice}
                        </span>
                      )}
                    </div>

                    <div className="rating">
                      <IoIosStar className="text-warning" /> 4.8 <span>(245 Reviews)</span>
                    </div>
                    <p className="delivery" style={{ marginTop: '8px' }}>
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