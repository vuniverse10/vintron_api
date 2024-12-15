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

app.use("/v1", api);
app.use("/user/v1", user);
app.use("/nutrition/v1/", nutrition);
app.use("/hydration/v1/", hydration);
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
