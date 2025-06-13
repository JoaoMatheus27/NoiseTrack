import { Request, Response } from 'express';
import { INoiseMeasurement } from '../models/noiseMeasurement';
import NoiseMeasurement from '../models/noiseMeasurement';

export const saveMeasurement = async (req: Request, res: Response) => {
  try {
    const { decibels, userId, location } = req.body;
    const newMeasurement: INoiseMeasurement = new NoiseMeasurement({
      decibels,
      userId,
      location,
      timestamp: new Date()
    });
    await newMeasurement.save();
    res.status(201).json(newMeasurement);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getMeasurements = async (req: Request, res: Response) => {
  try {
    const measurements = await NoiseMeasurement.find({ userId: req.params.userId })
      .sort({ timestamp: -1 });
    res.json(measurements);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};