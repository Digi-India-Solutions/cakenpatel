/**
 * Router/FranchiseRouter.js
 *
 * POST   /api/franchise/enquiry/create              — submit (frontend)
 * GET    /api/franchise/enquiry/all                 — all paginated (admin)
 * GET    /api/franchise/enquiry/:id                 — single enquiry
 * PUT    /api/franchise/enquiry/update-status/:id   — update status (admin)
 * DELETE /api/franchise/enquiry/delete/:id          — delete (admin)
 */

const express = require("express");
const {
    createFranchiseEnquiry,
    getAllFranchiseEnquiries,
    getFranchiseEnquiry,
    updateFranchiseEnquiryStatus,
    deleteFranchiseEnquiry,
} = require("../Controller/FranchiseEnquiryController");

const FranchiseRouter = express.Router();

// ── Specific routes BEFORE /:id ───────────────────────────────────────────────
FranchiseRouter.post("/create", createFranchiseEnquiry);
FranchiseRouter.get("/all", getAllFranchiseEnquiries);
FranchiseRouter.put("/update-status/:id", updateFranchiseEnquiryStatus);
FranchiseRouter.delete("/delete/:id", deleteFranchiseEnquiry);
FranchiseRouter.get("/:id", getFranchiseEnquiry);

module.exports = FranchiseRouter;