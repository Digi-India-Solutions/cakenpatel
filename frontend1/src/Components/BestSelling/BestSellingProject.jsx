import React, { useState } from "react";
import "./bestSelling.css";
import pic1 from "../../images/pic/Product1.avif";
import pic2 from "../../images/pic/Product2.avif";
import pic3 from "../../images/pic/Product3.avif";
import pic4 from "../../images/pic/Product4.avif";
import pic5 from "../../images/pic/Product4.avif";
import pic6 from "../../images/pic/Product4.avif";
import pic7 from "../../images/pic/Product4.avif";
import pic8 from "../../images/pic/Product4.avif";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { IoIosStar } from "react-icons/io";

// ========================================================
// PERFORMANCE FIX: GLOBAL CACHE
// Prevents re-fetching the product list every time the 
// component mounts when navigating between pages.
// ========================================================
let cachedBestSellingProducts = null;

const BestSellingProduct = () => {
  // ✅ Wishlist state
  const user = sessionStorage.getItem("userId");
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);

  // Use cached data immediately if we have it
  const [products, setProducts] = useState(cachedBestSellingProducts || []);

  const fetchBestSellingProducts = async () => {
    // PERFORMANCE FIX: If data is already cached, do not ping the server!
    if (cachedBestSellingProducts) return;

    try {
      const response = await axios.get(
        "https://api.cakenpetals.com/api/get-best-selling-products"
      );
      console.log("SSSS==>", response)
      const fetchedProducts = response?.data?.data || [];
      cachedBestSellingProducts = fetchedProducts; // Save to global cache
      setProducts(fetchedProducts);

    } catch (error) {
      console.error("Error fetching featured products:", error);
    }
  };

  useEffect(() => {
    fetchBestSellingProducts();
  }, []);

  // ✅ Toggle wishlist
  useEffect(() => {
    const stored = sessionStorage.getItem("wishlist");
    if (stored) {
      setWishlist(JSON.parse(stored));
    }
  }, []);

  // Handle product card click navigation
  const handleProductClick = (productName) => {
    navigate(`/product-details/${productName.replace(/\s+/g, "-")}`);
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
    navigate(`/product-details/${productName}`);
  };

  return (
    <div className="container my-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className=" BestSellingtitle SuperTitle mb-1">
            Best Selling Flowers & Gifts
          </h4>
          <p className="text-muted  SuperSubTitle mb-0">Surprise Your Loved Ones</p>
        </div>
        <button className="btn viewBtn px-4" onClick={() => navigate(`/all-products`)}>View All</button>
      </div>

      {/* Product Grid */}
      <div className="row g-4">
        {products.map((item) => {
          const variant = item?.Variant?.[0] || {};
          const image = item?.productImage?.[0]?.replace(/\\/g, "/");

          const price = variant.finalPrice || variant.price || 0;
          const oldPrice = variant.discountPrice ? variant.price : null;
          const off = variant.discountPrice ? `${variant.discountPrice}% OFF` : null;

          return (
            <div
              className="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-6"
              key={item._id}
            >
              <div
                className="product-card"
                onClick={() => handleProductClick(item?.productName)}
                style={{ cursor: "pointer" }}
              >

                {/* Image */}
                <div className="product-img">
                  <img
                    src={`https://api.cakenpetals.com/${image}`}
                    alt={item.productName}
                  />

                  {variant?.discountPrice && (
                    <span style={{
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
                    }} className="">
                      {variant?.discountPrice}% OFF
                    </span>
                  )}

                  <span
                    className="wishlist"
                    onClick={(e) => handleWishlistClick(e, item._id)}
                  >
                    {wishlist?.includes(item?._id) ? (
                      <FaHeart color="red" />
                    ) : (
                      <FaRegHeart />
                    )}
                  </span>
                </div>

                {/* Content */}
                <div className="product-body">
                  <p className="product-title">{item.productName?.charAt(0).toUpperCase() + item.productName?.slice(1)}</p>

                  <div className="price-row">
                    <span className="price">₹ {price}</span>
                    {oldPrice && (
                      <>
                        <span className="old-price">₹ {oldPrice}</span>
                        {/* <span className="off">{off}</span> */}
                      </>
                    )}
                  </div>
                  <div className="rating">
                    <IoIosStar className="text-warning" /> 4.8 <span>(245 Reviews)</span>
                  </div>
                  {/* <div className="rating">
                    ⭐ 4.8 <span>(245 Reviews)</span>
                  </div> */}

                  <p className="delivery">
                    Earliest Delivery : <span>In 3 hours</span>
                  </p>

                  {/* <button
                    className="btn btn-dark w-100 mt-2"
                    onClick={(e) => handleBuyNowClick(e, item?.productName)}
                  >
                    Buy Now
                  </button> */}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BestSellingProduct;