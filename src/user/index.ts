import express from "express";
import MessageResponse from "../interfaces/MessageResponse";
import path from "path";
import controller from "./controller/user";
import hydration from "./controller/hydration";

import extractJWT from "../middleware/extractJWT";
const router = express.Router();

router.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "User-🌏-Section",
  });
});
router.get("/validate", extractJWT, controller.validateToken);
router.post("/signup", controller.register);
router.post("/verifyemail", controller.verifyEmail);
router.post("/verifymobile", controller.verifyMobile);
router.post("/forgotpassword", controller.forgotPassword);
router.put("/resetpassword", controller.resetPassword);
router.post("/login", controller.login);
router.get("/get/all", controller.getAllUsers);
router.post("/profile", controller.Profile);
router.get("/logout", extractJWT, controller.logoutUser);
router.put("/updateprofile", controller.updateProfile);
router.put("/changepassword", controller.changePassword);
router.post("/checkemail", controller.checkEmailExists);
router.post("/checkmobile", controller.checkMobileExists);
router.post("/waterInTakeSuggestion", hydration.waterSuggestion);
export default router;
