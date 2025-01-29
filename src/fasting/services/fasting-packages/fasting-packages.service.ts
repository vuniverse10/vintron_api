import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FastingPackages } from "src/fasting/schemas/fasting-packages.schema";
import { FastingPackagesDto } from "src/fasting/dto/fasting-packages.dto";
import { ServiceResponse } from "@common/service-response";

@Injectable()
export class FastingPackagesService {
  constructor(
    @InjectModel("FastingPackages")
    private readonly fastingPackagesModel: Model<FastingPackages>,
    private readonly serviceResponse: ServiceResponse
  ) {}
  async bulkCreate(packages): Promise<any> {
    try {
      return await this.fastingPackagesModel.insertMany(packages);
    } catch (err) {
      console.error("Error in bulkCreate", err);
      return { error: "Failed to insert bulk data" };
    }
  }

  async fetchFastingPlans(): Promise<{
    code: number;
    message: string;
    data: FastingPackages[];
  }> {
    const result = await this.fastingPackagesModel
      .find({}, "title fastingMethod feedDescription icon")
      .exec();
    return this.serviceResponse.apiResponse<FastingPackages[]>(
      result,
      "Fasting Packages"
    );
  }

  async findOne(id: string): Promise<{
    code: number;
    message: string;
    data: any;
  }> {
    const result = await this.fastingPackagesModel.findById(id).exec();

    if (result) {
      return {
        code: 200,
        message: "Fetching Fasting Packages",
        data: result,
      };
    } else {
      return {
        code: 204,
        message: "No Fasting Packages found",
        data: null,
      };
    }
  }
}
