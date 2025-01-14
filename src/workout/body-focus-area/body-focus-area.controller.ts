import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BodyFocusAreaService } from '../services/body-focus-area.service';
import { BodyFocusArea } from '../schemas/body-focus-area.schema';
import { CreateBodyFocusAreaDto } from '../dto/create-body-focus-area.dto';

@Controller('body-focus-area')
export class BodyFocusAreaController {
  constructor(private readonly bodyFocusAreaService: BodyFocusAreaService) {}

  @Post()
  async create(
    @Body() CreateBodyFocusAreaDto: CreateBodyFocusAreaDto,
  ): Promise<BodyFocusArea> {
    console.log(CreateBodyFocusAreaDto);
    return this.bodyFocusAreaService.create(CreateBodyFocusAreaDto);
  }

  @Get()
  async findAll() {
    return this.bodyFocusAreaService.fetchBodyFocusAreaList();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BodyFocusArea> {
    return this.bodyFocusAreaService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() UpdateBodyFocusAreaDto: CreateBodyFocusAreaDto,
  ): Promise<BodyFocusArea> {
    return this.bodyFocusAreaService.update(id, UpdateBodyFocusAreaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.bodyFocusAreaService.remove(id);
  }

  @Post('bulk-insert')
  async bulkInsert(@Body() bulkDataReq: { label: string }[]): Promise<any> {
    console.log(bulkDataReq);
    return this.bodyFocusAreaService.bulkCreate(bulkDataReq);
  }
}
