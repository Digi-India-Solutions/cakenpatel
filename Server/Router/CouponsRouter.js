const express = require('express');

const { createCoupon, getAllCoupons, changeStatus, deleteCoupon, getCouponById, updateCoupon, getCouponByCode, getCouponByStatus } = require('../Controller/CouponsController');

const CouponsRouter = express.Router();

CouponsRouter.post("/create-coupon", createCoupon);

CouponsRouter.get("/get-All-coupons", getAllCoupons)

CouponsRouter.post("/change-status", changeStatus)

CouponsRouter.get("/delete-coupon/:id", deleteCoupon)

CouponsRouter.get("/get-coupon-by-id/:id", getCouponById)

CouponsRouter.post("/update-coupon/:id", updateCoupon)

CouponsRouter.post("/get-coupon-by-code", getCouponByCode)

CouponsRouter.post("/get-coupon-by-status", getCouponByStatus)

module.exports = CouponsRouter;
