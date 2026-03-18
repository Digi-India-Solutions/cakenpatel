import React, { useState, useEffect, useCallback, memo } from "react";
import "./featureProduct.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { LuEggOff } from "react-icons/lu";
import { IoIosStar } from "react-icons/io";

const BASE_URL = "https://api.cakenpetals.com/";

/* ========================================================
   GLOBAL CACHE
======================================================== */
let cachedFeaturedProducts = [];

/* ========================================================
   PRODUCT CARD (Memoized)
======================================================== */

const ProductCard = memo(
  ({ item, wishlist, toggleWishlist, handleProductClick }) => {
    const variant = item?.Variant?.[0] || {};
    const price = variant?.finalPrice || variant?.price || 0;
    const oldPrice = variant?.price;
    const discount = variant?.discountPrice;

    const image = item?.productImage?.[0]
      ? BASE_URL + item.productImage[0].replace(/\\/g, "/")
      : "";

    return (
      <div className="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-6">
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
            transition: "all 0.3s ease",
          }}
        >
          {/* IMAGE AREA */}
          <div className="product-img position-relative custom-cs">
            <img
              src={image}
              alt={item.productName}
              loading="lazy"
              decoding="async"
              width="300"
              height="300"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

            {/* Wishlist */}
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
                zIndex: 10,
              }}
            >
              {wishlist.includes(item._id) ? (
                <FaHeart size={15} color="#ff3b30" />
              ) : (
                <FaRegHeart size={15} color="#888" />
              )}
            </span>

            {/* Discount Badge */}
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
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                {discount}% OFF
              </span>
            )}
          </div>

          {/* PRODUCT CONTENT */}
          <div className="product-body p-3 d-flex flex-column">
            {/* Micro badges */}
            <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
              {item.eggless && (
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    color: "#388e3c",
                    border: "1px solid #388e3c",
                    padding: "2px 6px",
                    borderRadius: "3px",
                  }}
                >
                  <LuEggOff /> EGGLESS
                </span>
              )}

              {item.deliveryTo60Min && (
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

            {/* Product Title */}
            <p
              className="product-title mb-2"
              style={{
                fontSize: "14px",
                fontWeight: "600",
                lineHeight: "1.4",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {item?.productName?.charAt(0).toUpperCase() +
                item?.productName?.slice(1)}
            </p>

            {/* Subcategory */}
            {item.subcategoryName?.subcategoryName && (
              <p
                style={{
                  fontSize: "12px",
                  color: "#777",
                  marginBottom: "6px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.subcategoryName.subcategoryName}
              </p>
            )}

            {/* Price */}
            <div className="price-row d-flex align-items-baseline gap-2">
              <span style={{ fontSize: "16px", color: "#111" }}>₹ {price}</span>

              {oldPrice && oldPrice !== price && (
                <span
                  style={{
                    fontSize: "13px",
                    color: "#999",
                    textDecoration: "line-through",
                  }}
                >
                  ₹ {oldPrice}
                </span>
              )}
            </div>

            <div className="rating">
              <IoIosStar className="text-warning" /> 4.8{" "}
              <span>(245 Reviews)</span>
            </div>

            <p className="delivery" style={{ marginTop: "8px" }}>
              Earliest Delivery : <span>In 3 hours</span>
            </p>
          </div>
        </div>
      </div>
    );
  },
);

/* ========================================================
   MAIN COMPONENT
======================================================== */

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const user = sessionStorage.getItem("userId");

  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState(cachedFeaturedProducts);

  /* Load Wishlist */

  useEffect(() => {
    const stored = sessionStorage.getItem("wishlist");
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

  /* Fetch Products */

  const fetchFeaturedProducts = useCallback(async () => {
    if (cachedFeaturedProducts.length) {
      setProducts(cachedFeaturedProducts);
      return;
    }

    try {
      const response = await axios.get(
        "https://api.cakenpetals.com/api/get-featuredProducts",
      );

      const fetchedProducts = response?.data?.data || [];

      cachedFeaturedProducts = fetchedProducts;

      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching featured products:", error);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  /* Navigate Product */

  const handleProductClick = useCallback(
    (productName) => {
      navigate(`/product-details/${productName.replace(/\s+/g, "-")}`);
    },
    [navigate],
  );

  /* Toggle Wishlist */

  const toggleWishlist = useCallback(
    (productId) => {
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

        sessionStorage.setItem("wishlist", JSON.stringify(updated));

        handleWishlistApi(productId, isExist);

        return updated;
      });
    },
    [navigate, user],
  );

  /* Wishlist API */

  const handleWishlistApi = async (productId, isRemoving) => {
    try {
      if (isRemoving) {
        await axios.delete(
          "https://api.cakenpetals.com/api/wishlist/remove-wishlist",
          {
            data: { user, productId },
          },
        );
      } else {
        await axios.post(
          "https://api.cakenpetals.com/api/wishlist/add-wishlist",
          { user, productId },
        );
      }
    } catch (error) {
      console.error("Wishlist API error:", error);
    }
  };

  return (
    <div className="container my-5 featured-products">
      {/* HEADER */}

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

      {/* PRODUCTS */}

      <div className="row g-4">
        {products.map((item) => (
          <ProductCard
            key={item._id}
            item={item}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            handleProductClick={handleProductClick}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
