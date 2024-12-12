import express from 'express';
import{ addWaterIntake} from '../waterIntake/waterIntake.handler';
const router = express.Router();

router.post('/waterIntake',addWaterIntake)

export default router;