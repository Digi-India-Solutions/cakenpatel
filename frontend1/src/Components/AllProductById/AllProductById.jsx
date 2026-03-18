import React, { useEffect, useMemo, useState, useCallback } from "react";
import "./allproducts.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const AllProductById = ({ cakesArr = [] }) => {
  const user = sessionStorage.getItem("userId");
  const [currentPage, setCurrentPage] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const productsPerPage = 20;

  /* Scroll to top */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* Load wishlist */
  useEffect(() => {
    const stored = sessionStorage.getItem("wishlist");
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

  /* Navigate to product page */
  const handleCardClick = useCallback(
    (product) => {
      navigate(
        `/product-details/${product?.productName?.replace(/\s+/g, "-")}`,
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
        const exists = prev.includes(productId);

        const updated = exists
          ? prev.filter((id) => id !== productId)
          : [...prev, productId];

        sessionStorage.setItem("wishlist", JSON.stringify(updated));

        handleWishlistApi(productId, exists);

        return updated;
      });
    },
    [user, navigate],
  );

  /* Group products by category */
  const groupedData = useMemo(() => {
    const map = {};

    for (const product of cakesArr) {
      const catId = product?.categoryName?._id;
      if (!catId) continue;

      if (!map[catId]) {
        map[catId] = {
          category: product.categoryName,
          products: [],
        };
      }

      map[catId].products.push(product);
    }

    return Object.values(map);
  }, [cakesArr]);

  return (
    <div className="container my-5">
      {groupedData.map(({ category, products }) => {
        const page = currentPage[category._id] || 1;
        const start = (page - 1) * productsPerPage;
        const visibleProducts = products.slice(start, start + productsPerPage);

        return (
          <div key={category._id} className="mb-5">
            {/* CATEGORY HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="fw-bold mb-1 text-uppercase">
                  {category?.mainCategoryName}
                </h4>
                <p className="text-muted mb-0">
                  Best Gifts For Your Loved Ones
                </p>
              </div>
            </div>

            {/* PRODUCTS GRID */}
            <div className="row g-4">
              {visibleProducts.map((product, index) => {
                const variant = product?.Variant?.[0] || {};
                const image =
                  product?.productImage?.[0]?.replace(/\\/g, "/") || "";

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

                        {variant?.discountPrice > 0 && (
                          <span className="off-badge">
                            {variant.discountPrice}% OFF
                          </span>
                        )}
                      </div>

                      <div className="product-body">
                        <p className="product-title">{product?.productName}</p>

                        <div className="price-row">
                          <span className="price">₹ {variant?.finalPrice}</span>
                        </div>

                        <div className="rating">
                          ⭐ 4.8 <span>(245 Reviews)</span>
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
      })}
    </div>
  );
};

export default AllProductById;
