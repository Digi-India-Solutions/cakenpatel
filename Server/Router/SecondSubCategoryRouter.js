const {
    createSecondSubcategory, getAllSecondSubcategories, getSecondSubcategoryById,
    getSecondSubcategoryBySubcategory, updateSecondSubcategory, deleteSecondSubcategory,
    getAllSecondSubcategoriesStatusTrue, getSecondSubcategoryByName, getActiveSecondSubcategories
} = require("../Controller/SecondSubCategoryController");
const upload = require("../MiddleWare/Multer");

const SecondSubCategoryRouter = require("express").Router()

SecondSubCategoryRouter.post("/create-second-sub-category", upload.single('image'), createSecondSubcategory);
SecondSubCategoryRouter.get("/get-second-sub-category", getAllSecondSubcategories);
SecondSubCategoryRouter.get("/get-active-second-sub-category", getActiveSecondSubcategories);
SecondSubCategoryRouter.get("/get-second-sub-category-by-status", upload.single('image'), getAllSecondSubcategoriesStatusTrue);// new added
SecondSubCategoryRouter.get("/get-single-second-sub-category/:id", getSecondSubcategoryById);
SecondSubCategoryRouter.get("/get-second-sub-category-by-name/:name", getSecondSubcategoryByName);
SecondSubCategoryRouter.put("/update-second-sub-category/:id", upload.single('image'), updateSecondSubcategory);
SecondSubCategoryRouter.delete("/delete-second-sub-category/:id", deleteSecondSubcategory);
SecondSubCategoryRouter.get("/get-second-subcategory-by-subcategory/:id", getSecondSubcategoryBySubcategory);


module.exports = SecondSubCategoryRouter