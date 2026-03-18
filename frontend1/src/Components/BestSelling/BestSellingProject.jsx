import React, { useState, useEffect, useCallback, memo } from "react";
import "./bestSelling.css";
import axios from "axios";
import Swal from "sweetalert2";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { IoIosStar } from "react-icons/io";
import { useNavigate } from "react-router-dom";

/* ========================================================
   GLOBAL CACHE
   Prevents re-fetching products when navigating
======================================================== */
let cachedBestSellingProducts = [];

/* ========================================================
   PRODUCT CARD COMPONENT (Memoized)
======================================================== */
const ProductCard = memo(
  ({ item, wishlist, handleProductClick, handleWishlistClick }) => {
    const variant = item?.Variant?.[0] || {};
    const image = item?.productImage?.[0]?.replace(/\\/g, "/");

    const price = variant.finalPrice || variant.price || 0;
    const oldPrice = variant.discountPrice ? variant.price : null;

    return (
      <div className="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-6">
        <div
          className="product-card"
          onClick={() => handleProductClick(item?.productName)}
          style={{ cursor: "pointer" }}
        >
          {/* Product Image */}
          <div className="product-img">
            <img
              src={`https://api.cakenpetals.com/${image}`}
              alt={item.productName}
              loading="lazy"
              decoding="async"
              width="300"
              height="300"
            />

            {/* Discount Badge */}
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
                {variant.discountPrice}% OFF
              </span>
            )}

            {/* Wishlist Icon */}
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

          {/* Product Info */}
          <div className="product-body">
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

            <p className="product-title mt-2">
              {item?.productName?.charAt(0).toUpperCase() +
                item?.productName?.slice(1)}
            </p>

            <div className="price-row">
              <span className="price">₹ {price}</span>

              {oldPrice && <span className="old-price">₹ {oldPrice}</span>}
            </div>

            <div className="rating">
              <IoIosStar className="text-warning" /> 4.8{" "}
              <span>(245 Reviews)</span>
            </div>

            <p className="delivery">
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

const BestSellingProduct = () => {
  const user = sessionStorage.getItem("userId");
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState(cachedBestSellingProducts);

  /* ========================================================
     FETCH PRODUCTS
  ======================================================== */
  const fetchBestSellingProducts = useCallback(async () => {
    if (cachedBestSellingProducts.length) {
      setProducts(cachedBestSellingProducts);
      return;
    }

    try {
      const response = await axios.get(
        "https://api.cakenpetals.com/api/get-best-selling-products",
      );

      const fetchedProducts = response?.data?.data || [];

      cachedBestSellingProducts = fetchedProducts;
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching best selling products:", error);
    }
  }, []);

  useEffect(() => {
    fetchBestSellingProducts();
  }, [fetchBestSellingProducts]);

  /* ========================================================
     LOAD WISHLIST
  ======================================================== */
  useEffect(() => {
    const stored = sessionStorage.getItem("wishlist");
    if (stored) {
      setWishlist(JSON.parse(stored));
    }
  }, []);

  /* ========================================================
     NAVIGATE PRODUCT
  ======================================================== */
  const handleProductClick = useCallback(
    (productName) => {
      navigate(`/product-details/${productName.replace(/\s+/g, "-")}`);
    },
    [navigate],
  );

  /* ========================================================
     WISHLIST CLICK
  ======================================================== */
  const handleWishlistClick = useCallback(
    (e, productId) => {
      e.stopPropagation();

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

  /* ========================================================
     WISHLIST API
  ======================================================== */
  const handleWishlistApi = async (productId, isRemoving) => {
    try {
      if (isRemoving) {
        await axios.delete(
          "https://api.cakenpetals.com/api/wishlist/remove-wishlist",
          {
            data: {
              user,
              productId,
            },
          },
        );
      } else {
        await axios.post(
          "https://api.cakenpetals.com/api/wishlist/add-wishlist",
          {
            user,
            productId,
          },
        );
      }
    } catch (error) {
      console.error("Wishlist API error:", error);
    }
  };

  /* ========================================================
     RENDER
  ======================================================== */

  return (
    <div className="container my-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="BestSellingtitle SuperTitle mb-1">
            Best Selling Flowers & Gifts
          </h4>

          <p className="text-muted SuperSubTitle mb-0">
            Surprise Your Loved Ones
          </p>
        </div>

        <button
          className="btn viewBtn px-4"
          onClick={() => navigate(`/all-products`)}
        >
          View All
        </button>
      </div>

      {/* Product Grid */}
      <div className="row g-4">
        {products.map((item) => (
          <ProductCard
            key={item._id}
            item={item}
            wishlist={wishlist}
            handleProductClick={handleProductClick}
            handleWishlistClick={handleWishlistClick}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSellingProduct;
