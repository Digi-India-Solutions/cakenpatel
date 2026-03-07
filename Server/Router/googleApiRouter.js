const express = require("express");
const { request } = require("undici");
const dotenv = require("dotenv");
const { LRUCache } = require("lru-cache");

dotenv.config();
const router = express.Router();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
if (!GOOGLE_API_KEY) {
    console.warn("⚠️ Missing GOOGLE_API_KEY in environment variables");
}

// 🧠 LRU Cache (5 min)
const cache = new LRUCache({
    max: 100,
    ttl: 1000 * 60 * 5,
});

// ⚡ Fast fetch with timeout
async function fetchWithTimeout(url, timeoutMs = 3000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const res = await request(url, {
            method: "GET",
            headers: { "User-Agent": "Biziffy/1.0" },
            signal: controller.signal,
        });

        return await res.body.json();
    } finally {
        clearTimeout(timeout);
    }
}

router.get("/reverse-geocode", async (req, res) => {
    try {
        const lat = Number(req.query.lat);
        const lon = Number(req.query.lon);

        if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
            return res.status(400).json({
                status: false,
                message: "Latitude and longitude must be valid numbers.",
            });
        }

        // ✅ normalize cache key
        const cacheKey = `${lat.toFixed(4)}-${lon.toFixed(4)}`;

        const cached = cache.get(cacheKey);
        if (cached) {
            return res.json({ ...cached, source: "cache" });
        }
        // 🌐 1. Nominatim
        const nomURL = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;
        const nomJSON = await fetchWithTimeout(nomURL);

        const address = nomJSON?.address || {};
        const city = address.city || address.town || address.village || "";
        const pincode = address.postcode || "";
        const area = address.city_district || address.county || "";
        const state = address.state || "";

        if (city && pincode) {
            const result = { status: true, area, city, state, pincode };
            cache.set(cacheKey, result);
            return res.json({ ...result, source: "nominatim" });
        }

        // const googleURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GOOGLE_API_KEY}`;

        // const googleJSON = await fetchWithTimeout(googleURL);

        // if (googleJSON.status !== "OK" || !googleJSON.results?.length) {
        //     return res.status(400).json({
        //         status: false,
        //         message: "Google geocoding failed",
        //         error: googleJSON.error_message || googleJSON.status,
        //     });
        // }

        // const comps = googleJSON.results[0].address_components || [];

        // const get = (...types) => comps.find((c) => types.every((t) => c.types.includes(t)))?.long_name || "";

        // const result = {
        //     status: true,
        //     area:
        //         get("sublocality_level_1") ||
        //         get("sublocality") ||
        //         get("neighborhood") ||
        //         get("route"),
        //     city: get("locality") || get("administrative_area_level_2"),
        //     state: get("administrative_area_level_1"),
        //     pincode: get("postal_code"),
        // };

        // cache.set(cacheKey, result);

        // return res.json({ ...result, source: "google" });

    } catch (e) {
        if (e.name === "AbortError") {
            return res.status(504).json({
                status: false,
                message: "Geocoder timeout.",
            });
        }

        console.error("Reverse geocode error:", e);
        return res.status(500).json({
            status: false,
            message: "Internal server error",
        });
    }
});

module.exports = router;



//   // 🌐 1. Nominatim
//         const nomURL = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;
//         const nomJSON = await fetchWithTimeout(nomURL);

//         const address = nomJSON?.address || {};
//         const city = address.city || address.town || address.village || "";
//         const pincode = address.postcode || "";
//         const area = address.city_district || address.county || "";
//         const state = address.state || "";

//         if (city && pincode) {
//             const result = { status: true, area, city, state, pincode };
//             cache.set(cacheKey, result);
//             return res.json({ ...result, source: "nominatim" });
//         }