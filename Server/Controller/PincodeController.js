// import PinCode from "../../models/PinCodeModel"; // Adjust path as needed
const PinCode = require('../Model/PincodeModel');


const createPincodeByExcel = async (req, res) => {
    try {
        const data = req.body;

        if (!Array.isArray(data) || data.length === 0) {
            return res.status(400).json({ status: false, message: "Input data must be a non-empty array.", });
        }

        // 1. Normalize incoming data
        const normalizedData = data.map((item) => ({
            state: String(item["State"] || "").trim(),
            area: String(item["Area Name"] || "").trim(),
            pinCode: String(item["pinCode"] || "").trim(),
        }));



        // 3. Find existing pincodes in DB once
        const allPinCodes = await PinCode.find(
            {},
            { stateName: 1, area: 1, pinCode: 1 }
        );

        const existingSet = new Set(
            allPinCodes.map(
                (p) =>
                    `${p.stateName.toLowerCase()}|${p.area.toLowerCase()}|${p.pinCode}`
            )
        );

        const created = [];
        const duplicates = [];
        const invalid = [];

        // 4. Process in-memory
        for (const item of normalizedData) {
            const { state, area, pinCode } = item;

            if (!state || !area || !pinCode) {
                invalid.push({ ...item, reason: "Missing required fields" });
                continue;
            }



            const key = `${state.toLowerCase()}|${area.toLowerCase()}|${pinCode}`;
            if (existingSet.has(key)) {
                duplicates.push({ ...item, reason: "Already exists" });
                continue;
            }

            // Mark it as to be created
            existingSet.add(key);
            created.push({
                stateName: state,
                area,
                pinCode,
            });
        }

        // 5. Bulk insert for performance
        if (created.length > 0) {
            await PinCode.insertMany(created, { ordered: false });
        }

        return res.status(200).json({
            status: true,
            message: "Pin codes processed",
            createdCount: created.length,
            duplicateCount: duplicates.length,
            invalidCount: invalid.length,
            created: created.slice(0, 5), // send preview, not full 17k data
            duplicates: duplicates.slice(0, 5),
            invalid: invalid.slice(0, 5),
        });
    } catch (err) {
        console.error("Error uploading pin codes:", err);
        return res.status(500).json({ status: false, message: "Server error while uploading pin codes", });
    }
};


const getAllPinCodes = async (req, res) => {
    try {
        const pinCodes = await PinCode.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ status: true, message: "Pin codes fetched successfully", pinCodes, });
    } catch (err) {
        console.error("Error fetching pin codes:", err);
        return res.status(500).json({ status: false, message: "Server error while fetching pin codes", });
    }
};


const getAllPinCodesWithPagination = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const search = (req.query.search)?.trim() || "";
        const skip = (page - 1) * limit;

        let query = {};

        if (search) {
            query = {
                $or: [
                    { stateName: { $regex: search, $options: "i" } },
                    { area: { $regex: search, $options: "i" } },
                    { pinCode: { $regex: search, $options: "i" } }, // ✅ fixed: keep search as string
                ],
            };
        }

        // Fetch paginated pin codes
        const pinCodes = await PinCode.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Count total records for pagination
        const totalCount = await PinCode.countDocuments(query);

        return res.status(200).json({
            status: true,
            message: "Pin codes fetched successfully",
            pinCodes,
            pagination: {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit),
            },
        });
    } catch (err) {
        console.error("Error fetching pin codes:", err);
        return res.status(500).json({
            status: false,
            message: "Server error while fetching pin codes",
        });
    }
};

const createPincode = async (req, res) => {
    try {
        const { stateName, area, pinCode } = req.body;
        const newPin = await PinCode.create({ stateName, area, pinCode, });
        return res.status(200).json({ status: true, message: "Pin code created successfully", data: newPin, });
    } catch (err) {
        console.error("Error creating pin code:", err);
        return res.status(500).json({ status: false, message: "Server error while creating pin code", });
    }
}

const getAllPinCodesById = async (req, res) => {
    try {
        const pinCodes = await PinCode.findById(req.params.id).sort({ createdAt: -1 });
        return res.status(200).json({ status: true, message: "Pin codes fetched successfully", pinCodes, });
    } catch (err) {
        console.error("Error fetching pin codes:", err);
        return res.status(500).json({ status: false, message: "Server error while fetching pin codes", });
    }
}

const updatePincode = async (req, res) => {
    try {
        const { stateName, area, pinCode, isActive } = req.body;
        const updatedPin = await PinCode.findByIdAndUpdate(req.params.id, { stateName, area, pinCode, isActive }, { new: true });
        return res.status(200).json({ status: true, message: "Pin code updated successfully", data: updatedPin, });
    } catch (err) {
        console.error("Error updating pin code:", err);
        return res.status(500).json({ status: false, message: "Server error while updating pin code", });
    }
}

const deletePincode = async (req, res) => {
    try {
        const deletedPin = await PinCode.findByIdAndDelete(req.params.id);
        return res.status(200).json({ status: true, message: "Pin code deleted successfully", data: deletedPin, });
    } catch (err) {
        console.error("Error deleting pin code:", err);
        return res.status(500).json({ status: false, message: "Server error while deleting pin code", });
    }
}

const getAreapincodeByState = async (req, res) => {
    try {
        const { state } = req?.body;

        if (!state) {
            return res.status(400).json({ message: "State is required" });
        }

        const data = await PinCode.find({ stateName: state });
        res.status(200).json(data);
    } catch (err) {
        console.error("Error fetching area-pincode:", err);
        res.status(500).json({ message: "Server Error" });
    }
}

const changeStatus = async (req, res) => {
    try {
        const { productId, status } = req.body;
        const updatedStatus = await PinCode.findByIdAndUpdate(productId, { deleveryStatus: status }, { new: true });
        return res.status(200).json({ status: true, message: "Pin code status updated successfully", data: updatedStatus, });
    } catch (err) {
        console.error("Error updating pin code status:", err);
        return res.status(500).json({ status: false, message: "Server error while updating pin code status", });
    }
}

const changeDeleveryTimeStatus = async (req, res) => {
    try {
        const { productId, status } = req.body;
        const updatedStatus = await PinCode.findByIdAndUpdate(productId, { deleveryTime: status }, { new: true });
        return res.status(200).json({ status: true, message: "Pin code status updated successfully", data: updatedStatus, });
    } catch (err) {
        console.error("Error updating pin code status:", err);
        return res.status(500).json({ status: false, message: "Server error while updating pin code status", });
    }
}
module.exports = {
    createPincode, changeStatus, changeDeleveryTimeStatus, getAllPinCodes, getAllPinCodesWithPagination, createPincodeByExcel, getAllPinCodesById, deletePincode, updatePincode, getAreapincodeByState
};
