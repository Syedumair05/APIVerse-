import mongoose from 'mongoose';
import { logger } from '../utils/logger';

let isConnected = false;

export const connectDatabase = async (): Promise<boolean> => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/apiverse';

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000,
    });
    isConnected = true;
    logger.info(`Successfully connected to MongoDB: ${mongoose.connection.host}`);
    return true;
  } catch (error: unknown) {
    isConnected = false;
    logger.warn(`MongoDB Connection Notice: Unable to connect to ${mongoUri}. Operating in offline/in-memory mode for cache & favorites.`);
    return false;
  }
};

export const getDbStatus = (): { connected: boolean; host?: string; name?: string } => {
  const state = mongoose.connection.readyState;
  return {
    connected: state === 1,
    host: state === 1 ? mongoose.connection.host : undefined,
    name: state === 1 ? mongoose.connection.name : undefined,
  };
};

export const disconnectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB.');
  }
};
