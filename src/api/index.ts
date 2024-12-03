import express from "express";
import MessageResponse from "../interfaces/MessageResponse";

import height from "./measurements/measurements.routes";
import faq from "./faqs/faq.routes";
import path from "path";
const router = express.Router();

router.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "API 🌏-Section",
  });
});

router.use("/measurements", height);

router.use("/faqs", faq);

export default router;
