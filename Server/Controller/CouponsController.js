const Coupon = require("../Model/CouponsModel");

const createCoupon = async (req, res, next) => {
    try {
        const { couponCode, discount,  title, minAmount, isActive, } = req.body;

        const existingCoupon = await Coupon.findOne({ couponCode });
        if (existingCoupon) {
            return res.status(400).json({ success: false, message: "Coupon code already exists." });
        }
        const newCoupon = new Coupon({ couponCode, discount, title, minAmount, isActive });
        await newCoupon.save();

        res.status(201).json({ success: true, message: "Coupon created successfully", coupon: newCoupon });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

const getAllCoupons = async (req, res, next) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, coupons });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

const changeStatus = async (req, res, next) => {
    try {
        const { couponId, isActive } = req.body

        const coupon = await Coupon.findById(couponId);
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found." });
        }
        coupon.isActive = isActive;
        await coupon.save();

        res.status(200).json({ success: true, message: "Coupon status updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

const deleteCoupon = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedCoupon = await Coupon.findOneAndDelete({ _id: id });
        if (!deletedCoupon) {
            return res.status(404).json({ message: "Coupon not found." });
        }
        res.status(200).json({ success: true, message: "Coupon deleted successfully", coupon: deletedCoupon });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

const getCouponById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const coupon = await Coupon.findOne({ _id: id });

        if (!coupon) {
            return res.status(404).json({ success: false, message: "Coupon not found" });
        }

        res.status(200).json({ success: true, coupon });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

const updateCoupon = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { couponCode, discount, title, minAmount, isActive } = req.body;
        if (!couponCode || typeof couponCode !== 'string') {
            return res.status(400).json({ message: "Invalid coupon code." });
        }

        if (discount == null || isNaN(discount) || discount < 0) {
            return res.status(400).json({ message: "Invalid discount value." });
        }

        const updatedCoupon = await Coupon.findOneAndUpdate(
            { _id: id },
            { couponCode, discount, title, minAmount, isActive, updatedAt: Date.now() },
            { new: true } // Return the updated document
        );

        if (!updatedCoupon) {
            return res.status(404).json({ message: "Coupon not found." });
        }

        res.status(200).json({ success: true, message: "Coupon updated successfully", coupon: updatedCoupon });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

const getCouponByCode = async (req, res, next) => {
    try {
        const { couponCode, totalAmount } = req.body;

        if (!couponCode) {
            return res.status(400).json({ success: false, message: "Coupon code is required." });
        }
        if (!totalAmount) {
            return res.status(400).json({ success: false, message: "Total amount is required." });
        }

        const couponCodes = couponCode.trim().toUpperCase(); // case-insensitive handling
        const coupon = await Coupon.findOne({ couponCode: { $regex: new RegExp(`^${couponCodes}$`, 'i') } });

        // const coupon = await Coupon.findOne({ couponCode });

        if (!coupon) {
            return res.status(404).json({ success: false, message: "Coupon not found." });
        }

        if (totalAmount < coupon.minAmount) {
            return res.status(400).json({ success: false, message: "Minimum cart amount not met." });
        }

        return res.status(200).json({ success: true, coupon });

    } catch (error) {
        console.error("Error fetching coupon:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

const getCouponByStatus = async (req, res, next) => {
    try {
        const { isActive } = req.body
        const coupons = await Coupon.find({ isActive: isActive }).sort({ createdAt: -1 });
        if (!coupons) {
            return res.status(404).json({ message: "Coupon not found." });
        }

        res.status(200).json({ success: true, coupons });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { createCoupon, getAllCoupons, changeStatus, deleteCoupon, getCouponById, updateCoupon, getCouponByCode, getCouponByStatus }