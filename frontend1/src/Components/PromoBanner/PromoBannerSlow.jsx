import React, { useState, useEffect } from "react";
import "./PromoBanners.css";
import pic1 from "../../images/1583 by 426 banner/Banner1.jpg"
import pic2 from "../../images/1583 by 426 banner/Banner2.jpg"
import pic3 from "../../images/1583 by 426 banner/Banner1.jpg"
import { useNavigate } from "react-router-dom";
import axios from "axios";

// const cakeBannerData = [
//   {
//     id: 1,
//     image: pic1,
//     title: "Freshly Baked",
//     highlight: "Delicious Cakes",
//     subtitle: "Made with love & premium ingredients",
//   },
//   {
//     id: 2,
//     image: pic2,
//     title: "Celebrate Every Moment",
//     highlight: "With Sweet Happiness",
//     subtitle: "Perfect for birthdays & occasions",
//   },
//   {
//     id: 3,
//     image: pic3,
//     title: "Handcrafted Desserts",
//     highlight: "Taste The Perfection",
//     subtitle: "Soft, creamy & irresistible flavors",
//   },
// ];

const PromoBanner = () => {
  const [cakeBannerData, setData] = useState([]);
  const navigate = useNavigate();
  // ✅ API call
  const fetchBannerData = async () => {
    try {
      // const res = await axios.get("https://api.cakenpetals.com/api/promo-banner/get-promo-banner");
      const res = await axios.get("https://api.cakenpetals.com/api/cake-banner/get-cake-banner"
      );
      console.log("SSSSS::=>", res.data?.data.filter((item) => item?.bannerKey === 'cakeBanner2'))
      // console.log("SSSSS::=>XXXXXX", res?.data?.data)
      if (res.status === 200) {
        setData(
          res.data?.data.filter((item) => item?.bannerKey === 'cakeBanner2') ||
          res?.data?.data?.filter((item) => item?.isActive === 'true')
        );
      }
    } catch (error) {
      console.error("Error fetching banner data:", error);
    }
  };

  useEffect(() => {
    fetchBannerData();
  }, [])

  return (
    <>
      <div className="container">
        <div className="cake-banner-container">
          {cakeBannerData?.map((item) => (
            <div className="cake-banner-card" style={{ cursor: 'pointer' }} onClick={() =>
              // navigate(`/product-related/${item?.titel?.replace(/\s+/g, "-").toLowerCase()}`,
              navigate(`/${item?.titel?.replace(/\s+/g, "-").toLowerCase()}`,
                { state: { id: item?.secondsubcategoryName, status: item?.bannerKey } })} key={item?._id}>
              <img src={`https://api.cakenpetals.com/${item?.image || item?.cakeBanner}`} alt="cake banner" />
              {/* <div className="cake-overlay">
            <h4>{item.title}</h4>
            <h2>{item.highlight}</h2>
            <p>{item.subtitle}</p>
            <button className="cake-btn">Order Now 🍰</button>
          </div> */}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PromoBanner;
