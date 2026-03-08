import React, { useState, useEffect } from 'react'
import './banner.css'
import banner from "../../images/pic/Banner11.jpg"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Banner() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  // ✅ API call
  const fetchBannerData = async () => {
    try {
      // const res = await axios.get("https://api.cakenpetals.com/api/promo-banner/get-promo-banner");
      const res = await axios.get("https://api.cakenpetals.com/api/cake-banner/get-cake-banner"
      );
      console.log("SSSSS::=>", res.data?.data.filter((item) => item?.bannerKey === 'cakeBanner4'))
      // console.log("SSSSS::=>XXXXXX", res?.data?.data)
      if (res.status === 200) {
        setData(
          res.data?.data.filter((item) => item?.bannerKey === 'cakeBanner4') ||
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
