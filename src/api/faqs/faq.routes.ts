import { Request, Response, NextFunction, Router } from "express";
import { AnyZodObject, ZodError } from "zod";
import * as controllerAction from "./faq.handler";
import { Faq } from "./faq.model";
import { validateRequest } from "../../middlewares";
import { ParamsWithId } from "../../interfaces/ParamsWithId";
const router = Router();

router.get("/", controllerAction.findAll);
router.get(
  "/:id",
  validateRequest({
    params: ParamsWithId,
  }),
  controllerAction.getRecord
);
router.post(
  "/",
  validateRequest({
    body: Faq,
  }),
  controllerAction.insertRecord
);

router.put(
  "/:id",
  validateRequest({
    params: ParamsWithId,
    body: Faq,
  }),
  controllerAction.updateRecord
);

router.delete(
  "/:id",
  validateRequest({
    params: ParamsWithId,
  }),
  controllerAction.deleteRecord
);
export default router;
