const express = require("express");
const {
    createSubscribe, getAllSubscribe, getSingleSubscribe, updateSubscribe, deleteSubscribe,
} = require("../Controller/SubscribeEmailController");

const SubscribeRouter = express.Router();

// ✅ routes
SubscribeRouter.post("/add-subscribe", createSubscribe);
SubscribeRouter.get("/get-subscribe", getAllSubscribe);
SubscribeRouter.get("/get-single-subscribe/:id", getSingleSubscribe);
SubscribeRouter.put("/update-subscribe/:id", updateSubscribe);
SubscribeRouter.delete("/delete-subscribe/:id", deleteSubscribe);

module.exports = SubscribeRouter;
