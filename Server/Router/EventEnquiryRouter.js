const express = require("express");
const {
    createEnquiry, getAllEnquiries, getEnquiry, updateEnquiryStatus, deleteEnquiry,
} = require("../Controller/EventEnquiryController");

const EnquiryRouter = express.Router();

// ── Specific routes BEFORE /:id ───────────────────────────────────────────────
EnquiryRouter.post("/create", createEnquiry);
EnquiryRouter.get("/all", getAllEnquiries);
EnquiryRouter.put("/update-status/:id", updateEnquiryStatus);
EnquiryRouter.delete("/delete/:id", deleteEnquiry);
EnquiryRouter.get("/:id", getEnquiry);

module.exports = EnquiryRouter;