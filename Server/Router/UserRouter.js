const { createRecord, getSingleRecord, getRecord, getAdminUser,adminLogout, adminLogin, updateRolesByAdmin, login, getVerifyAdmin, forgetPassword1, forgetPassword2, forgetPassword3, DeleteRecord } = require("../Controller/UserController")
const { verifyAdmin } = require("../MiddleWare/verifyAdmin")

const userRouter = require("express").Router()

userRouter.post("/user", createRecord)
userRouter.get("/user/:_id", getSingleRecord)
userRouter.get("/user", getRecord)
userRouter.get("/get-admin-user", getAdminUser)
userRouter.delete("/delete-user/:id", DeleteRecord)
userRouter.post("/user/login", login)

userRouter.put("/update-roles-by-admin/:id", updateRolesByAdmin)
userRouter.post("/user/forgetpassword1", forgetPassword1)
userRouter.post("/user/forgetpassword2", forgetPassword2)
userRouter.post("/user/forgetpassword3", forgetPassword3)
userRouter.post("/admin/login", adminLogin)
userRouter.get("/admin/verify-admin", verifyAdmin, getVerifyAdmin)
userRouter.post("/admin/logout", adminLogout);

module.exports = userRouter