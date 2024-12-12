import { Request, Response, NextFunction, Router } from 'express';
import { ZodError } from 'zod';
import * as fastingHandler from './fasting.handler';
import upload from '../../middleware/multerConfig';
import { validateRequest } from '../../middlewares';
import { ParamsWithId } from '../../interfaces/ParamsWithId';
import {  fastingDietSchema } from './fasting.diet.model';
import { fastingPlanSchema} from '../fasting/fasting.plan.model'

const router = Router();

router.post(
  '/addFastingDiet',
  validateRequest({ body: fastingDietSchema }),
  (req: Request, res: Response, next: NextFunction) => fastingHandler.addFastingdiet(req, res, next)
);

router.get(
  '/getFastingDiets',
  (req: Request, res: Response, next: NextFunction) => fastingHandler.getFastingdiet(req, res, next)
);

router.post(
  '/addFastingPlan',
  validateRequest({ body: fastingPlanSchema }),
  (req: Request, res: Response, next: NextFunction) => fastingHandler.addFastingPlans(req, res, next)
);

router.get(
  '/getFastingPlans',
  (req: Request, res: Response, next: NextFunction) => fastingHandler.getFastingPlans(req, res, next)
);

router.post(
  '/addFastingPlanForImage',
  upload.single('file'),
  validateRequest({ body: fastingPlanSchema }),
  (req: Request, res: Response, next: NextFunction) => fastingHandler.addFastingPlanForImage(req, res, next)
);

router.get(
  '/getFastingPlanForImage',
  (req: Request, res: Response, next: NextFunction) => fastingHandler.getFastingPlanForImage(req, res, next)
);

router.get(
  '/getFastingPlanForEachPlanType',
  (req: Request, res: Response, next: NextFunction) => fastingHandler.getFastingPlanForEachPlanType(req, res, next)
);

router.get(
  '/getMyPlanWindow',
  (req: Request, res: Response, next: NextFunction) => fastingHandler.getMyPlanWindow(req, res, next)
);

export default router;

