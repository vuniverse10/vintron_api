import express from "express";
import MessageResponse from "../../interfaces/MessageResponse";
import path from "path";
import nutritionAction from "./controller/NutritionController";


import extractJWT from "../../middleware/extractJWT";
const router = express.Router();

router.get<{}, MessageResponse>("/", (req, res) => {
    res.json({
        message: "Nutrition-🌏-Section",
    });
});
router.get("/nutrition-search", nutritionAction.nutritionSearch);

export default router;
