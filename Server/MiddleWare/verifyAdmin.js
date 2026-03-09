const jwt = require("jsonwebtoken");

const ADMIN_ROLES = ["Admin", "SuperAdmin"];

const verifyAdmin = (req, res, next) => {
    try {
        const token = req.cookies?.token;
        console.log('token=>', token);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized — you are not logged in",
            });
        }

        let decoded;
        try {
            // ✅ FIX: use the SAME key that adminLogin uses to sign
            decoded = jwt.verify(token, process.env.JWT_SALT_KEY_ADMIN);
        } catch (jwtErr) {
            const message =
                jwtErr.name === "TokenExpiredError"
                    ? "Session expired — please log in again"
                    : "Invalid token — please log in again";
            return res.status(401).json({ success: false, message });
        }

        // ✅ FIX: match exact role strings "Admin" / "SuperAdmin" (not lowercase "admin")
        if (!ADMIN_ROLES.includes(decoded.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied — administrators only",
            });
        }

        req.user = decoded;
        req.token = token; 
        next();

    } catch (error) {
        console.error("verifyAdmin middleware error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = { verifyAdmin };