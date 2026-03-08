import "./reel.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom"
import React, { useState, useEffect, useRef } from "react";
const BASE_URL = "https://api.cakenpetals.com/";

// ========================================================
// PERFORMANCE FIX: GLOBAL CACHE
// Prevents re-fetching heavy video data from the server 
// every time the user navigates to the page.
// ========================================================
let cachedReels = null;

export default function ReelSection() {
  const navigate = useNavigate();
  const [activeReel, setActiveReel] = useState(null);
  
  // Use cached data immediately if we have it
  const [reels, setReels] = useState(cachedReels || []);
  const reelRef = useRef(null);

  const scrollLeft = () => {
    reelRef.current.scrollBy({
      left: -250,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    reelRef.current.scrollBy({
      left: 250,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    document.body.style.overflow = activeReel ? "hidden" : "auto";
  }, [activeReel]);

  useEffect(() => {
    const fetchReels = async () => {
      // PERFORMANCE FIX: If reels are already cached, do not ping the server!
      if (cachedReels) return;

      try {
        const response = await axios.get("https://api.cakenpetals.com/api/reel/get-reels");
        const filteredReels = response?.data?.data.filter((reel) => reel?.activeOnHome === true) || [];
        
        cachedReels = filteredReels; // Save to global cache
        setReels(filteredReels);
      } catch (error) {
        console.error("Error fetching reels:", error);
      }
    };

    fetchReels();
  }, []);

  const getVideoUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : BASE_URL + path;
  };
  
  return (
    <>
      <div className="container">
        <div className="reel-wrapper">
          <section className="reel-section" ref={reelRef}>
            {reels.map((reel) => (
              <div
                key={reel._id}
                className="reel-card"
                onClick={() => setActiveReel(reel)}
                style={{ position: "relative", cursor: "pointer", borderRadius: "16px", overflow: "hidden" }}
              >
                {reel.video && (
                  <video
                    src={getVideoUrl(reel.video)}
                    muted
                    loop
                    preload="metadata"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    onMouseEnter={(e) => e.target.play().catch(() => { })}
                    onMouseLeave={(e) => {
                      e.target.pause();
                      e.target.currentTime = 0;
                    }}
                  />
                )}

                {/* UI PATTERN: Premium Dark Translucent Glass Overlay */}
                <div 
                  className="reel-product d-flex align-items-center"
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "10px",
                    right: "10px",
                    background: "rgba(255, 255, 255, 0.65)", 
                    backdropFilter: "blur(6px)", 
                    padding: "8px 12px",
                    borderRadius: "10px",
                    color: "#0d0707",
                    gap: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                  }}
                >
                  <img 
                    src={BASE_URL + reel?.productId?.productImage[0]} 
                    alt="" 
                    style={{ width: "42px", height: "42px", borderRadius: "6px", objectFit: "cover" }}
                  />
                  <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#000000" }}>
                      {reel?.productId?.productName?.charAt(0).toUpperCase() + reel?.productId?.productName?.slice(1)}
                    </p>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: "#0d6f10" }}>
                      ₹ {reel?.productId?.Variant[0]?.finalPrice}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>

      {activeReel && (
        <div 
          className="reel-overlay" 
          onClick={() => setActiveReel(null)}
          style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.85)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <div 
            className="reel-modal" 
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative", width: "100%", maxWidth: "450px", height: "90vh", borderRadius: "20px", overflow: "hidden", backgroundColor: "#000" }}
          >
            <video
              src={getVideoUrl(activeReel?.video)}
              autoPlay
              controls
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

            {/* UI PATTERN: Floating White Glass Modal for Purchase */}
            <div 
              className="modal-product d-flex align-items-center justify-content-between"
              style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "90%",
                background: "rgba(255, 255, 255, 0.95)", 
                backdropFilter: "blur(10px)",
                padding: "12px 16px",
                borderRadius: "14px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                gap: "12px"
              }}
            >
              <img 
                src={BASE_URL + activeReel?.productId?.productImage[0]} 
                alt="" 
                style={{ width: "55px", height: "55px", borderRadius: "8px", objectFit: "cover" }}
              />
              
              <div style={{ flex: 1, overflow: "hidden" }}>
                <h5 className="reeltitle" style={{ fontSize: "15px", fontWeight: "600", margin: "0 0 4px 0", color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {activeReel?.productId?.productName.charAt(0).toUpperCase() + activeReel?.productId?.productName?.slice(1)}
                </h5>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "#d68716" }}>
                  ₹ {activeReel?.productId?.Variant[0]?.finalPrice}
                </div>
              </div>

              <div 
                style={{ cursor: 'pointer' }} 
                onClick={() => navigate(`/product-details/${activeReel?.productId?.productName.replace(/\s+/g, "-")}`, { state: { id: activeReel?.productId?._id, status: "single-product" } })}
              >
                <button 
                  className="BuyBtn"
                  style={{ backgroundColor: "#df4444", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: "600", fontSize: "14px", whiteSpace: "nowrap" }}
                >
                  Buy Now
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}