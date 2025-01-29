import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FastingController } from "./fasting/fasting.controller";
import { FastingPlansController } from "./fasting-plans/fasting-plans.controller";
import { FastingService } from "./services/fasting.service";
import { FastingPlansService } from "./services/fasting-plans.service";
import { FastingPackagesController } from "./fasting-packages/fasting-packages.controller";
import { FastingPackagesService } from "./services/fasting-packages/fasting-packages.service";

import { FastingPlanSchema, FastingPlan } from "./schemas/fasting-plan.schema";
import {
  FastingPackages,
  FastingPackagesSchema,
} from "./schemas/fasting-packages.schema";
import { ServiceResponse } from "@common/service-response";

import { UserFastingPlanSchema } from "./schemas/user-fasting-plan.schema";
import { UserFastingRequestSchema } from "./schemas/user-fasting-request.schema";
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "FastingPlan", schema: FastingPlanSchema },
      { name: "FastingPackages", schema: FastingPackagesSchema },
      { name: "UserFastingRequest", schema: UserFastingRequestSchema },
      { name: "UserFastingPlan", schema: UserFastingPlanSchema },
    ]),
  ],
  controllers: [
    FastingController,
    FastingPlansController,
    FastingPackagesController,
  ],
  providers: [
    FastingService,
    FastingPlansService,
    FastingPackagesService,
    ServiceResponse,
  ],
})
export class FastingModule {}
