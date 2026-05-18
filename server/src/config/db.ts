import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gigflow';
    
    mongoose.connection.on('connected', () => {
      console.log('📦 MongoDB database connection channel opened successfully.');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`⚠️ MongoDB operational transport error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔌 MongoDB database connection channel closed.');
    });

    await mongoose.connect(mongoUri);
  } catch (error) {
    console.error('❌ Critical failure initializing database lifecycle driver:', error);
    process.exit(1);
  }
};