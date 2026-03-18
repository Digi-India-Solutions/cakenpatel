import React, { useEffect, useState, useCallback } from "react";
import "./allproducts.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Swal from "sweetalert2";
import Slider from "react-slick";
import { LuEggOff } from "react-icons/lu";

let cachedMainCategories = null;
let cachedAllProducts = null;

const AllProducts = ({ status = "", relatedProducts = "" }) => {
  const navigate = useNavigate();
  const user = sessionStorage.getItem("userId");

  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem("wishlist");
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

  const fetchCategories = async () => {
    if (cachedMainCategories) {
      setCategoryData(
        status === "Home"
          ? cachedMainCategories.filter((c) => c?.ActiveonHome)
          : cachedMainCategories,
      );
      return;
    }

    try {
      const res = await axios.get(
        "https://api.cakenpetals.com/api/get-main-category",
      );

      cachedMainCategories = res.data?.data;

      setCategoryData(
        status === "Home"
          ? res.data.data.filter((c) => c?.ActiveonHome)
          : res.data.data,
      );
    } catch (err) {
      console.error("Category Fetch error:", err);
    }
  };

  const fetchProducts = async () => {
    if (cachedAllProducts) {
      setProductData(
        status === "Home"
          ? cachedAllProducts.filter((p) => p?.ActiveonHome)
          : cachedAllProducts,
      );
      return;
    }

    try {
      const res = await axios.get(
        "https://api.cakenpetals.com/api/all-product",
      );

      cachedAllProducts = res.data?.data;

      setProductData(
        status === "Home"
          ? res.data.data.filter((p) => p?.ActiveonHome)
          : res.data.data,
      );
    } catch (err) {
      console.error("Product Fetch error:", err);
    }
  };

  const handleProductClick = useCallback(
    (productName) => {
      navigate(`/product-details/${productName?.replace(/\s+/g, "-")}`);
    },
    [navigate],
  );

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

  const settings = {
    dots: false,
    infinite: productData.length > 4,
    speed: 500,
    autoplay: true,
    slidesToShow: Math.min(4, productData.length),
    slidesToScroll: 1,
    autoplaySpeed: 3000,
  };

  const renderProductCard = (product, index) => {
    const variant = product?.Variant?.[0] || {};
    const image = product?.productImage?.[0];

    return (
      <div
        key={product?._id}
        className="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-6"
      >
        <div
          className="product-card"
          onClick={() => handleProductClick(product?.productName)}
        >
          <div className="product-img position-relative">
            <img
              src={`https://api.cakenpetals.com/${image}`}
              alt={product?.productName}
              loading={index < 4 ? "eager" : "lazy"}
            />

            <span
              className="wishlist"
              onClick={(e) => handleWishlistClick(e, product?._id)}
            >
              {wishlist?.includes(product?._id) ? (
                <FaHeart color="#ff3b30" />
              ) : (
                <FaRegHeart />
              )}
            </span>

            {variant?.discountPrice && (
              <span className="off-badge">{variant.discountPrice}% OFF</span>
            )}
          </div>

          <div className="product-body">
            <div className="d-flex gap-2 mb-2">
              {product?.eggless && (
                <span className="eggless">
                  <LuEggOff /> EGGLESS
                </span>
              )}
            </div>

            <p className="product-title">{product?.productName}</p>

            <div className="rating">
              ★ 4.8 <span>(245 Reviews)</span>
            </div>

            <div className="price-row">
              <span className="price">₹ {variant?.finalPrice}</span>

              {variant?.price !== variant?.finalPrice && (
                <span className="old-price">₹ {variant?.price}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="mb-5">
        {relatedProducts === "relatedProducts" ? (
          <Slider {...settings}>
            {productData?.map((p, i) => renderProductCard(p, i))}
          </Slider>
        ) : (
          <div className="row g-4">
            {productData?.map((p, i) => renderProductCard(p, i))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
