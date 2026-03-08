import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "./homebanner.css";
import pic1 from "../../images/1583 by 426 banner/Banner1.jpg";
import pic2 from "../../images/1583 by 426 banner/Banner2.jpg"; // optional
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const HomeBannerSlider = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  // ✅ API call
  const fetchBannerData = async () => {
    try {
      const res = await axios.get("https://api.cakenpetals.com/api/get-banners");
      console.log("SSSSS::=>", res)
      if (res.status === 200) {
        setData(res?.data?.data?.filter((item) => item?.bannerStatus === 'True'));
      }
    } catch (error) {
      console.error("Error fetching banner data:", error);
    }
  };

  useEffect(() => {
    fetchBannerData();
  }, [])
  // ✅ Static banner data


  const settings = {
    dots: false,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,          // ✅ auto change ON
    autoplaySpeed: 3000,     // ✅ change every 3 sec
    pauseOnHover: false,
    arrows: false,
  };

  console.log("AAAAAAAAAAAAA===>", data)
  return (
    <div className="container-fluid p-0">
      <div className="slider-container">
        <Slider {...settings}>
          {data.map((banner) => (
            <div key={banner._id}
              onClick={() => {
                navigate(`/${banner?.bannerName?.replace(/\s+/g, "-").toLowerCase()}`,
                  { state: { id: banner?.secondsubcategoryName, status: 'subCategory' } });

              }}>
              <img
                className="banner-Image"
                src={`https://api.cakenpetals.com/${banner?.bannerImage}`}
                alt={banner.bannerName}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default HomeBannerSlider;





// import React, { useEffect, useState } from "react";
// import Slider from "react-slick";
// import "./homebanner.css";
// import axios from "axios";

// const HomeBannerSlider = () => {
//   const [data, setData] = useState([]);

//   // Function to fetch API data
//   const getApiData = async () => {
//     try {
//       // const res = await axios.get("https://api.cakenpetals.com/api/get-banners");
//       const res = await axios.get(`https://api.cakenpetals.com/api/get-banners`);
//       if (res.status === 200) {
//         setData(res.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching banner data:", error);
//     }
//   };

//   // Fetch data on component mount
//   useEffect(() => {
//     getApiData();
//   }, []);

//   const settings = {
//     dots: false,
//     fade: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     waitForAnimate: false,
//     arrows: false,
//   };

//   return (
//     <div className="container-fluid p-0">
//       <div className="slider-container">
//         <Slider {...settings} style={{ zIndex: -1 }}>
//           {data.map((banner) => (
//             <div key={banner._id}>
//               <img
//                 className="banner-Image"
//                 alt={banner.bannerName}
//                 src={`https://api.cakenpetals.com/${banner.bannerImage}`}
//               />
//               {/* <div className="overlay-content start-50 translate-middle text-center text-white">
//                 <div className="overlay">
//                   <div className="bannerContent">
//                     <h1>{banner.bannerName}</h1>
//                     <p className="lead">{banner.bannerName}</p>
//                     <a className="ordernowBtn" href="tel:+919508080807">
//                       ORDER NOW
//                     </a>
//                     <h5>
//                       Or Call <a href="tel:+919508080807">+91 9508080807</a>
//                     </h5>
//                   </div>
//                 </div>
//               </div> */}
//             </div>
//           ))}
//         </Slider>
//       </div>
//     </div>
//   );
// };

// export default HomeBannerSlider;
