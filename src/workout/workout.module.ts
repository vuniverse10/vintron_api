import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { WorkoutService } from "./workout.service";
import { WorkoutController } from "./workout.controller";
import { WorkoutSchema } from "../excel-import/workout.schema";
import { HeightController } from "./height/height.controller";
import { WeightController } from "./weight/weight.controller";
import { HeightSchema } from "./schemas/height.schema";
import { WeightSchema } from "./schemas/weight.schema";
import { WeightService } from "./services/weight.service";
import { HeightService } from "./services/height.service";
import { PersonalTrainingServicesController } from "./personal_training_services/personal_training_services.controller";

import { PersonalTrainingService } from "./services/personalTraining.service";
import {
  PersonalTraining,
  PersonalTrainingSchema,
} from "./schemas/personal-training.schema";
import { FitnessLevelController } from "./fitness-level/fitness-level.controller";

import {
  FitnessLevel,
  FitnessLevelSchema,
} from "./schemas/fitness-level.schema";
import { FitnessLevelService } from "./services/fitness-level.service";
import { BodyFocusAreaController } from "./body-focus-area/body-focus-area.controller";
import {
  BodyFocusArea,
  BodyFocusAreaSchema,
} from "./schemas/body-focus-area.schema";
import { BodyFocusAreaService } from "./services/body-focus-area.service";
import { WorkoutPreferController } from "./workout-prefer/workout-prefer.controller";
import {
  WorkoutPrefer,
  WorkoutPreferSchema,
} from "./schemas/workout-prefer.schema";
import { WorkoutPreferService } from "./services/workout-prefer.service";
import { WorkoutsPreferTimingsController } from "./workouts-prefer-timings/workouts-prefer-timings.controller";

import {
  WorkoutsPreferTimings,
  WorkoutsPreferTimingsSchema,
} from "./schemas/workouts-prefer-timings.schema";
import { WorkoutsPreferTimingsService } from "./services/workouts-prefer-timings.service";
import { WorkoutPlanWeekController } from "./workout-plan-week/workout-plan-week.controller";

import {
  WorkoutPlanWeek,
  WorkoutPlanWeekSchema,
} from "./schemas/workout-plan-week.schema";

import { workoutPlanWeekService } from "./services/workoutPlanWeek.service";
import { WorkoutPlanDurationController } from "./workout-plan-duration/workout-plan-duration.controller";

import {
  WorkoutPlanDuration,
  WorkoutPlanDurationSchema,
} from "./schemas/workout-plan-duration.schema";
import { WorkoutPlanDurationService } from "./services/workout-plan-duration.service";
import { UserWorkoutsController } from "./user-workouts/user-workouts.controller";

import { UserWorkoutService } from "./services/user-workout.services";
import { UserWorkoutSchema, UserWorkout } from "./schemas/user-workout.schema";
import { GoalSettingsController } from "./goal-settings/goal-settings.controller";
import { ServiceResponse } from "@common/service-response";
import { GoalSchema } from "./schemas/goal-settings/goal.schema";
import { GoalService } from "./services/goal-settings/goal.service";
import { HealRestrictionsController } from "./heal-restrictions/heal-restrictions.controller";
import { HealthRestrictionsSchema } from "./schemas/goal-settings/health-restrictions.schema";
import { HealthRestrictionsService } from "./services/goal-settings/health-restrictions.service";
import { GoalSettingsSchema } from "./schemas/goal-settings/goal-settings.schema";
import { GoalSettingService } from "./services/goal-settings/goal-settings.service";
import { WorkoutPlanObjectiveService } from "./services/personal-objectives.service";
import {
  WorkoutPlanObjective,
  WorkoutPlanObjectiveSchema,
} from "./schemas/workout-plan-objectives.schema";
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Workout", schema: WorkoutSchema },
      { name: "Height", schema: HeightSchema },
      { name: "Weight", schema: WeightSchema },
      { name: "PersonalTraining", schema: PersonalTrainingSchema },
      { name: "FitnessLevel", schema: FitnessLevelSchema },
      { name: "BodyFocusArea", schema: BodyFocusAreaSchema },
      { name: "WorkoutPrefer", schema: WorkoutPreferSchema },
      { name: "WorkoutsPreferTimings", schema: WorkoutsPreferTimingsSchema },
      { name: "WorkoutPlanWeek", schema: WorkoutPlanWeekSchema },
      { name: "WorkoutPlanDuration", schema: WorkoutPlanDurationSchema },
      { name: "UserWorkout", schema: UserWorkoutSchema },
      { name: "Goals", schema: GoalSchema },
      { name: "HealthRestrictions", schema: HealthRestrictionsSchema },
      { name: "GoalSettings", schema: GoalSettingsSchema },
      { name: "WorkoutPlanObjective", schema: WorkoutPlanObjectiveSchema },
    ]),
  ],
  providers: [
    WorkoutService,
    WeightService,
    HeightService,
    PersonalTrainingService,
    FitnessLevelService,
    BodyFocusAreaService,
    WorkoutPreferService,
    WorkoutsPreferTimingsService,
    workoutPlanWeekService,
    WorkoutPlanDurationService,
    UserWorkoutService,
    ServiceResponse,
    GoalService,
    HealthRestrictionsService,
    GoalSettingService,
    WorkoutPlanObjectiveService,
  ],
  controllers: [
    WorkoutController,
    HeightController,
    WeightController,
    PersonalTrainingServicesController,
    FitnessLevelController,
    BodyFocusAreaController,
    WorkoutPreferController,
    WorkoutsPreferTimingsController,
    WorkoutPlanWeekController,
    WorkoutPlanDurationController,
    UserWorkoutsController,
    GoalSettingsController,
    HealRestrictionsController,
  ],
})
export class WorkoutModule {}
