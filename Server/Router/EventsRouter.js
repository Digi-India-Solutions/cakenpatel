

const express = require("express");
const upload = require("../MiddleWare/Multer");
const handleMulterError = require("../MiddleWare/handleMulterError");
const {
    createEvent, getAllEvents, getActiveEvents,
    getEvent, updateEvent, deleteEvent, toggleEventStatus,
} = require("../Controller/EventsController");

const EventRouter = express.Router();

const uploadImage = [...upload.single("image"), handleMulterError];

EventRouter.get("/all", getAllEvents);
EventRouter.get("/active", getActiveEvents);
EventRouter.post("/create", ...uploadImage, createEvent);
EventRouter.get("/:id", getEvent);
EventRouter.put("/update/:id", ...uploadImage, updateEvent);
EventRouter.delete("/delete/:id", deleteEvent);
EventRouter.patch("/toggle-status/:id", toggleEventStatus);

module.exports = EventRouter;