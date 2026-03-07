const express = require("express");
const router = express.Router();
const wishlistCtrl = require("../Controller/wishlistController");

// CRUD routes
router.post("/add-wishlist", wishlistCtrl.addWishlist);
router.delete("/remove-wishlist", wishlistCtrl.removeWishlist);
router.get("/get-wishlist/:userId", wishlistCtrl.getWishlist);
router.delete("/clear-wishlist", wishlistCtrl.clearWishlist);

module.exports = router;
