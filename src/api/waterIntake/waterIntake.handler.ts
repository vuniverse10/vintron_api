import { Request, Response } from 'express';
import waterIntake from './waterIntake.model';

export const addWaterIntake = async (req: Request, res: Response): Promise<Response> => {
    const { userID, intakeDate, waterIntakePerLtr } = req.body;

    try {
        if (!userID || !intakeDate || waterIntakePerLtr === undefined) {
            return res.status(400).json({ message: "UserID, Date, liters not specified" });
        }
            const newRecord = new waterIntake({
                userID,
                intakeDate,
                waterIntakePerLtr: waterIntakePerLtr
            });
            await newRecord.save();

            return res.status(201).json({
                message: "Water intake created successfully",
                "Daywise-Liters": waterIntakePerLtr
            });
        }catch (err) {
        return res.status(500).json({ message: "Error while saving", error: err });
    }
};
