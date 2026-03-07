const express = require('express');
const { createCountdown, getCountdown, updateCountdown, getSingleCountdown, deleteCountdown, updateStatus,getCountdownByCategory } = require('../Controller/CountDownController');

const CountdownRouter = express.Router();

CountdownRouter.post("/create-countdown", createCountdown);

CountdownRouter.get("/get-all-countdown", getCountdown);

CountdownRouter.post("/update-countdown/:id", updateCountdown);

CountdownRouter.delete("/delete-countdown/:id", deleteCountdown);

CountdownRouter.get("/get-single-countdown/:id", getSingleCountdown);

CountdownRouter.post("/update-status/:id", updateStatus);

CountdownRouter.get("/get-countdown-by-category/:id", getCountdownByCategory);

module.exports = CountdownRouter;
