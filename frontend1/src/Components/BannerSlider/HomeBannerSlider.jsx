import { /* React, */ useEffect, useState } from "react";
import Slider from "react-slick";
import "./homebanner.css";
/* import pic1 from "../../images/1583 by 426 banner/Banner1.jpg";
import pic2 from "../../images/1583 by 426 banner/Banner2.jpg"; // optional */
import axios from "axios";
import { /* Link, */ useNavigate } from "react-router-dom";

// ========================================================
// PERFORMANCE FIX: GLOBAL CACHE
// Prevents re-fetching the heavy banner data every time
// the user navigates back to the Home page.
// ========================================================
let cachedBanners = null;

const HomeBannerSlider = () => {
  // Use cached data immediately if we have it
  const [data, setData] = useState(cachedBanners || []);
  const navigate = useNavigate();

  // ✅ API call
  const fetchBannerData = async () => {
    // PERFORMANCE FIX: If banners are already cached, do not ping the server!
    if (cachedBanners) return;

    try {
      const res = await axios.get(
        "https://api.cakenpetals.com/api/get-banners",
      );
      /* console.log("SSSSS::=>", res); */
      if (res.status === 200) {
        const activeBanners =
          res?.data?.data?.filter((item) => item?.bannerStatus === "True") ||
          [];

        cachedBanners = activeBanners; // Save to global cache
        setData(activeBanners);
      }
    } catch (error) {
      /* console.error("Error fetching banner data:", error); */
    }
  };

  useEffect(() => {
    fetchBannerData();
  }, []);

  const settings = {
    dots: false,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // ✅ auto change ON
    autoplaySpeed: 3000, // ✅ change every 3 sec
    pauseOnHover: false,
    arrows: false,
  };

  /* console.log("AAAAAAAAAAAAA===>", data); */
  return (
    <div className="container-fluid p-0 w-100 homeBannerSlider">
      <div className="slider-container">
        <Slider {...settings}>
          {data.map((banner) => (
            <div
              key={banner._id}
              className="bannerSlide"
              onClick={() => {
                navigate(
                  `/${banner?.bannerName?.replace(/\s+/g, "-").toLowerCase()}`,
                  {
                    state: {
                      id: banner?.secondsubcategoryName,
                      status: "subCategory",
                    },
                  },
                );
              }}
            >
              <img
                className="bannerImage"
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
