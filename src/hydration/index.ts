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
router.post(
  "/fetch-water-remainder-details",
  hydrationAction.fetchUserWaterRemainder
);
router.post("/save-water-remainder", hydrationAction.saveUserWaterRemainder);
router.post("/save-water-intake", hydrationAction.saveUserWaterIntake);
router.post(
  "/hydration-statistics",
  hydrationAction.userDayBasedWaterStatistics
);
router.post("/hydration-reports", hydrationAction.userWaterFilters);

export default router;
