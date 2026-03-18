import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const CountdownTimer = ({ categoryId, onTimeUpdate }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const intervalRef = useRef(null);
  const startRef = useRef(null);
  const endRef = useRef(null);

  /* ================= FETCH CONFIG ================= */

  useEffect(() => {
    if (!categoryId) return;

    let isMounted = true;

    const fetchCountdown = async () => {
      try {
        const res = await axios.get(
          `https://api.cakenpetals.com/api/countdown/get-countdown-by-category/${categoryId}`,
        );

        if (!isMounted) return;

        const config = res?.data?.data;
        if (!config?.startTime || !config?.endTime) return;

        const today = new Date().toLocaleDateString("en-CA");

        startRef.current = new Date(`${today}T${config.startTime}:00`);
        endRef.current = new Date(`${today}T${config.endTime}:00`);

        startTimer(config);
      } catch (e) {
        console.error("Countdown fetch error:", e);
      }
    };

    fetchCountdown();

    return () => {
      isMounted = false;
      clearInterval(intervalRef.current);
    };
  }, [categoryId]);

  /* ================= TIMER ================= */

  const startTimer = (config) => {
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const now = new Date();
      const startDateTime = startRef.current;
      const endDateTime = endRef.current;

      if (!startDateTime || !endDateTime) return;

      /* before start */
      if (now < startDateTime) {
        if (timeLeft !== null) setTimeLeft(null);

        onTimeUpdate?.({
          remainingMs: 0,
          startTime: config.startTime,
          endTime: config.endTime,
        });

        return;
      }

      /* after end */
      if (now >= endDateTime) {
        clearInterval(intervalRef.current);
        setTimeLeft(null);

        onTimeUpdate?.({
          remainingMs: 0,
          startTime: config.startTime,
          endTime: config.endTime,
        });

        return;
      }

      /* active countdown */
      const diff = endDateTime - now;

      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      setTimeLeft((prev) => {
        if (
          prev &&
          prev.hours === hours &&
          prev.minutes === minutes &&
          prev.seconds === seconds
        ) {
          return prev;
        }
        return { hours, minutes, seconds };
      });

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
