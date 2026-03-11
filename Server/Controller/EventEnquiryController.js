
const Enquiry = require("../Model/EventEnquiryModel");

// =============================================================================
// POST /api/event/enquiry/create
// =============================================================================
const createEnquiry = async (req, res) => {
    try {
        const { name, phone, email, message, enquiryType, enquiryTitle, userId } = req.body;

        // ── Validation ────────────────────────────────────────────────────────────
        const errors = [];
        if (!name?.trim()) errors.push("Name is required");
        if (!phone?.trim()) errors.push("Phone is required");
        if (errors.length) {
            return res.status(400).json({ success: false, message: errors.join(", ") });
        }

        const enquiry = new Enquiry({
            name: name.trim(),
            phone: phone.trim(),
            email: email?.trim() || "",
            message: message?.trim() || "",
            enquiryType: enquiryType?.trim() || "",
            enquiryTitle: enquiryTitle?.trim() || "",
            userId: userId || null,
        });

        await enquiry.save();
        return res.status(201).json({
            success: true,
            message: "Enquiry submitted successfully",
            data: enquiry,
        });

    } catch (err) {
        console.error("createEnquiry error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// =============================================================================
// GET /api/event/enquiry/all  — paginated + filterable (admin)
// =============================================================================
const getAllEnquiries = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const skip = (page - 1) * limit;

        // Optional filters
        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.enquiryType) filter.enquiryType = req.query.enquiryType;
        if (req.query.enquiryTitle) filter.enquiryTitle = req.query.enquiryTitle;
        if (req.query.search) {
            const s = req.query.search;
            filter.$or = [
                { name: { $regex: s, $options: "i" } },
                { phone: { $regex: s, $options: "i" } },
                { email: { $regex: s, $options: "i" } },
                { enquiryTitle: { $regex: s, $options: "i" } },
                { enquiryType: { $regex: s, $options: "i" } },
            ];
        }

        const [enquiries, total] = await Promise.all([
            Enquiry.find(filter)
                .populate("userId", "name email phone")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Enquiry.countDocuments(filter),
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
        console.error("getAllEnquiries error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// =============================================================================
// GET /api/event/enquiry/:id
// =============================================================================
const getEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.findById(req.params.id)
            .populate("userId", "name email phone");

        if (!enquiry) {
            return res.status(404).json({ success: false, message: "Enquiry not found" });
        }
        return res.status(200).json({ success: true, data: enquiry });
    } catch (err) {
        console.error("getEnquiry error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// =============================================================================
// PUT /api/event/enquiry/update-status/:id  — update status only
// =============================================================================
const updateEnquiryStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowed = ["pending", "inProgress", "resolved", "rejected"];
        if (!allowed.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Allowed: ${allowed.join(", ")}`,
            });
        }

        const enquiry = await Enquiry.findByIdAndUpdate(
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
        console.error("updateEnquiryStatus error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// =============================================================================
// DELETE /api/event/enquiry/delete/:id
// =============================================================================
const deleteEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
        if (!enquiry) {
            return res.status(404).json({ success: false, message: "Enquiry not found" });
        }
        return res.status(200).json({ success: true, message: "Enquiry deleted successfully" });
    } catch (err) {
        console.error("deleteEnquiry error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    createEnquiry,
    getAllEnquiries,
    getEnquiry,
    updateEnquiryStatus,
    deleteEnquiry,
};