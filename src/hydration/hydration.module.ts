import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HydrationController } from "./hydration/hydration.controller";
import { HydrationService } from "./services/hydration.service";
import {
  WaterIntakeRemainder,
  WaterIntakeRemainderSchema,
} from "./schema/waterIntakeRemainder.schema";
import {
  UserWaterHistory,
  UserWaterHistorySchema,
} from "./schema/userWaterHistory.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "WaterIntakeRemainder", schema: WaterIntakeRemainderSchema },
      { name: "UserWaterHistory", schema: UserWaterHistorySchema },
    ]),
  ],
  providers: [HydrationService],
  controllers: [HydrationController],
})
export class HydrationModule {}
