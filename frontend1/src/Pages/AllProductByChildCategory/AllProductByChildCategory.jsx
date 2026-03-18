import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
//import Slider from "react-slick";
import axios from "axios";
import AllProducts from "../../Components/AllProducts/AllProducts";
import AllProductById from "../../Components/AllProductByChild/AllProductByChild";
import "./AllProductByChildCategory.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import Banner1 from "../../images/1583 by 426 banner/Banner1.jpg";

const AllProductByChildCategory = () => {
  const navigate = useNavigate();
  const { subcatname } = useParams();
  const location = useLocation();

  const subCategoryId = location.state?.id;
  const status = location.state?.status;

  const [cakesArr, setCakesArr] = useState([]);
  const [secondSubCategories, setSecondSubCategories] = useState([]); // ✅ Array for slider
  const [bannerImage, setBannerImage] = useState(null);

  useEffect(() => {
    if (!subCategoryId) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://api.cakenpetals.com/api/second-sub-category/get-single-second-sub-category/${subCategoryId}`,
        );

        const data = res?.data?.data;
        console.log("Fetched data:===>>", data);

        // ✅ Set products
        setCakesArr(data?.productId || []);

        // ✅ Set banner image
        if (status === "subCategory") {
          setBannerImage(data?.image || null);
        } else {
          setBannerImage(data?.subCategoryId?.banner || data?.image || null);
        }

        // ✅ If status is 'category', fetch sibling second-subcategories for slider
        if (status === "category" && data?.subCategoryId?._id) {
          const siblingRes = await axios.get(
            `https://api.cakenpetals.com/api/second-sub-category/get-by-subcategory/${data.subCategoryId._id}`,
          );
          setSecondSubCategories(siblingRes?.data?.data || []);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, [subCategoryId, status]);

  const imageHandler = (img) => {
    // if (!img) return Banner1;
    return img.startsWith("http") ? img : `https://api.cakenpetals.com/${img}`;
  };

  /* const sliderSettings = {
    dots: false,
    arrows: true,
    autoplay: true,
    infinite: secondSubCategories.length > 4,
    speed: 600,
    autoplaySpeed: 2500,
    slidesToShow: Math.min(secondSubCategories.length, 8),
    slidesToScroll: 2,

    swipeToSlide: true,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 6 } },
      { breakpoint: 992, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 576, settings: { slidesToShow: 2 } },
    ],
  }; */

  return (
    <>
      {/* ✅ TOP SUBCATEGORY SLIDER — only when status is 'category' and has items */}
      {/* {status === "category" && secondSubCategories.length > 0 && (
                <Slider {...sliderSettings}>
                    {secondSubCategories.map((subcategory) => (
                        <div key={subcategory._id}>
                            <section className="topCategorySection">
                                <div className="topCategoryCard">
                                    <div
                                        className="mega-item mega-child"
                                        onClick={() => {
                                            const slug = subcategory?.secondsubcategoryName
                                                ?.toLowerCase()
                                                ?.replace(/[^a-z0-9]+/g, "-")
                                                ?.replace(/(^-|-$)/g, "");
                                            navigate(`/product-related/${slug}`, {
                                                state: { id: subcategory._id, status: "subCategory" },
                                            });
                                        }}
                                    >
                                        <img
                                            src={imageHandler(subcategory?.image)}
                                            alt={subcategory?.secondsubcategoryName || "subcategory"}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = Banner1;
                                            }}
                                        />
                                        <p>
                                            {subcategory?.secondsubcategoryName
                                                ?.charAt(0).toUpperCase() +
                                                subcategory?.secondsubcategoryName?.slice(1)}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    ))}
                </Slider>
            )} */}

      {/* ✅ BANNER IMAGE */}
      {/* {bannerImage && (
                <section className="cakeBannerSlider">
                    <div className="bannerBox">
                        <img
                            src={imageHandler(bannerImage)}
                            alt="Category Banner"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = Banner1;
                            }}
                        />
                    </div>
                </section>
            )} */}

      {/* ✅ PRODUCTS */}
      {subCategoryId ? <AllProductById cakesArr={cakesArr} /> : <AllProducts />}
    </>
  );
};

export default AllProductByChildCategory;
