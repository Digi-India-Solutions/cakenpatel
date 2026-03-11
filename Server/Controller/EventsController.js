const fs = require("fs");
const path = require("path");
const Event = require("../Model/EventsModel");

const deleteImageFile = (filePath) => {
    if (!filePath) return;
    const abs = path.isAbsolute(filePath)
        ? filePath
        : path.join(__dirname, "..", filePath);
    if (fs.existsSync(abs)) fs.unlinkSync(abs);
};

const createEvent = async (req, res) => {
    const imagePath = req.file?.relativePath || req.file?.path || null;
    try {
        const { EventTitle, ActiveonHome } = req.body;

        const errors = [];
        if (!EventTitle?.trim()) errors.push("Event Title is required");
        if (!imagePath) errors.push("Event Image is required");
        if (errors.length) {
            if (imagePath) deleteImageFile(imagePath);
            return res.status(400).json({ success: false, message: errors.join(", ") });
        }

        const existing = await Event.findOne({
            EventTitle: { $regex: `^${EventTitle.trim()}$`, $options: "i" },
        });
        if (existing) {
            deleteImageFile(imagePath);
            return res.status(409).json({ success: false, message: "Event with this title already exists" });
        }

        const event = new Event({
            EventTitle: EventTitle.trim(),
            image: imagePath,
            ActiveonHome: ActiveonHome === "true" || ActiveonHome === true,
        });

        await event.save();
        return res.status(201).json({ success: true, message: "Event created successfully", data: event });

    } catch (err) {
        if (imagePath) deleteImageFile(imagePath);
        console.error("createEvent error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

const getAllEvents = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const skip = (page - 1) * limit;

        const [events, total] = await Promise.all([
            Event.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            Event.countDocuments(),
        ]);

        return res.status(200).json({
            success: true,
            data: events,
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
        return res.status(500).json({ success: false, message: err.message });
    }
};

const getActiveEvents = async (_req, res) => {
    try {
        const events = await Event.find({ ActiveonHome: true }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, total: events.length, data: events });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: "Event not found" });
        return res.status(200).json({ success: true, data: event });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const updateEvent = async (req, res) => {
    const newImagePath = req.file?.relativePath || req.file?.path || null;
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            if (newImagePath) deleteImageFile(newImagePath);
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        const newTitle = req.body.EventTitle?.trim();
        if (newTitle && newTitle.toLowerCase() !== event.EventTitle.toLowerCase()) {
            const existing = await Event.findOne({
                EventTitle: { $regex: `^${newTitle}$`, $options: "i" },
                _id: { $ne: req.params.id },
            });
            if (existing) {
                if (newImagePath) deleteImageFile(newImagePath);
                return res.status(409).json({ success: false, message: "Event with this title already exists" });
            }
        }

        // Delete old image when new one uploaded
        if (newImagePath) deleteImageFile(event.image);

        const updatedData = {
            ...(newTitle && { EventTitle: newTitle }),
            ...(newImagePath && { image: newImagePath }),
            ...(req.body.ActiveonHome !== undefined && {
                ActiveonHome: req.body.ActiveonHome === "true" || req.body.ActiveonHome === true,
            }),
        };

        const updated = await Event.findByIdAndUpdate(req.params.id, updatedData, {
            new: true, runValidators: true,
        });
        return res.status(200).json({ success: true, message: "Event updated successfully", data: updated });

    } catch (err) {
        if (newImagePath) deleteImageFile(newImagePath);
        console.error("updateEvent error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: "Event not found" });
        deleteImageFile(event.image);
        await Event.findByIdAndDelete(req.params.id);
        return res.status(200).json({ success: true, message: "Event deleted successfully" });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const toggleEventStatus = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: "Event not found" });
        event.ActiveonHome = !event.ActiveonHome;
        await event.save();
        return res.status(200).json({
            success: true,
            message: `Event is now ${event.ActiveonHome ? "Active" : "Inactive"} on Home`,
            data: event,
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { createEvent, getAllEvents, getActiveEvents, getEvent, updateEvent, deleteEvent, toggleEventStatus, };
