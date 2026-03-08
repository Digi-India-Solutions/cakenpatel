const { createSubcategory, getAllSubcategories, getSubcategoryById, updateSubcategory, deleteSubcategory, getAllSubcategoriesStatusTrue, getSubcategoryByName, getActiveSubcategories, getSubcategoryByMaincategory } = require("../Controller/SubcategoryController");
const upload = require("../MiddleWare/Multer");

const SubcCategoryRouter = require("express").Router()

SubcCategoryRouter.post("/create-subcategory", upload.fields([{ name: "image", maxCount: 1 }, { name: "banner", maxCount: 1 }]), createSubcategory);
SubcCategoryRouter.get("/get-subcategory", getAllSubcategories);
SubcCategoryRouter.get("/get-getActiveSubcategories", getActiveSubcategories);
SubcCategoryRouter.get("/get-subcategory-by-status", upload.fields([{ name: "image", maxCount: 1 }, { name: "banner", maxCount: 1 }]), getAllSubcategoriesStatusTrue);// new added
SubcCategoryRouter.get("/get-single-subcategory/:id", getSubcategoryById);
SubcCategoryRouter.get("/get-subcategory-by-name/:name", getSubcategoryByName);
SubcCategoryRouter.put("/update-subcategory/:id", upload.fields([{ name: "image", maxCount: 1 }, { name: "banner", maxCount: 1 }]), updateSubcategory);
SubcCategoryRouter.delete("/delete-subcategory/:id", deleteSubcategory);
SubcCategoryRouter.get("/get-subcategory-by-maincategory/:id", getSubcategoryByMaincategory);


module.exports = SubcCategoryRouter