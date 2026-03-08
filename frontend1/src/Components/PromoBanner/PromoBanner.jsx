import React, { useState, useEffect } from "react";
import "./PromoBanners.css";
import pic1 from "../../images/1583 by 426 banner/Banner1.jpg"
import pic2 from "../../images/1583 by 426 banner/Banner2.jpg"
import pic3 from "../../images/1583 by 426 banner/Banner1.jpg"
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ========================================================
// PERFORMANCE FIX: GLOBAL CACHE
// Prevents re-fetching the promo banners every time 
// the component mounts when navigating between pages.
// ========================================================
let cachedPromoBanners = null;

const PromoBanner = () => {
  // Use cached data immediately if we have it
  const [cakeBannerData, setData] = useState(cachedPromoBanners || []);
  const navigate = useNavigate();

  // ✅ API call
  const fetchBannerData = async () => {
    // PERFORMANCE FIX: If data is already cached, do not ping the server!
    if (cachedPromoBanners) return;

    try {
      // const res = await axios.get("https://api.cakenpetals.com/api/promo-banner/get-promo-banner");
      const res = await axios.get("https://api.cakenpetals.com/api/cake-banner/get-cake-banner");
      
      console.log("SSSSS::=>", res.data?.data.filter((item) => item?.bannerKey === 'cakeBanner2'))
      
      if (res.status === 200) {
        // Filter the data just like you were doing before
        const filteredData = res.data?.data.filter((item) => item?.bannerKey === 'cakeBanner2') ||
                             res?.data?.data?.filter((item) => item?.isActive === 'true');
        
        cachedPromoBanners = filteredData; // Save to global cache
        setData(filteredData);
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