const Subscribe = require("../Model/SubscribeEmailModel");

/* ================= CREATE ================= */
exports.createSubscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(200).json({ success: false, message: "Email is required", });
        }

        // check duplicate
        const exists = await Subscribe.findOne({ email: email.toLowerCase().trim(), });

        if (exists) {
            return res.status(200).json({ success: false, message: "Email already subscribed", });
        }

        const record = await Subscribe.create({ email: email.toLowerCase().trim(), });

        return res.status(201).json({
            success: true, message: "Subscribed successfully", data: record,
        });
        
    } catch (error) {
        console.error("Create subscribe error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

/* ================= GET ALL ================= */
exports.getAllSubscribe = async (req, res) => {
    try {
        const data = await Subscribe.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: data.length,
            data,
        });
    } catch (error) {
        console.error("Get subscribe error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

/* ================= GET SINGLE ================= */
exports.getSingleSubscribe = async (req, res) => {
    try {
        const { id } = req.params;

        const record = await Subscribe.findById(id);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: record,
        });
    } catch (error) {
        console.error("Get single subscribe error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

/* ================= UPDATE ================= */
exports.updateSubscribe = async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        // check duplicate (exclude current)
        const exists = await Subscribe.findOne({
            email: email.toLowerCase().trim(),
            _id: { $ne: id },
        });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        const updated = await Subscribe.findByIdAndUpdate(
            id,
            { email: email.toLowerCase().trim() },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Subscription updated",
            data: updated,
        });
    } catch (error) {
        console.error("Update subscribe error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

/* ================= DELETE ================= */
exports.deleteSubscribe = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Subscribe.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Subscription deleted",
        });
    } catch (error) {
        console.error("Delete subscribe error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
