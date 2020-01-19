import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { parse } from 'url';

dotenv.config();

export default (url = process.env.MONGODB_URI, options = { log: true }): void => {
  mongoose.connect(url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true 
  });

  mongoose.connection.on('connected', () => {
    if(options.log !== false) {
      const parsedUrl = parse(url);
      const redactedUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}:${parsedUrl.port}${parsedUrl.pathname}`;
      console.log(`Connected to MongoDB at ${redactedUrl}`);
    }
  });

  mongoose.connection.on('disconnected', () => {
    if(options.log !== false) {
      console.log('Disconnected from MongoDB');
    }
  });

  mongoose.connection.on('error', () => {
    if(options.log !== false) {
      console.log('Error connecting to MongoDB');
    }
  });
};
