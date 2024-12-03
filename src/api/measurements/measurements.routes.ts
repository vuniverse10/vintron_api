import { Request, Response, NextFunction, Router } from "express";
import { AnyZodObject, ZodError } from "zod";
import * as currentAction from "./measurements.handler";
import { Measurement } from "./measurements.model";
import { validateRequest } from "../../middlewares";
import { ParamsWithId } from "../../interfaces/ParamsWithId";
const router = Router();

router.get("/", currentAction.findAll);

router.get("/:sectionBasedFilter", currentAction.sectionBasedMeasurements);

router.get(
  "/:id",
  validateRequest({
    params: ParamsWithId,
  }),
  currentAction.getRecord
);

router.get(
  "/:id",
  validateRequest({
    params: ParamsWithId,
  }),
  currentAction.getRecord
);
router.post(
  "/",
  validateRequest({
    body: Measurement,
  }),
  currentAction.insertRecord
);

router.put(
  "/:id",
  validateRequest({
    params: ParamsWithId,
    body: Measurement,
  }),
  currentAction.updateRecord
);

router.delete(
  "/:id",
  validateRequest({
    params: ParamsWithId,
  }),
  currentAction.deleteRecord
);

export default router;
