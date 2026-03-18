import "./CakeBanners.css";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CakeBanners = () => {
  const [cakeBannerData, setCakeBannerData] = useState([]);
  const navigate = useNavigate();

  const fetchCakeBanners = useCallback(async () => {
    try {
      const res = await axios.get(
        "https://api.cakenpetals.com/api/cake-banner/get-cake-banner",
      );

      const banners =
        res.data?.data?.filter((item) => item?.bannerKey === "cakeBanner1") ||
        [];

      setCakeBannerData(banners);
    } catch (error) {
      console.error("Failed to fetch cake banners", error);
    }
  }, []);

  useEffect(() => {
    fetchCakeBanners();
  }, [fetchCakeBanners]);

  const handleNavigate = useCallback(
    (item) => {
      navigate(`/${item?.titel?.replace(/\s+/g, "-").toLowerCase()}`, {
        state: { id: item?.secondsubcategoryName, status: item?.bannerKey },
      });
    },
    [navigate],
  );

  const banners = useMemo(() => cakeBannerData || [], [cakeBannerData]);

  return (
    <div className="container">
      <div className="cake-banner-container two-banner">
        {banners.map((item, index) => (
          <div
            key={item?._id}
            className="cake-banner-card"
            style={{ cursor: "pointer" }}
            onClick={() => handleNavigate(item)}
          >
            <img
              src={`https://api.cakenpetals.com/${item?.cakeBanner}`}
              className="cakeImgBanner"
              alt={item?.titel || "cake banner"}
              loading={index < 2 ? "eager" : "lazy"}
              decoding="async"
              width="600"
              height="300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(CakeBanners);
