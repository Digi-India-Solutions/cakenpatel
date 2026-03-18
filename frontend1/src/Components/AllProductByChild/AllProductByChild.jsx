import React, { useEffect, useState, useCallback } from "react";
import "./AllProductByChild.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { IoIosStar } from "react-icons/io";
import { LuEggOff } from "react-icons/lu";

const AllProductByChild = ({ cakesArr = [] }) => {
  const user = sessionStorage.getItem("userId");
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  /* Scroll to top when page loads */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* Load wishlist from session */
  useEffect(() => {
    const storedWishlist = sessionStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  /* Navigate to product page */
  const handleCardClick = useCallback(
    (product) => {
      navigate(
        `/product-details/${product?.productName.replace(/\s+/g, "-")}`,
        {
          state: { id: product?._id, status: "product" },
        },
      );
    },
    [navigate],
  );

  /* Wishlist API */
  const handleWishlistApi = async (productId, isRemoving) => {
    try {
      if (isRemoving) {
        await axios.delete(
          "https://api.cakenpetals.com/api/wishlist/remove-wishlist",
          {
            data: {
              user: user,
              productId: productId,
            },
          },
        );
      } else {
        await axios.post(
          "https://api.cakenpetals.com/api/wishlist/add-wishlist",
          {
            user: user,
            productId: productId,
          },
        );
      }
    } catch (error) {
      console.error("Wishlist API error:", error);
    }
  };

  /* Toggle wishlist */
  const toggleWishlist = useCallback(
    (e, productId) => {
      e.stopPropagation();
      e.preventDefault();

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

        const updatedWishlist = isExist
          ? prev.filter((id) => id !== productId)
          : [...prev, productId];

        sessionStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

        handleWishlistApi(productId, isExist);

        return updatedWishlist;
      });
    },
    [user, navigate],
  );

  return (
    <div className="container my-5">
      <div className="row g-4">
        {cakesArr?.map((product, index) => {
          const variant = product?.Variant?.[0] || {};
          const image = product?.productImage?.[0]?.replace(/\\/g, "/") || "";

          return (
            <div
              key={product?._id}
              className="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-6"
              onClick={() => handleCardClick(product)}
              style={{ cursor: "pointer" }}
            >
              <div className="product-card">
                <div className="product-img">
                  <img
                    src={`https://api.cakenpetals.com/${image}`}
                    alt={product?.productName}
                    loading={index < 4 ? "eager" : "lazy"}
                  />

                  {/* Wishlist */}
                  <span
                    className="wishlist"
                    onClick={(e) => toggleWishlist(e, product._id)}
                  >
                    {wishlist.includes(product?._id) ? (
                      <FaHeart color="red" />
                    ) : (
                      <FaRegHeart />
                    )}
                  </span>

                  {variant?.discountPrice && (
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
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      }}
                    >
                      {variant?.discountPrice}% OFF
                    </span>
                  )}
                </div>

                <div className="product-body">
                  <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                    {product?.eggless && (
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: "700",
                          color: "#388e3c",
                          border: "1px solid #388e3c",
                          padding: "2px 6px",
                          borderRadius: "3px",
                          letterSpacing: "0.3px",
                        }}
                      >
                        <LuEggOff /> EGGLESS
                      </span>
                    )}

                    {product?.deliveryTo60Min && (
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: "600",
                          backgroundColor: "#e0f2f1",
                          color: "#00796b",
                          padding: "3px 6px",
                          borderRadius: "3px",
                        }}
                      >
                        ⚡ 30 Min Delivery
                      </span>
                    )}
                  </div>

                  <p className="product-title">{product?.productName}</p>

                  <div className="price-row">
                    <span className="price">₹ {variant?.finalPrice}</span>

                    {variant?.discountPrice > 0 && (
                      <span className="old-price">₹ {variant?.price}</span>
                    )}
                  </div>

                  <div className="rating">
                    <IoIosStar className="text-warning" /> 4.8
                    <span> (245 Reviews)</span>
                  </div>

                  <p className="delivery">
                    Earliest Delivery : <span>In 3 hours</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllProductByChild;
