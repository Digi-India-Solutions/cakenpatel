import React, { useState, useEffect, useCallback, memo } from "react";
import "./PromoBanners.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "https://api.cakenpetals.com/";

/* ========================================================
   GLOBAL CACHE
======================================================== */
let cachedPromoBanners = [];

function PromoBanner() {
  const navigate = useNavigate();

  const [cakeBannerData, setData] = useState(cachedPromoBanners);

  /* ========================================================
     FETCH BANNERS
  ======================================================== */

  const fetchBannerData = useCallback(async () => {
    if (cachedPromoBanners.length) {
      setData(cachedPromoBanners);
      return;
    }

    try {
      const res = await axios.get(
        "https://api.cakenpetals.com/api/cake-banner/get-cake-banner",
      );

      if (res.status === 200) {
        const filteredData =
          res?.data?.data?.filter(
            (item) => item?.bannerKey === "cakeBanner2",
          ) ||
          res?.data?.data?.filter((item) => item?.isActive === "true") ||
          [];

        cachedPromoBanners = filteredData;

        setData(filteredData);
      }
    } catch (error) {
      console.error("Error fetching banner data:", error);
    }
  }, []);

  useEffect(() => {
    fetchBannerData();
  }, [fetchBannerData]);

  /* ========================================================
     NAVIGATE BANNER
  ======================================================== */

  const handleBannerClick = useCallback(
    (item) => {
      navigate(`/${item?.titel?.replace(/\s+/g, "-").toLowerCase()}`, {
        state: {
          id: item?.secondsubcategoryName,
          status: item?.bannerKey,
        },
      });
    },
    [navigate],
  );

  return (
    <div className="container">
      <div className="cake-banner-container">
        {cakeBannerData.map((item, index) => {
          const image =
            item?.image || item?.cakeBanner
              ? BASE_URL + (item?.image || item?.cakeBanner)
              : "";

          return (
            <div
              key={item?._id}
              className="cake-banner-card"
              style={{ cursor: "pointer" }}
              onClick={() => handleBannerClick(item)}
            >
              <img
                src={image}
                alt="cake banner"
                loading={index < 1 ? "eager" : "lazy"}
                decoding="async"
                width="1583"
                height="426"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(PromoBanner);
