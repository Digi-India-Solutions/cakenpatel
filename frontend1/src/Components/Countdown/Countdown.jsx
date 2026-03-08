// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";

// const CountdownTimer = ({ categoryId, onTimeUpdate }) => {
//   const [timeLeft, setTimeLeft] = useState(null);
//   const [config, setConfig] = useState(null);
//   const intervalRef = useRef(null);

//   /* ================= FETCH ================= */

//   useEffect(() => {
//     if (!categoryId) return;

//     const fetchCountdown = async () => {
//       try {
//         const res = await axios.get(
//           `https://api.cakenpetals.com/api/countdown/get-countdown-by-category/${categoryId}`
//         );

//         if (res?.data?.data) {
//           setConfig(res.data.data);
//         }
//       } catch (e) {
//         console.log("Countdown fetch error:", e);
//       }
//     };

//     fetchCountdown();
//   }, [categoryId]);

//   /* ================= DAILY TIMER ================= */

//   useEffect(() => {
//     if (!config?.startTime || !config?.endTime) return;

//     startDailyTimer();

//     return () => clearInterval(intervalRef.current);
//   }, [config]);

//   const startDailyTimer = () => {
//     clearInterval(intervalRef.current);

//     intervalRef.current = setInterval(() => {
//       const now = new Date();

//       // 🔥 build today's start & end datetime
//       const today = now.toISOString().split("T")[0];

//       const startDateTime = new Date(`${today}T${config.startTime}:00`);
//       const endDateTime = new Date(`${today}T${config.endTime}:00`);

//       // ✅ before start → no countdown
//       if (now < startDateTime) {
//         setTimeLeft(null);
//         onTimeUpdate?.({
//   remainingMs: 0,
//   startTime: config.startTime,
//   endTime: config.endTime,
// });
//         return;
//       }

//       // ✅ after end → no countdown
//       if (now >= endDateTime) {
//         setTimeLeft(null);
//         onTimeUpdate?.({
//   remainingMs: 0,
//   startTime: config.startTime,
//   endTime: config.endTime,
// });
//         return;
//       }

//       // ✅ active window → run countdown
//       const diff = endDateTime - now;

//       const hours = Math.floor(diff / (1000 * 60 * 60));
//       const minutes = Math.floor((diff / (1000 * 60)) % 60);
//       const seconds = Math.floor((diff / 1000) % 60);

//       setTimeLeft({ hours, minutes, seconds });
//       onTimeUpdate?.(diff);
//     }, 1000);
//   };

//   /* ================= UI ================= */

//   if (!timeLeft) return null;

//   return (
//     <div
//       className="countdown-box"
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: "8px",
//         flexWrap: "wrap",
//         fontWeight: 500,
//       }}
//     >
//       <i
//         className="fa-solid fa-truck"
//         style={{ fontSize: "18px", color: "#000" }}
//       ></i>

//       <span>Get today! Order within</span>

//       <strong
//         className="countdown-timer"
//         style={{ color: "#197889", fontWeight: 700 }}
//       >
//         {String(timeLeft.hours).padStart(2, "0")}h :
//         {String(timeLeft.minutes).padStart(2, "0")}m :
//         {String(timeLeft.seconds).padStart(2, "0")}s
//       </strong>
//     </div>
//   );
// };

// export default CountdownTimer;


import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const CountdownTimer = ({ categoryId, onTimeUpdate }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [config, setConfig] = useState(null);
  const intervalRef = useRef(null);

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!categoryId) return;

    const fetchCountdown = async () => {
      try {
        const res = await axios.get(
          `https://api.cakenpetals.com/api/countdown/get-countdown-by-category/${categoryId}`
        );

        if (res?.data?.data) {
          setConfig(res.data.data);
        }
      } catch (e) {
        console.log("Countdown fetch error:", e);
      }
    };

    fetchCountdown();
  }, [categoryId]);

  /* ================= DAILY TIMER ================= */

  useEffect(() => {
    if (!config?.startTime || !config?.endTime) return;

    startDailyTimer();

    return () => clearInterval(intervalRef.current);
  }, [config]);

  const startDailyTimer = () => {
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const now = new Date();

      // 🔥 build today's start & end datetime
      // const today = now.toISOString().split("T")[0];
      const today = now.toLocaleDateString("en-CA");
      
      const startDateTime = new Date(`${today}T${config.startTime}:00`);
      const endDateTime = new Date(`${today}T${config.endTime}:00`);

      // ✅ before start → no countdown
      if (now < startDateTime) {
        setTimeLeft(null);
        onTimeUpdate?.({
          remainingMs: 0,
          startTime: config.startTime,
          endTime: config.endTime,
        });
        return;
      }

      // ✅ after end → no countdown
      if (now >= endDateTime) {
        setTimeLeft(null);
        onTimeUpdate?.({
          remainingMs: 0,
          startTime: config.startTime,
          endTime: config.endTime,
        });
        return;
      }

      // ✅ active window → run countdown
      const diff = endDateTime - now;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
      // onTimeUpdate?.(diff);
      onTimeUpdate?.({
        remainingMs: diff,
        startTime: config.startTime,
        endTime: config.endTime,
      });

    }, 1000);
  };

  /* ================= UI ================= */

  if (!timeLeft) return null;

  return (
    <div
      className="countdown-box"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        flexWrap: "wrap",
        fontWeight: 500,
      }}
    >
      <i
        className="fa-solid fa-truck"
        style={{ fontSize: "18px", color: "#000" }}
      ></i>

      <span>Get today! Order within</span>

      <strong
        className="countdown-timer"
        style={{ color: "#197889", fontWeight: 700 }}
      >
        {String(timeLeft.hours).padStart(2, "0")}h :
        {String(timeLeft.minutes).padStart(2, "0")}m :
        {String(timeLeft.seconds).padStart(2, "0")}s
      </strong>
    </div>
  );
};

export default CountdownTimer;
