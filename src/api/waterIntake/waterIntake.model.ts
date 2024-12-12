import mongoose, {Document, Schema} from "mongoose";
interface IWaterIntake extends Document {
    userID: string;
    intakeDate: Date;
    waterIntakePerLtr : Number;
    dailyGoal: number;
}
const waterIntakeSchema = new Schema({
    userID: { type:String, required:true },
    intakeDate: { type:Date, required:true },
    waterIntakePerLtr: { type:Number, required:true }, //water intake milliliters
    dailyGoal: { type:Number, required:false,default:2000 } // default daily goal 2000ml
})

const waterIntake = mongoose.model<IWaterIntake>('user_hydration_water_intake',waterIntakeSchema);
export default waterIntake;
