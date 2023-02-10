const express = require("express");
const {  register,  login,  current,  logout,subscriptionUpdate,  updateAvatar, verification,  reverifyEmail,} = require("../../controllers/user.controller");

const { validateBody, auth, upload, resizeAvatar, } = require("../../middlewares");
const { tryCatchWrapper } = require("../../helpers/index");
const { loginSchema, registerSchema, updateSubscriptionSchema, userMailVerifyValidation } = require("../../schemas/user");

 
const authRouter = express.Router();

authRouter.post(  "/signup", validateBody(registerSchema), tryCatchWrapper(register));
authRouter.post("/login", validateBody(loginSchema), tryCatchWrapper(login));
authRouter.get("/current", auth, tryCatchWrapper(current));
authRouter.get("/logout", auth, tryCatchWrapper(logout));
authRouter.patch( "/", auth, validateBody(updateSubscriptionSchema), tryCatchWrapper(subscriptionUpdate));

authRouter.patch("/avatars", auth,upload.single("avatar"), tryCatchWrapper(resizeAvatar), tryCatchWrapper(updateAvatar));
 
authRouter.get(  "/verify/:verificationToken",  tryCatchWrapper(verification));

authRouter.post("/verify", validateBody(userMailVerifyValidation), tryCatchWrapper(reverifyEmail));

module.exports = {
  authRouter,
};