import React, { useState, useEffect } from 'react'
import './banner.css'
import banner from "../../images/pic/Banner11.jpg"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

// ========================================================
// PERFORMANCE FIX: GLOBAL CACHE
// Prevents re-fetching the promo banner data every time 
// the component mounts when navigating between pages.
// ========================================================
let cachedCakeBanner = null;

export default function Banner() {
  // Use cached data immediately if we have it
  const [data, setData] = useState(cachedCakeBanner || []);
  const navigate = useNavigate();

  // ✅ API call
  const fetchBannerData = async () => {
    // PERFORMANCE FIX: If data is already cached, do not ping the server!
    if (cachedCakeBanner) return;

    try {
      // const res = await axios.get("https://api.cakenpetals.com/api/promo-banner/get-promo-banner");
      const res = await axios.get("https://api.cakenpetals.com/api/cake-banner/get-cake-banner"
      );
      console.log("SSSSS::=>", res.data?.data.filter((item) => item?.bannerKey === 'cakeBanner4'))
      // console.log("SSSSS::=>XXXXXX", res?.data?.data)
      if (res.status === 200) {
        
        // Filter the data just like you were doing before
        const filteredData = res.data?.data.filter((item) => item?.bannerKey === 'cakeBanner4') ||
                             res?.data?.data?.filter((item) => item?.isActive === 'true');

        cachedCakeBanner = filteredData; // Save to global cache
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
      {/* <div className='BannerSection'>
        <img src={banner} className='BannerImg' alt="" />
      </div> */}
      {data && data.length > 0 &&
        <div className='BannerSection'>
          {
            data.map((item, index) => (
              <div onClick={() =>
                // navigate(`/product-related/${item?.titel?.replace(/\s+/g, "-").toLowerCase()}`,
                navigate(`/${item?.titel?.replace(/\s+/g, "-").toLowerCase()}`,
                  { state: { id: item?.secondsubcategoryName, status: item?.bannerKey } })} key={item?._id} className='BannerSection'>
                <img src={`https://api.cakenpetals.com/${item?.image || item?.cakeBanner}`} alt="" className='BannerImg' />
              </div>
            ))
          }
        </div>
      }
    </>
  )
}