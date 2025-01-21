import { Module } from '@nestjs/common';
import { NutritionController } from './nutrition/nutrition/nutrition.controller';

@Module({
  controllers: [NutritionController]
})
export class NutritionModule {}
