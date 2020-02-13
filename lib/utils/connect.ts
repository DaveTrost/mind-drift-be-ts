import mongoose, { Connection } from 'mongoose';
import dotenv from 'dotenv';
import { parse } from 'url';

dotenv.config();

export default async (url = process.env.MONGODB_URI, options = { log: true }): Promise<typeof mongoose> => {
  
  if(options.log !== false) {
    mongoose.connection.on('connected', () => {
      const parsedUrl = parse(url);
      const redactedUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}:${parsedUrl.port}${parsedUrl.pathname}`;
      console.log(`Connected to MongoDB at ${redactedUrl}`);
    });
    mongoose.connection.on('disconnected', () => {
      console.log('Disconnected from MongoDB');
    });
    mongoose.connection.on('error', () => {
      console.log('Error connecting to MongoDB');
    });
  }

  return mongoose.connect(url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true 
  });

};

export const disconnect = async (): Promise<void> => {
  return mongoose.connection.close();
};
