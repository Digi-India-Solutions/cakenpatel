import "./CakeBanners.css";
import pic2 from "../../images/1200 by 600 banner/Banner1.jpg"
import pic1 from "../../images/1200 by 600 banner/Banner2.jpg"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'
// const cakeBannerData = [
//   {
//     id: 1,
//     image:pic1 ,
//     title: "Freshly Baked",
//     highlight: "Delicious Cakes",
//     subtitle: "Made with love & premium ingredients",
//   },
//   {
//     id: 2,
//     image: pic2,
//     title: "Celebrate Every Moment",
//     highlight: "Sweet Happiness",
//     subtitle: "Perfect for birthdays & occasions",
//   },
// ];


const CakeBanners = () => {
  const [cakeBannerData, setCakeBannerData] = useState([]);
  const navigate = useNavigate()
  useEffect(() => {
    fetchCakeBanners();
  }, []);

  const fetchCakeBanners = async () => {
    try {
      const res = await axios.get(
        "https://api.cakenpetals.com/api/cake-banner/get-cake-banner"
      );
      console.log("SSSSS::=>", res.data?.data.filter((item) => item?.bannerKey === 'cakeBanner1'))
      setCakeBannerData(res.data?.data.filter((item) => item?.bannerKey === 'cakeBanner1') || []);
    } catch (error) {
      console.error("Failed to fetch cake banners", error);
    }
  };

  // console.log("SSSSS::=>", cakeBannerData)
  return (
    <>
      <div className="container">
        <div className="cake-banner-container two-banner">
          {cakeBannerData?.map((item) => (
            <div style={{ cursor: 'pointer' }} onClick={() =>
              // navigate(`/product-related/${item?.titel?.replace(/\s+/g, "-").toLowerCase()}`,
              navigate(`/${item?.titel?.replace(/\s+/g, "-").toLowerCase()}`,
                { state: { id: item?.secondsubcategoryName, status: item?.bannerKey } })
            } className="cake-banner-card" key={item?._id}>
              <img src={`https://api.cakenpetals.com/${item?.cakeBanner}`} className="cakeImgBanner" alt="cake banner" />
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

export default CakeBanners;
