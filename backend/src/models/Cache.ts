import mongoose, { Document, Schema } from 'mongoose';

export interface ICache extends Document {
  key: string;
  data: unknown;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CacheSchema: Schema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Auto-delete document after expiresAt timestamp
    },
  },
  {
    timestamps: true,
  }
);

export const CacheModel = mongoose.model<ICache>('Cache', CacheSchema);
