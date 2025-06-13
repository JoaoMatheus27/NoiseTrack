import { Router } from 'express';
import { saveMeasurement, getMeasurements } from './controllers/noiseController';

const router = Router();

router.post('/measurements', saveMeasurement);
router.get('/measurements/:userId', getMeasurements);

export default router;