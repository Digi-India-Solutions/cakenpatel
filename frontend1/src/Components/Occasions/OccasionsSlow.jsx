import React, { useState, useEffect } from 'react'
import './Occasions.css'
import pic1 from "../../images/pic/briday6.jpg"
import pic2 from "../../images/pic/party4.jpg"
import pic3 from "../../images/pic/aniver.jpeg"
import pic4 from "../../images/pic/wed.jpg"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Occasions() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  // ✅ API call
  const fetchBannerData = async () => {
    try {
      // const res = await axios.get("https://api.cakenpetals.com/api/promo-banner/get-promo-banner");
      const res = await axios.get("https://api.cakenpetals.com/api/cake-banner/get-cake-banner"
      );
      console.log("SSSSS::=>", res.data?.data.filter((item) => item?.bannerKey === 'cakeBanner3'))
      // console.log("SSSSS::=>XXXXXX", res?.data?.data)
      if (res.status === 200) {
        setData(
          res.data?.data.filter((item) => item?.bannerKey === 'cakeBanner3') ||
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

  // const occasionData = [
  //   { id: 1, img: pic1, title: "Birthday" },
  //   { id: 2, img: pic2, title: "party" },
  //   { id: 3, img: pic3, title: "Anniversary" },
  //   { id: 4, img: pic4, title: "wedding" },
  // ]
  return (
    <>
      <div className='OccasionsMainSec'>
        <div className='OccasionHeadSec'>
          {/* & Relations */}
          <h2 className='SuperTitle' >Shop By Occassions </h2>
          <p className='SuperSubTitle text-muted'>Surprise Your Loved Ones  </p>

        </div>

        {data && data.length > 0 && <div className='container'>
          <div className='OccasionCardSec'>
            {
              data.map((item, index) => (
                <div onClick={() =>
                  // navigate(`/product-related/${item?.titel?.replace(/\s+/g, "-").toLowerCase()}`, 
                  navigate(`/${item?.titel?.replace(/\s+/g, "-").toLowerCase()}`,
                    { state: { id: item?.secondsubcategoryName, status: item?.bannerKey } })} key={item?._id} className='OccasionCard'>
                  <img src={`https://api.cakenpetals.com/${item?.image || item?.cakeBanner}`} alt="" className='occasionalPic' />
                  <h3>{item?.titel?.charAt(0).toUpperCase() + item?.titel?.slice(1)}</h3>
                </div>
              ))
            }
          </div>
        </div>}


      </div>
    </>
  )
}
