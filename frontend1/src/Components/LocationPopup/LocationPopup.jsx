// import { useState, useMemo, useEffect, useRef } from "react";
// import "./locationPopup.css";
// import axios from "axios";

// const LocationPopup = ({
//   onClose,
//   countries = [],
//   selectedCountry,
//   setSelectedCountry,
// }) => {
//   const debounceRef = useRef(null);

//   const [input, setInput] = useState("");
//   const [location, setLocation] = useState(null);
//   const [availableService, setAvailableService] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchMessage, setSearchMessage] = useState("");
//   const [detecting, setDetecting] = useState(false);

//   /* ================= SAFE STORED LOCATION ================= */

//   const storedLocation = useMemo(() => {
//     try {
//       return JSON.parse(localStorage.getItem("CakeLocation") || "null");
//     } catch {
//       return null;
//     }
//   }, []);

//   /* ================= FETCH SERVICE AREAS ================= */

//   const fetchServiceLocations = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         "https://api.cakenpetals.com/api/pincode/get-all-pin-codes"
//       );
//       setAvailableService(res.data?.pinCodes || []);
//     } catch (error) {
//       console.log("Service fetch error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchServiceLocations();
//   }, []);

//   /* ================= PREFILL FROM STORAGE ================= */

//   useEffect(() => {
//     if (!storedLocation?.area || !storedLocation?.pinCode) return;

//     setInput(`${storedLocation.area} ${storedLocation.pinCode}`);
//     setLocation(storedLocation);
//   }, [storedLocation]);

//   /* ================= GEO LOCATION ================= */

//   const handleLocationClick = () => {
//     if (!navigator.geolocation) {
//       alert("Geolocation is not supported by your browser.");
//       return;
//     }

//     setDetecting(true);

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;

//         try {
//           const res = await axios.get(
//             `https://api.cakenpetals.com/api/google-api/reverse-geocode?lat=${latitude}&lon=${longitude}`
//           );

//           if (res?.data?.status) {
//             const detectedLocation = {
//               area: res.data.area || "",
//               city: res.data.city || "",
//               state: res.data.state || "",
//               pinCode: res.data.pincode || "",
//             };

//             const text = `${detectedLocation.area} ${detectedLocation.pinCode}`;

//             setInput(text);
//             setLocation(detectedLocation);
//             localStorage.setItem(
//               "CakeLocation",
//               JSON.stringify(detectedLocation)
//             );
//           } else {
//             alert("Failed to fetch location data.");
//           }
//         } catch (error) {
//           console.error("Reverse geocode error:", error);
//           alert("Something went wrong while detecting your location.");
//         } finally {
//           setDetecting(false);
//         }
//       },
//       () => {
//         setDetecting(false);
//         alert("Permission denied or unable to access your location.");
//       }
//     );
//   };

//   /* ================= SERVICE CHECK ================= */

//   const checkServiceAvailability = (searchText) => {
//     const text = searchText.trim().toLowerCase();

//     if (!text || text.length < 2 || !availableService.length) {
//       setSearchMessage("");
//       return;
//     }

//     const isAvailable = availableService.some((item) => {
//       if (!item.deleveryStatus) return false;

//       const pin = item.pinCode?.toString().toLowerCase() || "";
//       const area = item.area?.toLowerCase() || "";
//       const combined = `${area} ${pin}`.trim();

//       return pin === text || area.includes(text) || combined === text;
//     });

//     const isAvailableS = availableService.some((item) => {
//       if (!item.isActive) return false;

//       const pin = item.pinCode?.toString().toLowerCase() || "";
//       const area = item.area?.toLowerCase() || "";
//       const combined = `${area} ${pin}`.trim();

//       return pin === text || area.includes(text) || combined === text;
//     });

//     setSearchMessage(
//       text.length > 2 && isAvailable
//         ? "⚡ 30-min delivery now live in some areas"
//         : isAvailableS ? "delivery now live in some areas" : ""
//     );
//   };

//   /* ================= DEBOUNCE ================= */

//   useEffect(() => {
//     if (debounceRef.current) clearTimeout(debounceRef.current);

//     debounceRef.current = setTimeout(() => {
//       checkServiceAvailability(input);
//     }, 400);

//     return () => clearTimeout(debounceRef.current);
//   }, [input, availableService]);

//   /* ================= UI ================= */

//   return (
//     <div className="location-overlay" onClick={onClose}>
//       <div
//         className="location-popup"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* HEADER */}
//         <div className="popup-header">
//           <h5>Enter delivery location</h5>
//           {searchMessage && <p className="service-msg">{searchMessage}</p>}
//           <span className="close-btn" onClick={onClose}>
//             ×
//           </span>
//         </div>

//         {/* INPUT */}
//         <div className="location-input">
//           <div className="country-box">
//             <select
//               className="country-select"
//               value={selectedCountry?.code || ""}
//               onChange={(e) => {
//                 const country = countries.find(
//                   (c) => c.code === e.target.value
//                 );
//                 setSelectedCountry(country);
//               }}
//             >
//               <option value="">Select Country</option>
//               {countries.map((country) => (
//                 <option key={country.code} value={country.code}>
//                   {country.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <input
//             type="text"
//             placeholder="Enter Area / location"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//           />
//         </div>

//         {/* CURRENT LOCATION */}
//         <div
//           className={`current-location ${detecting ? "loading" : ""}`}
//           onClick={handleLocationClick}
//         >
//           <i className="bi bi-crosshair"></i>
//           <span>
//             {detecting ? "Detecting location..." : "Use Current Location"}
//           </span>
//         </div>

//         {/* LOADING */}
//         {loading && (
//           <div className="location-loading">
//             Checking service areas...
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LocationPopup;


import { useState, useEffect, useRef } from "react";
import "./locationPopup.css";
import axios from "axios";
import { useMemo } from "react";

const LocationPopup = ({
  onClose,
  countries = [],
  selectedCountry,
  setSelectedCountry,
}) => {
  const debounceRef = useRef(null);

  const [input, setInput] = useState("");
  const [availableService, setAvailableService] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchMessage, setSearchMessage] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [savedLocation, setSavedLocation] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  /* ================= SAFE STORED LOCATION ================= */
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


  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("CakeLocation") || "null");
      if (stored?.area && stored?.pinCode) {
        setInput(`${stored.area} ${stored.pinCode}`);
      }
    } catch (e) {
      console.log("Storage parse error");
    }
  }, []);

  /* ================= FETCH SERVICE AREAS ================= */

  const fetchServiceLocations = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://api.cakenpetals.com/api/pincode/get-all-pin-codes"
      );
      setAvailableService(res.data?.pinCodes || []);
    } catch (error) {
      console.log("Service fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceLocations();
  }, []);

  /* ================= GEO LOCATION ================= */

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setDetecting(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const res = await axios.get(
            `https://api.cakenpetals.com/api/google-api/reverse-geocode?lat=${latitude}&lon=${longitude}`
          );

          if (!res?.data?.status) {
            alert("Failed to fetch location data.");
            return;
          }

          const detectedLocation = {
            area: res.data.area || "",
            city: res.data.city || "",
            state: res.data.state || "",
            pinCode: res.data.pincode || "",
          };

          const text = `${detectedLocation.area} ${detectedLocation.pinCode}`;

          setInput(text);
          localStorage.setItem(
            "CakeLocation",
            JSON.stringify(detectedLocation)
          );
        } catch (error) {
          console.error("Reverse geocode error:", error);
          alert("Something went wrong while detecting your location.");
        } finally {
          setDetecting(false);
        }
      },
      () => {
        setDetecting(false);
        alert("Permission denied or unable to access your location.");
      }
    );
  };

  /* ================= SERVICE CHECK ================= */

  const checkServiceAvailability = (searchText) => {
    const text = searchText.trim().toLowerCase();

    if (!text || text.length < 2 || !availableService.length) {
      setSearchMessage("");
      return;
    }

    let fastDelivery = false;
    let normalDelivery = false;

    for (const item of availableService) {
      const pin = item.pinCode?.toString().toLowerCase() || "";
      const area = item.area?.toLowerCase() || "";
      const combined = `${area} ${pin}`.trim();

      const match = pin === text || area.includes(text) || combined === text;

      if (!match) continue;
      console.log("DDDDDSSS::=>", item)
      if (item.deleveryTime) fastDelivery = true;
      if (item.deleveryStatus) normalDelivery = true;
    }

    if (text.length <= 2) {
      setSearchMessage("");
    } else if (fastDelivery) {
      setSearchMessage("⚡ 30-min delivery available in your area");
    } else if (normalDelivery) {
      setSearchMessage("🚚 Delivery available in your area");
    } else {
      setSearchMessage("❌ Delivery not available in this area");
    }
  };

  /* ================= DEBOUNCE ================= */

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      checkServiceAvailability(input);
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [input, availableService]);

  /* ================= UI ================= */
  const storedLocation = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("CakeLocation"));
    } catch {
      return null;
    }
  }, []);

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

  const handleSave = () => {
    if (input.trim()) {
      setSavedLocation(input);
      localStorage.setItem("CakeLocation", JSON.stringify(input));
      // alert(`Location saved: ${input}`); // Replace with actual save logic
    }
  };

  return (
    <div className="location-overlay" onClick={onClose}>
      <div className="location-popup" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="popup-header">
          <h5>Enter delivery location</h5>
          {searchMessage && (
            <p className="service-msg">{searchMessage}</p>
          )}
          <span className="close-btn" onClick={onClose}>
            ×
          </span>
        </div>

        {/* INPUT */}
        <div className="location-input">
          <div className="country-box">
            <select
              className="country-select"
              value={selectedCountry?.code || ""}
              onChange={(e) => {
                const country = countries.find(
                  (c) => c.code === e.target.value
                );
                setSelectedCountry(country || null);
              }}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            placeholder="Enter Area / Pincode"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        {/* CURRENT LOCATION */}
        <div
          className={`current-location ${detecting ? "loading" : ""}`}
          onClick={handleLocationClick}
        >
          <i className="bi bi-crosshair"></i>
          <span>
            {detecting ? "Detecting location..." : "Use Current Location"}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 0,gap:10, flexDirection: 'column',padding:15 }}>
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
            <div className="saved-location" >
              <span>✅ Current saved location: {savedLocation}</span>
            </div>
          )}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="location-loading">
            Checking service areas...
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPopup;