import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
// import AllProducts from "../AllProducts/AllProducts";
import AllProducts from "../../Components/AllProducts/AllProducts";
import "./subSubCat.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Banner1 from "../../images/1583 by 426 banner/Banner1.jpg";
import Banner2 from "../../images/1583 by 426 banner/Banner2.jpg";

const staticProducts = [
  {
    productName: "Chocolate Truffle Cake",
    productImage: [Banner1],
    Variant: [{ finalPrice: 599 }],
  },
  {
    productName: "Red Velvet Cake",
    productImage: [Banner2],
    Variant: [{ finalPrice: 699 }],
  },
];

const AllCakes = () => {
  const { subcatname } = useParams();
  const navigate = useNavigate();
  const [cakesArr, setCakesArr] = useState([]);
  const [subcategoryInfo, setSubcategoryInfo] = useState(null);




  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `https://api.cakenpetals.com/api/get-product-by-subcatname/${subcatname.replace('-', " ")}`
        );

        if (res.data?.data?.length > 0) {
          setCakesArr(res.data.data);
          console.log(res.data?.data)
          setSubcategoryInfo(res.data.data[0].subcategoryName);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [subcatname]);

  const bannerSettings = {
    dots: true,
    arrows: false,
    autoplay: true,
    infinite: true,
    speed: 800,
    autoplaySpeed: 3000,
  };

  const imageUrl =
    subcategoryInfo?.image
      ? subcategoryInfo.image.startsWith("http")
        ? subcategoryInfo.image
        : `https://api.cakenpetals.com/${subcategoryInfo.image}`
      : Banner1;


  return (
    <>
      {/* TOP SUBCATEGORY */}
      {subcategoryInfo && (
        <section className="SubSubCategorySection">
          <div className="SubSubCategoryCard active">
            {/* <Link
              to={`/product-details/Choco%20Vanilla%20Delight%20Cake`}
              className="category-link"
            > */}
            <div className="category-link" onClick={() => navigate(`/product-details/${subcategoryInfo.subcategoryName}`, { status: { id: subcategoryInfo.id, status: subcategoryInfo.status } })}  >
              <img
                src={imageUrl}
                alt={subcategoryInfo?.subcategoryName || "subcategory"}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = Banner1;
                }}
              />
            </div>
            <p>{subcategoryInfo.subcategoryName}</p>
            {/* </Link> */}
          </div>
        </section >
      )}


      {/* BANNER SLIDER */}
      <section className="SubSubCategorySlider">
        <Slider {...bannerSettings}>
          {[Banner1, Banner2].map((img, index) => (
            <div key={index}>
              <div className="SubSubCatBannerBox">
                <img src={img} alt="Cake Banner" />
              </div>
            </div>
          ))}
        </Slider>
      </section>


      {/* PRODUCTS */}
      {/* {cakesArr.length > 0 ? (
        <AllProducts data={cakesArr} />
      ) : (
        <p className="text-center mt-5">No cakes available.</p>
      )} */}

      <AllProducts />
    </>
  );
};

export default AllCakes;




