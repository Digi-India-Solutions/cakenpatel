import React, { useState, useEffect, useRef, useMemo } from "react";
import "./location.css";
import axios from "axios";
import Swal from "sweetalert2";




const LocationOption = ({ onServiceChange }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [availableService, setAvailableService] = useState([]);
  const [serviceAvailable, setServiceAvailable] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");
  const [savedLocation, setSavedLocation] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const debounceRef = useRef(null);

  let buttonStyle = {
    background: isPressed
      ? '#0d47a1'           // darker when pressed
      : isHovered
        ? '#1565c0'           // hover state
        : '#1a73e8',          // default
    color: 'white',
    border: 'none',
    borderRadius: '40px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s, transform 0.1s, box-shadow 0.2s',
    boxShadow: isHovered
      ? '0 6px 14px rgba(26, 115, 232, 0.4)'
      : '0 4px 10px rgba(26, 115, 232, 0.3)',
    transform: isPressed ? 'scale(0.96)' : 'scale(1)',
    outline: 'none',
  };

  /* ================= GET STORED LOCATION ================= */

  const storedLocation = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("CakeLocation"));
    } catch {
      return null;
    }
  }, []);

  /* ================= FETCH SERVICE AREAS ================= */

  const ServiceLocation = async () => {
    try {
      const res = await axios.get(
        "https://api.cakenpetals.com/api/pincode/get-all-pin-codes"
      );

      setAvailableService(res.data.pinCodes || []);
    } catch (error) {
      console.error("Service fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ServiceLocation();
  }, []);

  /* ================= AUTO FILL FROM LOCAL ================= */

  useEffect(() => {
    if (!storedLocation?.area || !storedLocation?.pinCode) {
      if (storedLocation) {
        const text = `${storedLocation}`;
        setInput(text);
      }
      return;
    } else {
      const text = `${storedLocation?.area} ${storedLocation?.pinCode}`;
      setInput(text);
    }

  }, [storedLocation]);

  /* ================= SERVICE CHECK ================= */

  const checkServiceAvailability = (searchText) => {
    const text = searchText.trim().toLowerCase();

    if (!text || text.length < 2 || !availableService.length) {
      setServiceAvailable(false);
      setSearchMessage("");
      onServiceChange?.(false);
      return;
    }

    const isAvailable = availableService.some((item) => {
      if (!(item.deleveryStatus && item.isActive)) return false;

      const pin = item.pinCode?.toString().toLowerCase() || "";
      const area = item.area?.toLowerCase() || "";
      const areaWithPin = `${area} ${pin}`.trim();

      return pin === text || area.includes(text) || areaWithPin === text;
    });

    const isAvailable30min = availableService.some((item) => {
      if (!(item.deleveryTime && item.isActive)) return false;

      const pin = item.pinCode?.toString().toLowerCase() || "";
      const area = item.area?.toLowerCase() || "";
      const areaWithPin = `${area} ${pin}`.trim();

      return pin === text || area.includes(text) || areaWithPin === text;
    });

    setServiceAvailable(isAvailable);
    onServiceChange?.(isAvailable);

    // ✅ professional messaging
    if (text.length > 2) {
      if (isAvailable) {
        setSearchMessage(
          isAvailable30min
            ? "🎉 Delivery available! 30-minute express delivery is live in selected areas."
            : "✅ Delivery service is available in your area."
        );
      } else {
        setSearchMessage(
          "❌ Sorry, delivery is currently unavailable in your area."
        );
      }
    }
  };

  /* ================= SINGLE DEBOUNCE (FIXED) ================= */

  useEffect(() => {
    if (!input) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      checkServiceAvailability(input);
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, availableService]); // ✅ important

  /* ================= INPUT HANDLER ================= */

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  /* ================= GEO LOCATION ================= */

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      Swal.fire("Error", "Geolocation not supported.", "error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await axios.get(
            `https://api.cakenpetals.com/api/google-api/reverse-geocode?lat=${latitude}&lon=${longitude}`
          );

          if (response?.data?.status) {
            const detectedLocation = {
              area: response.data.area || "",
              city: response.data.city || "",
              state: response.data.state || "",
              pinCode: response.data.pincode || "",
            };

            const text = `${detectedLocation.area} ${detectedLocation.pinCode}`;

            setInput(text);
            localStorage.setItem("CakeLocation", JSON.stringify(detectedLocation));

            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: "Location detected",
              showConfirmButton: false,
              timer: 1200,
            });
          }
        } catch (error) {
          console.error(error);
          Swal.fire("Error", "Failed to detect location.", "error");
        }
      },
      () => {
        Swal.fire("Error", "Location permission denied.", "error");
      }
    );
  };


  const handleSave = () => {
    if (input.trim()) {
      setSavedLocation(input);
      localStorage.setItem("CakeLocation", JSON.stringify(input));
      // alert(`Location saved: ${input}`); // Replace with actual save logic
    }
  };
  /* ================= LOADING ================= */

  if (loading) {
    return <div className="location-wrapper">Loading locations...</div>;
  }

  /* ================= UI ================= */

  return (
    <div className="location-wrapper">
      <div className="location-header">
        <span>Select Area / Location</span>
        <span className="use-location" onClick={handleLocationClick}>
          Use My Location
        </span>
      </div>

      {searchMessage && (
        <div className="note-box">Note: {searchMessage}</div>
      )}

      <div className="search-box">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter your pincode or area..."
          className="search-input"
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10, flexDirection: 'column' }}>
        {input && (
          <button
            style={buttonStyle}
            onClick={handleSave}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              setIsPressed(false);
            }}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
          >
            Save
          </button>
        )}
        {(savedLocation && input) && (
          <div className="saved-location">
            <span>✅ Current saved location: {savedLocation}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationOption;
