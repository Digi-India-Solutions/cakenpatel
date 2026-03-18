import React, { useState, useEffect, useCallback, memo } from "react";
import "./Occasions.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "https://api.cakenpetals.com/";

/* ========================================================
   GLOBAL CACHE
======================================================== */
let cachedOccasionBanners = [];

function Occasions() {
  const navigate = useNavigate();

  const [data, setData] = useState(cachedOccasionBanners);

  /* ========================================================
     FETCH BANNERS
  ======================================================== */

  const fetchBannerData = useCallback(async () => {
    if (cachedOccasionBanners.length) {
      setData(cachedOccasionBanners);
      return;
    }

    try {
      const res = await axios.get(
        "https://api.cakenpetals.com/api/cake-banner/get-cake-banner",
      );

      if (res.status === 200) {
        const filteredData =
          res?.data?.data?.filter(
            (item) => item?.bannerKey === "cakeBanner3",
          ) ||
          res?.data?.data?.filter((item) => item?.isActive === "true") ||
          [];

        cachedOccasionBanners = filteredData;

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
     NAVIGATION
  ======================================================== */

  const handleNavigate = useCallback(
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
    <div className="OccasionsMainSec">
      <div className="OccasionHeadSec">
        <h2 className="SuperTitle">Shop By Occassions</h2>

        <p className="SuperSubTitle text-muted">Surprise Your Loved Ones</p>
      </div>

      {data.length > 0 && (
        <div className="container">
          <div className="OccasionCardSec">
            {data.map((item, index) => {
              const image =
                item?.image || item?.cakeBanner
                  ? BASE_URL + (item?.image || item?.cakeBanner)
                  : "";

              return (
                <div
                  key={item?._id}
                  className="OccasionCard"
                  onClick={() => handleNavigate(item)}
                >
                  <img
                    src={image}
                    alt={item?.titel}
                    className="occasionalPic"
                    loading={index < 2 ? "eager" : "lazy"}
                    decoding="async"
                    width="300"
                    height="300"
                  />

                  <h3>
                    {item?.titel?.charAt(0).toUpperCase() +
                      item?.titel?.slice(1)}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(Occasions);
