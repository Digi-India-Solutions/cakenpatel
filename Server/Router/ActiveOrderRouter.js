const express = require("express");
const router = express.Router();
const ActiveOrder = require("../Controller/ActiveOrderController");

router.post("/upload-active-order", ActiveOrder.updateActiveOrder);
router.get("/get-active-order", ActiveOrder.getAllActiveOrder);

module.exports = router;
