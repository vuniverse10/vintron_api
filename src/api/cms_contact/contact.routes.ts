import { Request, Response, NextFunction, Router } from "express";
import { AnyZodObject, ZodError } from "zod";
import * as catReq from "./contact.handler";
import { Project } from "./contact.model";
import { validateRequest } from "../../middlewares";
import { ParamsWithId } from "../../interfaces/ParamsWithId";
const router = Router();

router.get("/", catReq.findAll);
router.get(
  "/:project_code",

  catReq.fetchProjectBasedDetails
);
router.get(
  "/:id",
  validateRequest({
    params: ParamsWithId,
  }),
  catReq.getRecord
);

router.post(
  "/",
  validateRequest({
    body: Project,
  }),
  catReq.insertRecord
);

router.put(
  "/:id",
  validateRequest({
    params: ParamsWithId,
    body: Project,
  }),
  catReq.updateRecord
);

router.delete(
  "/:id",
  validateRequest({
    params: ParamsWithId,
  }),
  catReq.deleteRecord
);

export default router;
