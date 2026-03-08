const express = require('express');
const upload = require('../MiddleWare/Multer');
const {
    createPincodeByExcel,
        getAllPinCodes,
    createPincode,
    getAllPinCodesById,
    updatePincode,
    deletePincode,
    getAreapincodeByState,
    getAllPinCodesWithPagination,
    changeStatus,
    changeDeleveryTimeStatus
} = require("../Controller/PincodeController");

const router = express.Router();

router.post("/create-pincode-by-excel", createPincodeByExcel)
router.get("/get-all-pin-codes", getAllPinCodes)
router.get("/get-All-PinCodesWith-Pagination", getAllPinCodesWithPagination)
router.post("/create-pincode", createPincode)
router.get("/get-all-pin-codes-by-id/:id", getAllPinCodesById)
router.post("/update-pincode/:id", updatePincode)
router.get("/delete-Pincode/:id", deletePincode)
router.post("/get-areapincode-by-state", getAreapincodeByState)
router.post("/change-status", changeStatus)
router.post("/change-delevery-time-status" ,changeDeleveryTimeStatus)
module.exports = router
