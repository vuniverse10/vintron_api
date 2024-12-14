import express from "express";
import MessageResponse from "../interfaces/MessageResponse";
import path from "path";
import hydrationAction from "./controller/HydrationController";

import extractJWT from "../middleware/extractJWT";
const router = express.Router();

router.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "Hydration-🥤-Section",
  });
});
router.get("/nutrition-search", hydrationAction.nutritionSearch);
router.post("/save-nutrition-item", hydrationAction.saveUserNutrition);
router.post(
  "/update-nutrition-item-by-user",
  hydrationAction.updateUserNutritionData
);
router.post(
  "/user-nutrition-filters",
  hydrationAction.userBasedNutritionFilters
);

router.post("/favorite-items", hydrationAction.userFavoriteItems);
router.post(
  "/day-based-nutrition-data",
  hydrationAction.userDayBasedNutritionData
);
export default router;
