import { Schema, model } from 'mongoose';

const taxSchema = new Schema({
  fromDate: {
    type: Date,
    required: true
  },
  toDate: {
    type: Date,
    required: true
  },
  fromValue: {
    type: Number,
    required: true,
  },
  toValue: {
    type: Number,
    required: true,
  },
  taxType: {
    type: String,
    required: true,
    enum: ['CGST', 'SGST', 'IGST']
  },
  taxRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  taxAmount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create compound index to prevent duplicate entries
taxSchema.index(
  { fromDate: 1, toDate: 1, fromValue: 1, toValue: 1, taxType: 1 },
  { unique: true }
);

export default model('Tax', taxSchema);
