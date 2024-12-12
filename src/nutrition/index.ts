import express from "express";
import MessageResponse from "../interfaces/MessageResponse";
import path from "path";
import nutritionAction from "./controller/NutritionController";


import extractJWT from "../middleware/extractJWT";
const router = express.Router();

router.get<{}, MessageResponse>("/", (req, res) => {
    res.json({
        message: "Nutrition-🌏-Section",
    });
});
router.get("/nutrition-search", nutritionAction.nutritionSearch);
router.post("/save-nutrition-item", nutritionAction.saveUserNutrition);
router.post("/change-nutrition-date-time", nutritionAction.updateUserNutritionDateTime);
router.post("/get-daybased-nutrion-data", nutritionAction.userDayBasedNutritionData);
router.get("/get-user-last-added-items", nutritionAction.userOrderedItems);
router.get("/favourite-items", nutritionAction.userFavouriteItems);
export default router;
