const handleMulterError = (err, _req, res, next) => {
    if (err?.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ success: false, message: "Image too large. Max size is 5 MB." });
    }
    if (err?.message) {
        return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
};

module.exports = handleMulterError;