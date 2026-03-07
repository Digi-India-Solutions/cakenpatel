const router = require("express").Router();
const upload = require("../MiddleWare/Multer");
const ctrl = require("../Controller/RecommendedCategoryController");

router.post("/create-recommended-category", upload.single("image"), ctrl.createRecommendedCategory);
router.get("/get-recommended-category", ctrl.getAllRecommendedCategories);
router.get("/get-active-recommended-category", ctrl.getActiveRecommendedCategories);
router.get("/get-single-recommended-category/:id", ctrl.getRecommendedCategoryById);
router.put("/update-recommended-category/:id", upload.single("image"), ctrl.updateRecommendedCategory);
router.delete("/delete-recommended-category/:id", ctrl.deleteRecommendedCategory);

module.exports = router;
