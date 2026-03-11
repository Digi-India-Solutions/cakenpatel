const FranchiseEnquiry = require("../Model/FranchiseEnquiryModel");

// =============================================================================
// POST /api/franchise/enquiry/create
// =============================================================================
const createFranchiseEnquiry = async (req, res) => {
    try {
        const { name, phone, email, city, message } = req.body;

        // ── Validation ────────────────────────────────────────────────────────────
        const errors = [];
        if (!name?.trim()) errors.push("Name is required");
        if (!phone?.trim()) errors.push("Phone is required");
        if (errors.length) {
            return res.status(400).json({ success: false, message: errors.join(", ") });
        }

        // ── Duplicate phone check ─────────────────────────────────────────────────
        const existing = await FranchiseEnquiry.findOne({ phone: phone.trim() });
        if (existing) {
            return res.status(409).json({
                success: false, message: "An enquiry with this phone number already exists",
            });
        }

        const enquiry = new FranchiseEnquiry({
            name: name.trim(), phone: phone.trim(), email: email?.trim() || "", city: city?.trim() || "", message: message?.trim() || "",
        });

        await enquiry.save();
        return res.status(201).json({ success: true, message: "Franchise enquiry submitted successfully", data: enquiry, });

    } catch (err) {
        console.error("createFranchiseEnquiry error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// =============================================================================
// GET /api/franchise/enquiry/all  — paginated + search + status filter
// =============================================================================
const getAllFranchiseEnquiries = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.search) {
            const s = req.query.search;
            filter.$or = [
                { name: { $regex: s, $options: "i" } },
                { phone: { $regex: s, $options: "i" } },
                { email: { $regex: s, $options: "i" } },
                { city: { $regex: s, $options: "i" } },
            ];
        }

        const [enquiries, total] = await Promise.all([
            FranchiseEnquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
            FranchiseEnquiry.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            data: enquiries,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1,
            },
        });
    } catch (err) {
        console.error("getAllFranchiseEnquiries error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// =============================================================================
// GET /api/franchise/enquiry/:id
// =============================================================================
const getFranchiseEnquiry = async (req, res) => {
    try {
        const enquiry = await FranchiseEnquiry.findById(req.params.id);
        if (!enquiry) {
            return res.status(404).json({ success: false, message: "Enquiry not found" });
        }
        return res.status(200).json({ success: true, data: enquiry });
    } catch (err) {
        console.error("getFranchiseEnquiry error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// =============================================================================
// PUT /api/franchise/enquiry/update-status/:id
// =============================================================================
const updateFranchiseEnquiryStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const allowed = ["pending", "inProgress", "resolved", "rejected"];

        if (!allowed.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Allowed: ${allowed.join(", ")}`,
            });
        }

        const enquiry = await FranchiseEnquiry.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!enquiry) {
            return res.status(404).json({ success: false, message: "Enquiry not found" });
        }

        return res.status(200).json({
            success: true,
            message: `Status updated to "${status}"`,
            data: enquiry,
        });
    } catch (err) {
        console.error("updateFranchiseEnquiryStatus error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// =============================================================================
// DELETE /api/franchise/enquiry/delete/:id
// =============================================================================
const deleteFranchiseEnquiry = async (req, res) => {
    try {
        const enquiry = await FranchiseEnquiry.findByIdAndDelete(req.params.id);
        if (!enquiry) {
            return res.status(404).json({ success: false, message: "Enquiry not found" });
        }
        return res.status(200).json({ success: true, message: "Enquiry deleted successfully" });
    } catch (err) {
        console.error("deleteFranchiseEnquiry error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    createFranchiseEnquiry,
    getAllFranchiseEnquiries,
    getFranchiseEnquiry,
    updateFranchiseEnquiryStatus,
    deleteFranchiseEnquiry,
};