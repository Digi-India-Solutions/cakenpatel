const ActiveOrder = require("../Model/ActiveOrderModel");

/* ================= GET ================= */
const getAllActiveOrder = async (req, res) => {
    try {
        const activeOrder = await ActiveOrder.findOne();

        return res.status(200).json({
            success: true,
            data: activeOrder || { isActive: false },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

/* ================= UPDATE ================= */
const updateActiveOrder = async (req, res) => {
    try {
        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isActive must be boolean",
            });
        }

        // ✅ find existing or create new (single record pattern)
        let activeOrder = await ActiveOrder.findOne();

        if (!activeOrder) {
            activeOrder = await ActiveOrder.create({ isActive });
        } else {
            activeOrder.isActive = isActive;
            await activeOrder.save();
        }

        return res.status(200).json({
            success: true,
            data: activeOrder,
            message: isActive ? "Orders Activated" : "Orders Deactivated",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = {
    getAllActiveOrder,
    updateActiveOrder,
};
