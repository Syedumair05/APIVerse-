import mongoose, { Document, Schema } from 'mongoose';

export interface IFavorite extends Document {
  countryCode: string;
  countryName: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FavoriteSchema: Schema = new Schema(
  {
    countryCode: {
      type: String,
      required: [true, 'Country code is required'],
      uppercase: true,
      trim: true,
      unique: true,
      index: true,
    },
    countryName: {
      type: String,
      required: [true, 'Country name is required'],
      trim: true,
    },
    userId: {
      type: String,
      default: 'default_user',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const FavoriteModel = mongoose.model<IFavorite>('Favorite', FavoriteSchema);
