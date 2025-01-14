import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { PersonalTrainingService } from '../services/personalTraining.service';
import { CreatePersonalTrainingServiceDto } from '../dto/create-personal-training.dto';
import { PersonalTraining } from '../schemas/personal-training.schema';

@Controller('personal-training-services')
export class PersonalTrainingServicesController {
  constructor(
    private readonly PersonalTrainingService: PersonalTrainingService,
  ) {}
  @Post()
  create(
    @Body() CreatePersonalTrainingServiceDto: CreatePersonalTrainingServiceDto,
  ): Promise<PersonalTraining> {
    return this.PersonalTrainingService.create(
      CreatePersonalTrainingServiceDto,
    );
  }

  @Get()
  findAll(): Promise<{ label: string; value: string }[]> {
    return this.PersonalTrainingService.fetchPersonalTrainingList();
  }

  @Post('bulk-insert')
  async bulkInsert(
    @Body() personalTrainingData: { label: string; value: string }[],
  ): Promise<any> {
    return this.PersonalTrainingService.bulkCreate(personalTrainingData);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PersonalTraining> {
    return this.PersonalTrainingService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateHeightDto: CreatePersonalTrainingServiceDto,
  ): Promise<PersonalTraining> {
    return this.PersonalTrainingService.update(id, updateHeightDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.PersonalTrainingService.remove(id);
  }
}
