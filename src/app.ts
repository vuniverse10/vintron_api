import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import {
  findAll,
  insertRecord,
  getRecord,
  updateRecord,
  deleteRecord,
  sectionBasedMeasurements,
} from "./api/measurements/measurements.handler";

import * as middlewares from "./middlewares";
import api from "./api";
import user from "./user";
import MessageResponse from "./interfaces/MessageResponse";
import mongoose from "mongoose";
import config from "./config/config";
import logging from "./config/logging";
import nutrition from "./nutrition";
import hydration from "./hydration";
const nodemailer = require("nodemailer");

const bodyParser = require("body-parser");
require("dotenv").config();
const NAMESPACE = "Server";
const app = express();
const crypto = require("crypto");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

mongoose
  .connect(config.mongo.url, config.mongo.options)
  .then((result) => {
    logging.info(NAMESPACE, "Mongo Connected");
  })
  .catch((error) => {
    logging.error(NAMESPACE, error.message, error);
  });
//mongoose.set('useFindAndModify', false);

app.use(morgan("dev"));
app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0", // OpenAPI version
    info: {
      title: "Measurement API", // API title
      version: "1.0.0", // API version
      description: "API for managing measurements data",
    },
    servers: [
      {
        url: "http://localhost:3000", // You can change it to your live URL
      },
    ],
  },
  apis: ["./measurements.controller.js"], // Path to your API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: `Vintro Application is running on ${process.env.PORT} 🎓`,
  });
});

const heightToValue = [
  { height: "4'0\"", value: 121 },
  { height: "4'1\"", value: 122 },
  { height: "4'2\"", value: 123 },
  { height: "4'3\"", value: 124 },
  { height: "4'4\"", value: 125 },
  { height: "4'5\"", value: 126 },
  { height: "4'6\"", value: 127 },
  { height: "4'7\"", value: 128 },
  { height: "4'8\"", value: 129 },
  { height: "4'9\"", value: 130 },
  { height: "4'10\"", value: 131 },
  { height: "4'11\"", value: 132 },
  { height: "5'0\"", value: 133 },
  { height: "5'1\"", value: 134 },
  { height: "5'2\"", value: 135 },
  { height: "5'3\"", value: 136 },
  { height: "5'4\"", value: 137 },
  { height: "5'5\"", value: 138 },
  { height: "5'6\"", value: 139 },
  { height: "5'7\"", value: 140 },
  { height: "5'8\"", value: 141 },
  { height: "5'9\"", value: 142 },
  { height: "5'10\"", value: 143 },
  { height: "5'11\"", value: 144 },
  { height: "6'0\"", value: 145 },
  { height: "6'1\"", value: 146 },
  { height: "6'2\"", value: 147 },
  { height: "6'3\"", value: 148 },
  { height: "6'4\"", value: 149 },
  { height: "6'5\"", value: 150 },
  { height: "6'6\"", value: 151 },
  { height: "6'7\"", value: 152 },
  { height: "6'8\"", value: 153 },
  { height: "6'9\"", value: 154 },
  { height: "6'10\"", value: 155 },
  { height: "6'11\"", value: 156 },
  { height: "7'0\"", value: 157 },
];

const weightList = [
  { kg: 140, lbs: 309 },
  { kg: 141, lbs: 311 },
  { kg: 142, lbs: 313 },
  { kg: 143, lbs: 315 },
  { kg: 144, lbs: 317 },
  { kg: 145, lbs: 320 },
  { kg: 146, lbs: 322 },
  { kg: 147, lbs: 324 },
  { kg: 148, lbs: 326 },
  { kg: 149, lbs: 328 },
  { kg: 150, lbs: 331 },
  { kg: 151, lbs: 333 },
  { kg: 152, lbs: 335 },
  { kg: 153, lbs: 337 },
  { kg: 154, lbs: 340 },
  { kg: 155, lbs: 342 },
  { kg: 156, lbs: 344 },
  { kg: 157, lbs: 346 },
  { kg: 158, lbs: 348 },
  { kg: 159, lbs: 351 },
  { kg: 160, lbs: 353 },
  { kg: 161, lbs: 355 },
  { kg: 162, lbs: 357 },
  { kg: 163, lbs: 359 },
  { kg: 164, lbs: 362 },
  { kg: 165, lbs: 364 },
  { kg: 166, lbs: 366 },
  { kg: 167, lbs: 368 },
  { kg: 168, lbs: 370 },
  { kg: 169, lbs: 373 },
  { kg: 170, lbs: 375 },
  { kg: 171, lbs: 377 },
  { kg: 172, lbs: 379 },
  { kg: 173, lbs: 381 },
  { kg: 174, lbs: 384 },
  { kg: 175, lbs: 386 },
  { kg: 176, lbs: 388 },
  { kg: 177, lbs: 390 },
  { kg: 178, lbs: 392 },
  { kg: 179, lbs: 395 },
  { kg: 180, lbs: 397 },
  { kg: 181, lbs: 399 },
  { kg: 182, lbs: 401 },
  { kg: 183, lbs: 404 },
  { kg: 184, lbs: 406 },
  { kg: 185, lbs: 408 },
  { kg: 186, lbs: 410 },
  { kg: 187, lbs: 412 },
  { kg: 188, lbs: 415 },
  { kg: 189, lbs: 417 },
  { kg: 190, lbs: 419 },
  { kg: 191, lbs: 421 },
  { kg: 192, lbs: 423 },
  { kg: 193, lbs: 426 },
  { kg: 194, lbs: 428 },
  { kg: 195, lbs: 430 },
  { kg: 196, lbs: 432 },
  { kg: 197, lbs: 434 },
  { kg: 198, lbs: 437 },
  { kg: 199, lbs: 439 },
  { kg: 200, lbs: 441 },
];

const workoutModuleSections = {
  personal_training_services: [
    {
      label: "Gain Muscle",
      value: "Gain Muscle",
    },
    {
      label: "Decrease Body fat",
      value: "Decrease Body fat",
    },
    {
      label: "Lose a Lot of Weight",
      value: "Lose a Lot of Weight",
    },
    {
      label: "Stay Healthy & Fit",
      value: "Stay Healthy & Fit",
    },
    {
      label: "GET active again",
      value: "GET active again",
    },
  ],
  fitness_levels: [
    {
      label: "Beginner",
    },
    {
      label: "Intermediate",
    },
    {
      label: "Advanced",
    },
    {
      label: "Elite",
    },
  ],
  body_focus_area_list: [
    "Full body",
    "Boulder shoulders",
    "Massive biceps",
    "Broad chest",
    "Wide back",
    "Six-pack",
    "Strong legs",
  ],
  workouts_prefer: [
    "Full body",
    "Boulder shoulders",
    "Massive biceps",
    "Broad chest",
    "Wide back",
    "Six-pack",
    "Strong legs",
  ],
  workouts_prefer_timings: [
    {
      title: "Morning",
      value: "Morning",
      slots: ["04-06", "06-07", "07-08", "08-09", "09-10", "10-11", "11-12"],
    },
    {
      title: "Afternoon",
      value: "Afternoon",
      slots: ["01-02", "02-03", "03-04"],
    },
    {
      title: "Evening",
      value: "evening",
      slots: ["04-05", "05-06", "06-07", "07-08", "09-10"],
    },
    {
      title: "At Different Times",
      value: "At Different Times",
      slots: [
        "04-06",
        "06-07",
        "07-08",
        "08-09",
        "09-10",
        "10-11",
        "11-12",
        "01-02",
        "02-03",
        "03-04",
        "04-05",
        "05-06",
        "06-07",
        "07-08",
        "09-10",
        "10-11",
      ],
    },
  ],
  workout_plan_weeks: [
    { title: "Sunday", value: "SUN" },
    { title: "Monday", value: "MON" },
    { title: "Tuesday", value: "TUE" },
    { title: "Wednesday", value: "WED" },
    { title: "Thursday", value: "THU" },
    { title: "Friday", value: "FRI" },
    { title: "Saturday", value: "SAT" },
  ],
  workout_plan_duration: [
    {
      title: "Quick",
      value: "QUICK",
      duration: "20",
      durationDisplay: "0-20 Minutes",
    },
    {
      title: "Short",
      value: "SHORT",
      duration: "40",
      durationDisplay: "20-40 Minutes",
    },
    {
      title: "Average",
      value: "AVERAGE",
      duration: "60",
      durationDisplay: "40-60 Minutes",
    },
    {
      title: "Long",
      value: "Long",
      duration: "61",
      durationDisplay: "60+ Minutes",
    },
  ],
};
const calculateAge = (dob: any) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};
app.use("/v1", api);
app.use("/user/v1", user);
app.use("/nutrition/v1/", nutrition);
app.use("/hydration/v1/", hydration);
app.get("/api/heights", (req, res) => {
  return res.status(200).json({
    code: 200,
    message: "Fetching Heights",
    date: heightToValue,
  });
});

app.get("/api/weights", (req, res) => {
  return res.status(200).json({
    code: 200,
    message: "Fetching Weights",
    date: weightList,
  });
});

app.get("/api/workouts-sections", (req, res) => {
  return res.status(200).json({
    code: 200,
    message: "Fetching Workouts sections",
    date: workoutModuleSections,
  });
});

app.post("/api/calculate-age", (req, res) => {
  const { dob } = req.body;

  // Validate input
  if (!dob) {
    return res.status(400).json({
      error: "Date of Birth (dob) is required in 'YYYY-MM-DD' format.",
    });
  }

  try {
    const age = calculateAge(dob);
    res.json({ dob, age });
  } catch (err) {
    res.status(400).json({ error: "Invalid date format. Use 'YYYY-MM-DD'." });
  }
});
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
