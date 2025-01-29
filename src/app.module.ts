import { Module } from "@nestjs/common";
import { SentryGlobalFilter, SentryModule } from "@sentry/nestjs/setup";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import configuration from "config/configuration";
import { MongooseModule } from "@nestjs/mongoose";
import { HttpModule } from "@nestjs/axios";
import { Msg91Module } from "./msg91";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { AuthGuard, AuthModule } from "./auth";
import { UsersModule } from "./users";
import { JwtModule } from "@nestjs/jwt";
import { WorkoutModule } from "./workout/workout.module";
import { ExcelImportService } from "./excel-import/excel-import.service";
import { ExcelImportController } from "./excel-import/excel-import.controller";
import { MulterModule } from "@nestjs/platform-express";
import * as multer from "multer"; // Import multer here
import { WorkoutSchema } from "./excel-import/workout.schema";
import {
  WorkoutPlanObjective,
  WorkoutPlanObjectiveSchema,
} from "./excel-import/workout-plan-objectives.schema";
import { HydrationModule } from './hydration/hydration.module';
import { NutritionModule } from './nutrition/nutrition.module';
import { MealTypesController } from './meal-types/meal-types.controller';
import { FastingModule } from './fasting/fasting.module';

@Module({
  imports: [
    SentryModule.forRoot(),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: configuration().jwt.secretKey,
      // TODO: Config Token
    }),
    HttpModule,
    MongooseModule.forRoot(configuration().database.mongodbUri, {
      dbName: configuration().database.databaseName,
    }),
    AuthModule,
    Msg91Module,
    UsersModule,
    WorkoutModule,
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
    MongooseModule.forFeature([
      { name: "Workout", schema: WorkoutSchema },
      { name: "WorkoutPlanObjective", schema: WorkoutPlanObjectiveSchema },
    ]),
    HydrationModule,
    NutritionModule,
    FastingModule,
  ],
  controllers: [AppController, ExcelImportController, MealTypesController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    ExcelImportService,
  ],
})
export class AppModule {}
