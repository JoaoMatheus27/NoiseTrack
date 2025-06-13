import { Schema, model, Document } from 'mongoose';

// Interface
export interface INoiseMeasurement extends Document {
  decibels: number;
  userId: string;
  location?: string;
  timestamp: Date;
}

// Schema
const NoiseMeasurementSchema = new Schema<INoiseMeasurement>({
  decibels: { type: Number, required: true },
  userId: { type: String, required: true },
  location: { type: String },
  timestamp: { type: Date, default: Date.now }
});

// Exportação padrão do modelo
export default model<INoiseMeasurement>('NoiseMeasurement', NoiseMeasurementSchema);